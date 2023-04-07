import { useState, useRef, useEffect, useReducer, createContext } from 'react'
import { set_item, get_item } from './DataStore.js'
import { fetchData } from './fetchData.js'

export const AudioContext = createContext()

export default function AudioProvider(props){

	// prev data
	let prev = get_item('playlist')
	// central state
	const initialState = {
		tracks: prev,
		current: prev ? prev[0] : {} ,
		duration: 0,
		progress: 0,
		isPlaying: false,
		loop: false,
		shuffle: false,
		refreshing: false,
	}

	/*
		action object {
			type  str
			value object || str || int
		}
	*/
	function action(prev, action){
		const obj = {...prev}
		switch(action.type){
			case 'SET_TRACKS':
				obj.tracks = action.value
				set_item('playlist', action.value)
				break

			case 'ADD_TRACK':
				let n = [ action.value, ...prev.tracks.filter(i => i.id !== action.value.id) ]
				obj.tracks = n
				set_item('playlist', n)
				obj.current = action.value
				break
				
			case 'SET_CURRENT':
				obj.current = action.value
				break
			
			case 'SET_DURATION':
				obj.duration = action.value
				break

			case 'SET_PROGRESS':
				obj.progress = action.value
				break

			case 'SET_IS_PLAYING':
				obj.isPlaying = !prev.isPlaying
				break
				

			case 'SET_LOOP':
				obj.loop = !prev.loop
				break
				

			case 'SET_SHUFFLE':
				obj.shuffle = !prev.shuffle
				break
				

			case 'SET_REFRESHING':
				obj.refreshing = !prev.refreshing
				break

			default:
				throw new Error('Invalid choice in useReducer.')
		}

		return obj
	}

	/* reducer statement for values of player */
	const [ state, dispatch ] = useReducer(action, initialState)
	const [ ended, setEnded ] = useState(false) // track end of the current playing track
	const [ error, setError ] = useState(false) // for setting error object for audio player

	/* Refernce variables */
	const audio_player = useRef();

	/* timer id */
	let timerID;

	/* meta functions */

	// whether a track is present in playlist or not
	function isThere(id){
		return (
			state.tracks.filter(i => i.id === id).length > 0
		)
	}
	// return track index
	function trackIndex(id){
		return state.tracks.findIndex(i => i.id === id)
	}
	// random number generator for giver upper and lower
	function random(l, u){
		return Math.round(Math.random()*u+l)
	}
	// seek to a given time
	function changeRange(value){
		audio_player.current.currentTime = value
	}

	// update range to current time
	function whilePlaying(){
		dispatch({
			type: 'SET_PROGRESS',
			value: audio_player.current.currentTime
		})
	}
	// remove track from the playlist
	function removeTrack(id){
		dispatch({
			type: 'REMOVE_TRACK',
			value: id
		})
	}
	// play random except the current
	function shufflePlay(id){ // id of the current playing track
		let ind = 0
		do{
			ind = random(0, state.tracks.length - 1);
		}while(state.tracks[ind].id === id);

		let n = state.tracks[ind]
		dispatch({
			type: 'SET_CURRENT',
			value: n
		})
		load(n)
	}
	// play next function
	function playNext(id){
		let ind = trackIndex(id)
		ind = (ind + 1) % state.tracks.length;

		let n = state.tracks[ind]
		dispatch({
			type: 'SET_CURRENT',
			value: n
		})
		load(n)
	}
	// play previous track
	function playPrev(id){
		let ind = trackIndex(id)
		ind -= 1
		if(ind < 0){
			ind += state.tracks.length
		}

		let n = state.tracks[ind]
		dispatch({
			type: 'SET_CURRENT',
			value: n
		})
		load(n)
	}
	// toggle play and pause
	function togglePlay(){
		let prev = state.isPlaying

		if(prev){
			audio_player.current.pause()
			clearInterval(timerID)
		} else {
			audio_player.current.play()
			timerID = setInterval(() => {
				whilePlaying()
			}, 1000)			
		}
		dispatch({
			type: 'SET_IS_PLAYING'
		})

	}
	// load the current in stream
	async function load(curr){

		let newCurrent = null;
		const expiry_offset = curr.expires - Math.round(Date.now() / 1000);
		if( expiry_offset < 0){
			dispatch({
				type: 'SET_REFRESHING'
			})
			newCurrent = await refreshId(curr.id)
			dispatch({
				type: 'SET_REFRESHING'
			})
		}

		dispatch({
			type: 'SET_CURRENT',
			value: newCurrent || curr
		})

		const urlSource = newCurrent ? newCurrent.streams[curr.streams.length - 1].url : curr.streams[curr.streams.length - 1].url

		audio_player.current.src = urlSource

		togglePlay()
	}
	// function to refresh a item with given id
	async function refreshId(id){
		let r = await fetchData(id)
		dispatch({
			type: 'ADD_TRACK',
			value: r
		})
		return r
	}

	useEffect(() => {
		// getting total duration of the track
		const seconds = Math.floor(audio_player.current.duration)
		dispatch({
			type: 'SET_DURATION',
			value: seconds
		})

		// to simple play next song
		audio_player.current.addEventListener('ended', (e) => {
			if(state.loop) { return }
			if(state.shuffle){
				shufflePlay(current.id)
			} else {
				playNext(current.id)
			}
		})
	}, [audio_player?.current?.loadedmetadata, audio_player?.current?.readyState])

	/* Provider Value */
	const providerValue = {
		load,
		togglePlay,
		playNext,
		playPrev,
		removeTrack,
		isThere,
		changeRange,
		refreshId,
		dispatch,
		...state
	};

	return (
		<AudioContext.Provider value={providerValue}>
			<audio 
				loop={state.loop}
				ref={audio_player}
				className="hidden"
				preload="metadata"
			></audio>
			{
				props.children
			}
		</AudioContext.Provider>
	);
}
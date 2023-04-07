import { useContext } from 'react'
import { AudioContext } from '../utils/AudioContext.jsx'
import Track from '../components/Track'
import data from '../utils/data.json'

export default function Playlist(props){

	const state = useContext(AudioContext)

	return (
			<ul className="boxes-wrapper mb-24">
				{
					state.tracks.map((i, ind) => (
						<Track key={i.id} {...i} 
							current={state.current} 
							setCurrent={() => state.dispatch({
								type: 'SET_CURRENT',
								value: i
							})} 
							load={state.load}
							refreshing={state.refreshing} 
							remove_track={state.remove_track}
						/>
					))	
				}
			</ul>
	)
}
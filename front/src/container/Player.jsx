import { Slider } from '@mui/material';
import { AudioContext } from '../utils/AudioContext.jsx'
import { useState, useContext } from 'react'
import { Circle, Play, Pause, ArrowLeft, ArrowsClockwise, Shuffle, SkipForward, SkipBack } from 'phosphor-react'

function calc_time(secs){
	const mins = Math.floor(secs / 60)
	const ret_mins = mins < 10 ? `0${mins}` : mins+''
	const seconds = Math.floor(secs % 60)
	const ret_secs = seconds < 10 ? `0${seconds}` : seconds+''
	return `${ret_mins}:${ret_secs}`
}

function Button(props){

	let {r , ...rest} = props

	return (
		<button {...rest} className={"relative " + props.className}>
			{
				props.r && props.r({
					weight: 'fill',
					className: `${props.selected ? 'fill-green-500' : 'fill-black'}`,
					size: '25'
				})
			}
			{
				props.selected && <Circle size={6} weight="fill" className="absolute left-1/2 fill-green-500 -ml-[3px] mt-1" />
			}
			{
				props.children
			}
		</button>
	)
}

export default function Player(props){

	const state = useContext(AudioContext)
	const thumb = state.current && state.current.thumbnails.at(-1)['url']

	return (
		<div className="fixed w-full h-full top-0 left-0 bg-white flex flex-col pb-8">
			<header className="w-full flex items-center p-3 py-6 pb-0 relative">
				<button className="p-2 absolute" onClick={() => props.setShowPlayer(false)}>
					<ArrowLeft weight="bold" className="text-black" size={20} />
				</button>
				<h1 className="text-black font-bold text-md uppercase mx-auto">
					Playing
				</h1>
			</header>

			<div className="w-full aspect-square overflow-hidden my-8">
				<img src={thumb} alt="" className="w-full h-full scale-150 object-cover" />
			</div>


			<div className="px-6">
				<div className="text-center w-full">
					<h1 className="heading-level-2 text-xl text-black font-bold">
						{ state.current.title }
					</h1>
					<p className="text-black">
						{ state.current.author }
					</p>
				</div>

				<div className="flex items-center justify-around w-full my-2">
					<p>{ state.progress && !isNaN(state.progress) && calc_time(state.progress) }</p>
					<Slider
						className="mx-3"
						value={state.progress}
						max={state.duration || 100}
						onChange={(e) => {
							let value = e.target.value
							state.changeRange(value)
							state.dispatch({
								type: 'SET_PROGRESS',
								value: value
							})
						}}
					/>
					<p>{ state.duration && !isNaN(state.duration) && calc_time(state.duration) || '00:00' }</p>
				</div>

				<div className="flex justify-around items-center my-4">
					<Button
						selected={state.loop}
						r={(p) => <ArrowsClockwise {...p} />} 
						onClick={() => state.dispatch({
							type: 'SET_LOOP'
						})}
					/>

					<Button
						onClick={() => {
							state.playPrev(state.current.id)
						}}
						r={(p) => <SkipBack {...p} />}
					/>

					<Button 
						className="bg-[#f02d65] text-black p-4 rounded-full"
						onClick={() => state.togglePlay()}
					>
						{
							state.isPlaying ?
							<Pause weight="fill" size={25} />
							:
							<Play weight="fill" size={25} />
						}
					</Button>

					<Button
						onClick={() => {
							state.playNext(state.current.id)
						}}
						r={(p) => <SkipForward {...p} />}
					/>

					<Button 
						selected={state.shuffle}
						r={(p) => <Shuffle {...p} />} 
						onClick={() => state.dispatch({
							type: 'SET_SHUFFLE'
						})}
					/>
				</div>
			</div>

		</div>
	)
}
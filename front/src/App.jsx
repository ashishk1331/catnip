import Header from './components/Header'
import Playlist from './container/Playlist'
import Player from './container/Player'
import URLForm from './container/URLForm'
import MiniPlayer from './components/MiniPlayer'

import { useState, useRef, useEffect } from 'react'
import AudioProvider from './utils/AudioContext.jsx'

export default function App(){

	const url_form = useRef() // form ref
	const [ showPlayer, setShowPlayer ] = useState(false) // state to tell whether to show the menu or not

	// toggle theme variable
	function toggle_theme(){
		console.log(localStorage.theme)
		if (localStorage.theme === "light") {
			document.documentElement.classList.add('dark')
			set_item('theme', 'dark')
		} else {
			document.documentElement.classList.remove('dark')
			set_item('theme', 'light')
		}
	}

	return (
		<AudioProvider>
			<div className="relative">
				<Header url_form={url_form} toggle_theme={toggle_theme} />
				<Playlist />
				<URLForm url_form={url_form} />
				<MiniPlayer setShowPlayer={setShowPlayer} />
				{
					showPlayer && <Player setShowPlayer={setShowPlayer} />
				}
			</div>
		</AudioProvider>
	)
}
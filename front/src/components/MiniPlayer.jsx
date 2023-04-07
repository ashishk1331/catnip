import { useContext } from 'react'
import { AudioContext } from '../utils/AudioContext.jsx'
import { Play, Pause, MusicNote } from 'phosphor-react'

function cn(...classes){
    return classes.filter(Boolean).join(' ')
}

export default function MiniPlayer(props){
	
    const state = useContext(AudioContext)
    const thumb = state.current ? state.current.thumbnails[1]['url'] : null

	return (
		state.current && <div 
            className="MiniPlayer fixed bottom-0 flex items-center p-4 px-6 mx-1 m-[12px] left-[6px] rounded-md overflow-hidden"
            style={{
                width: 'calc(100% - 24px)',
                backgroundColor: 'hsl(var(--color-neutral-30))'
            }}
            >

            <div 
            	className="absolute inset-0 w-full h-[4px] bg-[hsl(var(--color-primary-100))]" 
            	style={{
            		width: ( Math.round( state.progress / state.duration * 100 ) || 1 ) + '%'
            	}}
            />
            <div className="flex items-center" onClick={() => props.setShowPlayer(true)}>
    			<div className="w-[48px] bg-gray-200 aspect-square overflow-hidden rounded-md relative">
    				<img src={thumb || ''} alt="" className="w-full h-full scale-125 object-cover" />
                    <div className="absolute inset-0 w-full h-full bg-[#f02d6544] flex">
                        <MusicNote weight="fill" size={32} className={cn("m-auto fill-white ", state.isPlaying ? "animate-spin ": "")} style={{
                            animationDuration: '3s'
                        }} />
                    </div>
    			</div>

    			<div className="flex flex-col mx-3 cursor-pointer w-[200px]">
    				<h1 className="font-bold text-black w-full overflow-hidden h-[1.5em] turncate">{state.current && state.current.title}</h1>
    				<p className="text-black">{state.current && state.current.author}</p>
    			</div>
            </div>

			<div className="ml-auto">
				<button 
					className="button is-text is-only-icon"
					onClick={() => {
                        state.togglePlay()
                }}>
					{
						state.isPlaying ?
						<Pause weight="fill" size={24} className="fill-black" />
						:
						<Play weight="fill" size={24} className="fill-black" />
					}
				</button>
			</div>
		</div>
	)
}
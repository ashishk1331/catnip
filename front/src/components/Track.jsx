import { Trash } from 'phosphor-react'

function cn(...classes){
	return classes.filter(Boolean).join(' ')
}

export default function Track(props){

	const thumb = props.thumbnails[1]['url']

	return (
		<li className="box flex">

			<div className="flex items-center" onClick={() => { 
					if(!props.refreshing){
						props.setCurrent(props)
						props.load(props)
					}
				}}>
				{/* thumbnail for the track */}
				<div className="w-[58px] min-w-[58px] aspect-square flex bg-gray-200 overflow-hidden rounded-md shadow-xl">
					{
						props.refreshing ?
						<div className="loader m-auto" />
						:
						<img src={thumb} alt="" className="w-full h-full scale-100 object-cover m-auto" />
					}
				</div>

				{/* info section with Title and Author */}
				<div className="flex flex-col cursor-pointer mx-3 w-full">
					<h1 
						className={cn("font-bold ", props.current && props.current.id === props.id ? "text-green-500" : "text-black" )}
					>{props.title}</h1>
					<p>{props.author}</p>
				</div>
			</div>

			{/* button tray / for now only delete button */}
			<button className="button is-text is-only-icon m-auto mr-0" onClick={() => {
				props.remove_track(props.id)
			}}>
				<Trash weight="fill" size={20} className="fill-[#f02d65]" />
			</button>
		</li>
	)
}
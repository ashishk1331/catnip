import { useContext } from 'react'
import { AudioContext } from '../utils/AudioContext.jsx'
import { X, ArrowLeft, Warning } from 'phosphor-react'
import { useState } from 'react'
import { fetchData } from '../utils/fetchData'

function Alert(props){
	return props.message && <p className="flex items-center italic u-color-text-danger">
			<Warning weight="fill" className="mr-1" />
			{ props.message }
		</p>
}

function get_video_id(url){
	// regex for https://youtu.be/e0pL7PXskpQ type url
	let re = /(https:\/\/)?(youtu.be\/)(?<id>.+)/gm

	if(re.test(url)){
		url = url.substring(url.lastIndexOf('/'))
		if(url.includes('?')){
			url = url.substring(0, url.indexOf('?'))
		}
		return url
	}

	// regex for https://www.youtube.com/watch?v=jRWw6TW8a1Y type url
	re = /(https:\/\/)?(www.)?(youtube\.com\/watch\?v=)(?<id>.+)/gm

	if(re.test(url)){
		url = url.substring(url.indexOf('v=')+2)
		if(url.includes('?')){
			url = url.substring(0, url.indexOf('?'))
		}
		return '/' + url
	}

	// for live urls
	re = /(https:\/\/)?(www\.)?youtube\.com\/live\/(?<id>.+)\?/gm

	if(re.test(url)){
		url = url.substring(url.lastIndexOf('/'))
		if(url.includes('?')){
			url = url.substring(0, url.indexOf('?'))
		}
		return url
	}

	return null
}

export default function URLForm(props){

	/* state variables */
	const state = useContext(AudioContext)
	const [ isLoading, setIsLoading ] = useState(false) // loading state tracker
	const [ message, setMessage ] = useState("") // error message state holder

	return (
		<dialog className="modal" ref={props.url_form}>
			<form className="modal-form" onSubmit={async (e) => {
				e.preventDefault()
				setIsLoading(true)
				const url = e.target.url.value.trim()
				if(!url){
					setMessage('Enter a valid url')
					return;
				} else {
					const id = get_video_id(url)
					if(id){
						let r = await state.refreshId(id)
						state.dispatch({
							type: 'SET_CURRENT',
							value: r
						})
					}
					e.target.reset()
					props.url_form.current.close()
				}
				setIsLoading(false)
			}}>
				 <header className="modal-header">
			      <h4 className="modal-title heading-level-5 text-lg font-medium">Add track</h4>
			      <button
			        className="button is-text is-small is-only-icon"
			        aria-label="Close modal"
			        onClick={() => {
			        	props.url_form.current.close()
			        }}
			      >
			        <X weight="bold" size={20} />
			      </button>
			    </header>
				{
					isLoading ? 
					<div className="w-full flex my-8">
						<div className="loader m-auto" />
					</div>
					:
					<>
						<div className="my-3">
					    	<label htmlFor="url" className="cursor-pointer lowercase">Url of YT video</label>
					    	<input 
					    		id="url"
					    		name="url"
					    		type="text"
					    		placeholder="paste the url here..."
					    	/>
					    </div>
					    <Alert message={message} />

					    <div className="modal-footer">
					      <div className="u-flex u-main-end u-gap-16">
					        <button className="button uppercase">
					          Add
					        </button>
					      </div>
					    </div>
					</>
				}

			  </form>			
		</dialog>
		)
}
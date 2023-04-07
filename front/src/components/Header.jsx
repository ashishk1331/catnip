import logo from '../assets/napster_logo_pink.svg'
import { Plus, Moon, Sun } from 'phosphor-react'

export default function Header(props){

	return (
		<header 
			className="w-full flex items-center p-4"
		>
			<div className="flex w-10 mr-auto items-center">
				<img src={logo} alt="Sippp logo" className=" w-full object-cover m-auto" />
				<h1 className="text-2xl tracking-wide lowercase ml-2 text-[hsl(var(--color-primary-100))] flex">
					cat
					<p className="font-bold"> nip </p>
				</h1>
			</div>
			<button className="mx-4 button is-only-icon is-text" onClick={() => {
				props.toggle_theme()
			}}>
				<Moon size={25} weight="fill" />
			</button>
			<button className="button" onClick={() => {
				props.url_form.current.showModal()
			}}>
				<Plus size={14} weight="bold" />
				Add
			</button>
		</header>
	)
}
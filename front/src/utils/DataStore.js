if(!localStorage.getItem('playlist')){
	localStorage.setItem('playlist', '[]')
}
if(!localStorage.getItem('theme')){
	localStorage.setItem('theme', 'light')
}

export function set_item(key, value){
	const prev = get_item('playlist')
	localStorage.setItem(key, JSON.stringify(value));
}

export function get_item(item_name){
	return JSON.parse(localStorage.getItem(item_name))
}

export function remove_item(item){
	let prev = get_item('playlist')
	localStorage.setItem('playlist', JSON.stringify( prev.filter(i => i.id !== item.id)));
}
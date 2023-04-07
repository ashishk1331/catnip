export const fetchData = async (id) => {
	let r = await fetch('/id', {
		method: 'post',
		body: JSON.stringify({
			'id': id
		})
	})
	r = r.json()
	return r
}
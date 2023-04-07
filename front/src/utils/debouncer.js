export const debounce = (fn, ms) => {
	let timerID;
	return function() {
		if(timerID) { clearTimeout(timerID) }
		setTimeout(fn, ms)
	}
}
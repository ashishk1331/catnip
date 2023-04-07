from pytube import YouTube as yt
from time import time

def generate(id):
	resp = yt('https://youtu.be/'+id)
	info = resp.vid_info['videoDetails']
	data = {}
	data['created'] = round(time())
	data['id'] = info['videoId']
	data['title'] = info['title']
	data['thumbnails'] = info['thumbnail']['thumbnails']
	data['author'] = resp.author
	info = resp.vid_info['streamingData']
	data['streams'] = []
	data['expiresInSeconds'] = info['expiresInSeconds']
	data['expires'] = data['created'] + int(info['expiresInSeconds'])
	streams = resp.streams.filter(mime_type='audio/webm').order_by(attribute_name='abr')
	for i in streams:
		info = {}
		info['abrInKBPS'] = i.abr.replace('kbps','')
		info['acodec'] = i.audio_codec
		info['mime/type'] = i.mime_type
		info['url'] = i.url
		data['streams'].append(info)
	return data
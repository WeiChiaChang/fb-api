import request from '../utils/request'

export async function getPosts() {
  const posts = (await request.get('/posts')).data
  return posts
}

export async function updateThumbStatus (payload) {
  return (await request.put('/posts', {
    thumbnail: payload.thumbnail,
    name: payload.name,
    blueCheck: payload.blueCheck,
    comment: payload.comment,
    emojiNum: payload.emojiNum,
    shareNum: payload.shareNum,
    dateTime: payload.dateTime,
    thumbUp: payload.thumbUp,
    videoThumbnail: payload.videoThumbnail,
    videoUrl: payload.videoUrl,
    videoTitle: payload.videoTitle,
    videoDescrption: payload.videoDescrption
  })).data
}

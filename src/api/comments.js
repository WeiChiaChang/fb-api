import request from '../utils/request'

export async function getComments () {
  const comments = (await request.get('/comments')).data
  return comments
}

export async function addComment (form) {
  const comment = (await request.post('/comments', form)).data
  return comment
}

export async function updateCommentThumbStatus (payload, id) {
  return (await request.put(`/comments/${id}`, {
    thumbnail: payload.thumbnail,
    name: payload.name,
    blueCheck: payload.blueCheck,
    comment: payload.comment,
    emojiNum: payload.emojiNum,
    shareNum: payload.shareNum,
    commentNum: payload.commentNum,
    dateTime: payload.dateTime,
    thumbUp: payload.thumbUp,
    commentThread: payload.commentThread
  })).data
}

export async function deleteComment (commentId) {
  return request({
    url: `/comments/${commentId}`,
    method: 'delete'
  })
}
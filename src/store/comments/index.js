import { getComments, deleteComment } from '../../api/comments'

export default {
  namespaced: true,
  state: {
    comments: {}
  },
  mutations: {
    SET_COMMENTS (state, data) {
      state.comments = data
    },
    DELETE_COMMENT (state, id) {
      let index = state.comments.findIndex(comment => comment.id === id)
      state.comments.splice(index, 1)
    }
  },
  actions: {
    async getComments ({ commit }) {
      const data = await getComments();
      commit('SET_COMMENTS', data);
    },
    async deleteComment ({ commit }, id) {
      await deleteComment(id);
      commit('DELETE_COMMENT', id);
    }
  }
}

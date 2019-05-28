import { getPosts, updateThumbStatus } from '../../api/posts'

export default {
  namespaced: true,
  state: {
    posts: []
  },
  mutations: {
    SET_POSTS (state, data) {
      state.posts = data
    }
  },
  actions: {
    async getPosts ({ commit }) {
      const data = await getPosts();
      commit('SET_POSTS', data);
    },
    async updatePosts ({ payload }) {
      await updateThumbStatus(payload)
    }
  }
}

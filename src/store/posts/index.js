import { getPosts, updateThumbStatus } from '../../api/posts'

export default {
  namespaced: true,
  state: {
    posts: []
  },
  mutations: {
    SET_POSTS (state, data) {
      state.posts = data
    },
    TOGGLE_THUMB (state) {
      state.posts.thumbUp = !state.posts.thumbUp
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

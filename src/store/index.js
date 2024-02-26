import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  user:null,
	  onUpdateListCallback:null
  },
  mutations: {
  },
  actions: {
	  onUpdateList({ state },callback){
		  state.onUpdateListCallback = callback
	  },
	  updateList({ state },params){
		  if(state.onUpdateListCallback && typeof state.onUpdateListCallback === 'function'){
			  state.onUpdateListCallback(params)
		  }
	  },
	  // 存储登录状态
	  login({ state },user){
		  state.user = user
		  window.localStorage.setItem('user',JSON.stringify(user))
		  window.localStorage.setItem('token',user.token)
	  },
	  // 初始化用户信息
	  initUser({ state }){
		  let user = window.localStorage.getItem('user')
		  state.user = user ? JSON.parse(user) : null
	  },
	  // 清除登录状态
	  logout({ state }){
		  state.user = null
		  window.localStorage.removeItem('user')
		  window.localStorage.removeItem('token')
	  }
  },
  modules: {
  }
})

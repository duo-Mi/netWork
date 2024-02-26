import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
	routes:[{
		path:"/login",
		name:"login",
		meta:{
			title:"登录页"
		},
		component:()=>import('./pages/login.vue')
	},{
		path:"/",
		name:"layout",
		component:()=>import('./pages/layout.vue'),
		redirect:{ 
			name:"index",
		},
		children:[{
			path:"/index",
			name:"index",
			component:()=>import('./pages/template/index.vue'),
		},{
			path:"/share",
			name:"share",
			component:()=>import('./pages/template/share.vue'),
		}]
	},{
		path:"/shareurl",
		name:"shareurl",
		component:()=>import('./pages/shareurl.vue'),
	}]
})

// 路由守卫
router.beforeEach((to,from,next)=>{
	// 获取token
	let token = window.localStorage.getItem('token')
	let user = window.localStorage.getItem('user')
	// 已登录
	if(token && user){
		// 防止重复登录
		if(to.path === '/login'){
			Vue.prototype.$Message.error('请勿重复登录')
			return next({ name:from.name ? from.name : 'index' })
		}
		next()
	} else {
		if(to.path === '/login'){
			return next()
		}
		// 未登录
		Vue.prototype.$Message.error('请先登录')
		next({ name:"login" })
	}
})

export default router
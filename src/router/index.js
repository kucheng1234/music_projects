import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '../views/Recommend.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/recommend'
  },
  {
    path: '/recommend',
    name:'Recommend',
    component:Recommend,
  },
  {
    path: '/hot',
    name:'Hot',
    component:()=>import('../views/Hot.vue')
  },
  {
    path: '/search',
    name:'Search',
    meta:{
      hideNav:true
    },
    component:()=>import('../components/Search.vue')
  },
  {
    path: '/list/:id',
    name:'List',
    props:true,
    meta:{
      hideNav:true,
    },
    component:()=>import('../components/List.vue')
  },
  {
    path: '/fullpage',
    name:'FullPage',
    props:true,
    meta:{
      hideNav:true,
    },
    component:()=>import('../components/FullPage.vue')
  },
  {
    path:'/mv/:id',
    name:'Mv',
    props:true,
    meta:{
      hideNav:true,
      playNav:true,
    },
    component:()=>import('../components/Mv.vue')
  },
  {
    path:'/songlist/:id',
    name:'Songlist',
    props:true,
    meta:{
      hideNav:true,
    },
    component:()=>import('../components/Songlist.vue')
  },
  {
    path: '/albumlist/:id',
    name:'AlbumList',
    props:true,
    meta:{
      hideNav:true,
    },
    component:()=>import('../components/AlbumList.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router

import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: function () { 
        return import('./views/login.vue')
      }
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: function () { 
        return import('./views/signup.vue')
      }
    },
    {
      path: '/feed',
      name: 'Feed',
      component: function () { 
        return import('./views/feed.vue')
      }
    },
    {
      path: '/tag_search',
      name: 'Tag Search',
      component: function () { 
        return import('./views/tag_search.vue')
      }
    },
    {
      path: '/add_question',
      name: 'Post Question',
      component: function () { 
        return import('./views/post_question.vue')
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: function () { 
        return import('./views/profile.vue')
      }
    },
    {
      path: '/favourites',
      name: 'Favourites',
      component: function () { 
        return import('./views/favourites.vue')
      }
    },
    {
      path: '/read-later',
      name: 'Read Later',
      component: function () { 
        return import('./views/read-later.vue')
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: function () { 
        return import('./views/logout.vue')
      }
    },
    {
      path: '/edit-profile',
      name: 'Edit Profile',
      component: function () { 
        return import('./views/edit-profile.vue')
      }
    },
    // {
    //   path: '/survey',
    //   name: 'Survey',
    //   component: function () { 
    //     return import('./survey/index.html')
    //   }
    // }
  ]
})

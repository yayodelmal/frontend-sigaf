import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/my',
    name: 'My',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "My" */ '../views/My.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () =>
          import(/* webpackChunkName: "Dashboard"*/ '../views/Dashboard.vue')
      },
      {
        path: 'mantenedor',
        name: 'Mantenedor',
        component: () =>
          import(
            /* webpackChunkName: "Mantenedor"*/ '../views/maintenance/Index.vue'
          ),
        children: [
          {
            path: 'aulas',
            component: () =>
              import(
                /* webpackChunkName: "Classroom"*/ '../views/maintenance/Classroom.vue'
              )
          },
          {
            path: 'estado-ticket',
            component: () =>
              import(
                /* webpackChunkName: "StatusTicket"*/ '../views/maintenance/StatusTicket.vue'
              )
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('access_token')

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  next()
})

export default router

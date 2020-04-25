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
          import(/* webpackChunkName: "Dashboard" */ '../views/Dashboard.vue')
      },
      {
        path: 'ticket',
        name: 'Ticket',
        component: () =>
          import(/* webpackChunkName: "Ticket" */ '../views/Ticket.vue')
      },
      {
        path: 'mantenedor',
        name: 'Mantenedor',
        component: () =>
          import(
            /* webpackChunkName: "Maintenance" */ '../views/maintenance/Index.vue'
          ),
        children: [
          {
            path: 'aulas',
            component: () =>
              import(
                /* webpackChunkName: "Classroom" */ '../views/maintenance/Classroom.vue'
              )
          },
          {
            path: 'estado-ticket',
            component: () =>
              import(
                /* webpackChunkName: "EstadoTicket" */ '../views/maintenance/StatusTicket.vue'
              )
          },
          {
            path: 'estado-final',
            component: () =>
              import(
                /* webpackChunkName: "EstadoFinal" */ '../views/maintenance/FinalStatus.vue'
              )
          },
          {
            path: 'motivo-ticket',
            component: () =>
              import(
                /* webpackChunkName: "MotivoTicket" */ '../views/maintenance/MotiveTicket.vue'
              )
          },
          {
            path: 'tipo-ticket',
            component: () =>
              import(
                /* webpackChunkName: "TipoTicket" */ '../views/maintenance/TypeTicket.vue'
              )
          },
          {
            path: 'prioridad-ticket',
            component: () =>
              import(
                /* webpackChunkName: "PriodidadTicket" */ '../views/maintenance/PriorityTicket.vue'
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

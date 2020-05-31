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

    component: () => import(/* webpackChunkName: "My" */ '../views/My.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () =>
          import(
            /* webpackChunkName: "Estadisticas" */ '../views/Dashboard.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: 'ticket',
        name: 'Ticket',
        component: () =>
          import(/* webpackChunkName: "Ticket" */ '../views/Ticket.vue'),
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: 'mantenedor',
        name: 'Mantenedor',
        component: () =>
          import(
            /* webpackChunkName: "Mantenedor" */ '../views/maintenance/Index.vue'
          ),
        meta: { requiresAuth: true },
        children: [
          {
            path: 'aula',
            component: () =>
              import(
                /* webpackChunkName: "Aula" */ '../views/maintenance/Classroom.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'estado-ticket',
            component: () =>
              import(
                /* webpackChunkName: "EstadoTicket" */ '../views/maintenance/StatusTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'estado-final',
            component: () =>
              import(
                /* webpackChunkName: "EstadoFinal" */ '../views/maintenance/FinalStatus.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'motivo-ticket',
            component: () =>
              import(
                /* webpackChunkName: "MotivoTicket" */ '../views/maintenance/MotiveTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'Tipo de ticket',
            path: 'tipo-ticket',
            component: () =>
              import(
                /* webpackChunkName: "TipoTicket" */ '../views/maintenance/TypeTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'prioridad-ticket',
            component: () =>
              import(
                /* webpackChunkName: "PriodidadTicket" */ '../views/maintenance/PriorityTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'origen-ticket',
            component: () =>
              import(
                /* webpackChunkName: "OrigenTicket" */ '../views/maintenance/SourceTicket.vue'
              ),
            meta: { requiresAuth: true }
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

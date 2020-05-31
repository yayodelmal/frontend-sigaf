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
            name: 'Classroom',
            component: () =>
              import(
                /* webpackChunkName: "Aula" */ '../views/maintenance/Classroom.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'estado-ticket',
            name: 'StatusTicket',
            component: () =>
              import(
                /* webpackChunkName: "EstadoTicket" */ '../views/maintenance/StatusTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'estado-final',
            name: 'FinalStatus',
            component: () =>
              import(
                /* webpackChunkName: "EstadoFinal" */ '../views/maintenance/FinalStatus.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'motivo-ticket',
            name: 'MotiveTicket',
            component: () =>
              import(
                /* webpackChunkName: "MotivoTicket" */ '../views/maintenance/MotiveTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'TypeTicket',
            path: 'tipo-ticket',
            component: () =>
              import(
                /* webpackChunkName: "TipoTicket" */ '../views/maintenance/TypeTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'prioridad-ticket',
            name: 'PriorityTicket',
            component: () =>
              import(
                /* webpackChunkName: "PriodidadTicket" */ '../views/maintenance/PriorityTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'origen-ticket',
            name: 'SourceTicket',
            component: () =>
              import(
                /* webpackChunkName: "OrigenTicket" */ '../views/maintenance/SourceTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'Section',
            path: 'seccion',
            component: () =>
              import(
                /* webpackChunkName: "Sección" */ '../views/maintenance/Section.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'Activity',
            path: 'actividad',
            component: () =>
              import(
                /* webpackChunkName: "Actividad" */ '../views/maintenance/Activity.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'Role',
            path: 'rol',
            component: () =>
              import(
                /* webpackChunkName: "Rol" */ '../views/maintenance/Role.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'Profile',
            path: 'perfil',
            component: () =>
              import(
                /* webpackChunkName: "Perfil" */ '../views/maintenance/Profile.vue'
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

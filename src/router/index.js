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
        path: 'estadistica',
        name: 'Dashboard',
        component: () =>
          import(
            /* webpackChunkName: "Estadisticas" */ '../views/Dashboard.vue'
          ),
        meta: { requiresAuth: true }
      },
      {
        path: 'seguimiento-alumnos',
        name: 'FollowUp',
        component: () =>
          import(/* webpackChunkName: "Seguimiento" */ '../views/FollowUp.vue'),
        meta: { requiresAuth: true },
        props: true
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
        path: 'reportes',
        name: 'Reports',
        component: () =>
          import(
            /* webpackChunkName: "Reportes" */ '../views/report/Index.vue'
          ),
        meta: { requiresAuth: true },
        children: [
          {
            name: 'TicketReport',
            path: 'reporte-ticket',
            component: () =>
              import(
                /* webpackChunkName: "ReporteTicket" */ '../views/report/TicketReport.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'FollowStudentReport',
            path: 'reporte-seguimiento-alumnos',
            component: () =>
              import(
                /* webpackChunkName: "ReporteSeguimientoAlumnos" */ '../views/report/FollowStudentReport.vue'
              ),
            meta: { requiresAuth: true }
          }
        ]
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
            path: 'administracion-ticket',
            name: 'ManageTicket',
            component: () =>
              import(
                /* webpackChunkName: "AdministracionTicket" */ '../views/maintenance/ManageTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            path: 'desbloqueo-ticket',
            name: 'BlockingTicket',
            component: () =>
              import(
                /* webpackChunkName: "BloqueoTicket" */ '../views/maintenance/BlockingTicket.vue'
              ),
            meta: { requiresAuth: true }
          },
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
            path: 'estado-detalle-ticket',
            name: 'StatusDetailTicket',
            component: () =>
              import(
                /* webpackChunkName: "IntentoContacto" */ '../views/maintenance/StatusDetailTicket.vue'
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
          },
          {
            name: 'User',
            path: 'Usuario',
            component: () =>
              import(
                /*webpackChunkName:"Usuario"*/ '../views/maintenance/User.vue'
              )
          }
        ]
      },
      {
        path: 'configuracion',
        name: 'Configuration',
        component: () =>
          import(
            /* webpackChunkName: "Mantenedor" */ '../views/configuration/Index.vue'
          ),
        meta: { requiresAuth: true },
        children: [
          {
            name: 'Category',
            path: 'categoria',
            component: () =>
              import(
                /*webpackChunkName: "Categoría" */ '../views/configuration/Category.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'Course',
            path: 'Curso',
            component: () =>
              import(
                /*webpackChunkName: "Curso" */ '../views/configuration/Course.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'LoadStudents',
            path: 'cargar-estudiantes',
            component: () =>
              import(
                /* webpackChunkName: "CargarEstudiantes" */ '../views/configuration/LoadStudent.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'BuildClassrooms',
            path: 'conformar-aulas',
            component: () =>
              import(
                /* webpackChunkName: "ConformarAula" */ '../views/configuration/BuildClassroom.vue'
              )
          },
          {
            name: 'Activity',
            path: 'actividad',
            component: () =>
              import(
                /* webpackChunkName: "Actividad" */ '../views/configuration/Activity.vue'
              ),
            meta: { requiresAuth: true }
          },
          {
            name: 'ManagementStudent',
            path: 'gestion-estudiantes',
            component: () =>
              import(
                /* webpackChunkName: "GestionEstudiante" */ '../views/configuration/ManagementStudent.vue'
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

// store.dispatch('auth/attempt', localStorage.getItem('access_token'))

// console.log('dispatch')

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('access_token')

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  next()
})

export default router

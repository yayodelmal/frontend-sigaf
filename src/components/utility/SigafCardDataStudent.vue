<template>
  <div v-if="user.rut" class="d-flex text-center py-4">
    <v-hover v-slot:default="{ hover }" open-delay="200">
      <v-card
        :color="backgroundColor ? 'white' : getColorCard(user.state)"
        class="mx-auto"
        :class="backgroundColor ? '' : 'rounded-t-xl'"
        flat
        width="350"
        :elevation="backgroundColor ? 0 : hover ? 16 : 0"
        outlined
        max-height="480"
      >
        <v-card-text>
          <span class="headline font-weight-bold"> {{ user.classroom }}</span
          ><br />
          <span class="text-caption"> Progreso:</span><br />
          <v-avatar size="120">
            <v-progress-circular
              :rotate="-90"
              :size="100"
              :width="15"
              :value="getValueProgress(user)"
              :color="getColorState(user.state)"
            >
              {{ getValueProgress(user) }}%
            </v-progress-circular>
          </v-avatar>
          <h3 v-if="source === 'Ticket'" class="font-weight-bold mb-2">
            {{ user.registered_user.rut }}
          </h3>
          <h3 class="title mb-2">
            {{ user.registered_user.name }}
          </h3>
          <h3 class="mb-2">
            {{ user.registered_user.last_name }}
            {{ user.registered_user.mother_last_name }}
          </h3>
          <h3 class="blueS--text mb-2">
            {{ user.registered_user.email }}
          </h3>
          <h3 class="redS--text subheading font-weight-bold">
            {{
              user.registered_user.mobile
                ? user.registered_user.mobile
                : 'Sin teléfono registrado'
            }}
          </h3>
        </v-card-text>

        <v-expand-transition v-if="!backgroundColor">
          <div
            v-if="hover"
            class="d-flex transition-fast-in-fast-out blueS darken-2 v-card--reveal white--text rounded-t-xl"
            :style="tooltipCss"
          >
            <div class="d-flex flex-column">
              <div
                v-for="section in sectionFiltered"
                :key="section.id"
                class="d-flex flex-row"
              >
                <div class="pl-2 py-1 title-section">
                  <h6 class="text-overline">{{ section.description }}:</h6>
                </div>
                <div
                  class="mr-1 mt-2 justify-space-between"
                  v-for="grade in getGrades(section, user.activities)"
                  :key="grade.idActivityMoodle"
                >
                  <v-tooltip color="white" bottom>
                    <template v-slot:activator="{ on }">
                      <h4 v-on="on">
                        <kbd
                          style="width: 40px; display: inline-block;"
                          v-html="parseGrade(grade)"
                        ></kbd>
                      </h4>
                    </template>
                    <span class="blueS--text darken-2">{{
                      grade.description
                    }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </v-expand-transition>
        <v-divider class="mb-3"></v-divider>
        <v-row class="text-center">
          <v-col v-if="source === 'FollowUp'" class="mb-n6" cols="12">
            <h3 class="font-weight-bold mb-2">
              {{ user.registered_user.rut }}
            </h3>
          </v-col>
          <v-col cols="6" class="mx-auto">
            <v-card :color="getColorState(user.state)" flat dark class="py-1"
              ><span>
                {{ user.state }}
              </span></v-card
            >
          </v-col>
          <v-col cla cols="12" class="mb-2">
            <span class="font-weight-bold">
              <v-icon class="mr-2">
                mdi-clock
              </v-icon>
              Última conexión:
              {{ user.last_access_registered_moodle }}</span
            >
          </v-col>
        </v-row>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SigafCardDataStudent',
  props: {
    user: {
      type: Object
    },
    backgroundColor: Boolean,
    source: {
      type: String,
      default: () => 'Ticket'
    }
  },
  methods: {
    parseGrade(grade) {
      const DONE = `R`
      const UNREALIZED = `N/R`
      const list = ['Pre Test A', 'Pre Test B', 'Post Test A', 'Post Test B']
      switch (grade.type) {
        case 'Tareas':
          if (grade.statusMoodle === 'Sin entrega') {
            return UNREALIZED
          } else if (grade.statusMoodle === 'Enviado para calificar') {
            return DONE
          } else {
            return grade.qualificationMoodle
          }
        case 'Foros':
          if (grade.statusMoodle === 'No') {
            return UNREALIZED
          } else if (
            grade.qualificationMoodle === '-' ||
            grade.qualificationMoodle === ''
          ) {
            return DONE
          } else {
            return grade.qualificationMoodle
          }
        case 'Cuestionarios':
          if (
            list.includes(grade.section) &&
            grade.statusMoodle === 'Finalizado'
          ) {
            return DONE
          } else if (
            list.includes(grade.section) &&
            grade.statusMoodle !== 'Finalizado'
          ) {
            return UNREALIZED
          } else {
            return grade.qualificationMoodle
          }
        case 'Encuestas':
          if (grade.statusMoodle !== '') {
            return DONE
          } else {
            return UNREALIZED
          }
        default:
          return 'Error'
      }
    },
    getValueProgress(user) {
      return user.progress
    },
    getGrades(section, activities) {
      if (activities && section) {
        if (typeof activities[section.id] !== 'undefined') {
          return activities[section.id].filter(activity => {
            return activity
          })
        }
      }
    },
    getColorState(state) {
      switch (state) {
        case 'RENUNCIADO':
          return 'redS darken-1'
        case 'RENUNCIA EN CURSO':
          return 'warning darken-1'
        case 'Sin actividades sincronizadas':
          return 'orange darken-4'
        default:
          return 'blueS darken-1'
      }
    },
    getColorCard(state) {
      switch (state) {
        case 'RENUNCIADO':
          return 'grey lighten-4'
        case 'RENUNCIA EN CURSO':
          return 'grey lighten-4'
        case 'Sin actividades sincronizadas':
          return 'grey lighten-4'
        default:
          return 'grey lighten-4'
      }
    }
  },
  computed: {
    ...mapGetters({
      sections: 'section/sections'
    }),
    tooltipCss() {
      if (this.source === 'Ticket') {
        return {
          height: '79%',
          bottom: '21%'
        }
      } else if (this.source === 'FollowUp') {
        return {
          height: '71%',
          bottom: '29%'
        }
      } else {
        return {}
      }
    },
    formA() {
      const rut = this.user.registered_user.rut
      const split = rut.split('-')

      return split[1] % 2 === 0
    },
    formB() {
      const rut = this.user.registered_user.rut
      const split = rut.split('-')

      return split[1] % 2 !== 0 || split[1] === 'K'
    },

    sectionFiltered() {
      return this.sections.filter(section => {
        if (this.formA) {
          return (
            section.description !== 'Formativa' &&
            section.description !== 'Pre Test B' &&
            section.description !== 'Post Test B' &&
            section.description !== 'Unidad 5' &&
            section.description !== 'Renuncia'
          )
        } else if (this.formB) {
          return (
            section.description !== 'Formativa' &&
            section.description !== 'Pre Test A' &&
            section.description !== 'Post Test A' &&
            section.description !== 'Unidad 5' &&
            section.description !== 'Renuncia'
          )
        }
      })
    }
  }
}
</script>

<style scoped>
.v-card--reveal {
  align-items: flex-start;
  padding: 0.2em;
  justify-content: left;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
.title-section {
  width: 110px;
  text-align: left;
}
</style>

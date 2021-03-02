<template>
  <v-hover v-slot:default="{ hover }" open-delay="200">
    <v-card
      :color="getColorCard(user.state)"
      class="pt-6 mx-auto rounded-t-xl"
      flat
      min-width="330"
      :elevation="hover ? 16 : 0"
      outlined
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
        <h3 class="font-weight-bold mb-2">
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
          {{ user.registered_user.mobile }}
        </h3>
      </v-card-text>
      <v-expand-transition>
        <div
          v-if="hover"
          class="d-flex transition-fast-in-fast-out blueS darken-2 v-card--reveal white--text rounded-t-xl"
          style="height: 78%;"
        >
          <div class="d-flex flex-column">
            <div
              v-for="section in sectionFiltered"
              :key="section.id"
              class="d-flex flex-row"
            >
              <div class="px-3 py-2 title-section">
                <h6 class="text-overline">{{ section.description }}:</h6>
              </div>
              <div
                class="px-1 py-2"
                v-for="grade in getGrades(section, user.activities)"
                :key="grade.idActivityMoodle"
              >
                <v-tooltip color="white" bottom>
                  <template v-slot:activator="{ on }">
                    <h4 v-on="on">
                      <kbd>{{
                        grade.qualificationMoodle === ''
                          ? 'S/I'
                          : grade.qualificationMoodle
                      }}</kbd>
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
      <v-divider></v-divider>
      <v-row class="text-center">
        <v-col cols="6" class="mx-auto">
          <v-card :color="getColorState(user.state)" flat dark class="py-1"
            ><span>
              {{ user.state }}
            </span></v-card
          >
        </v-col>

        <v-col cols="12">
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SigafCardDataStudent',
  props: {
    user: {
      type: Object
    }
  },
  created() {},
  methods: {
    ...mapActions({}),
    getValueProgress(user) {
      return user.progress
    },
    getGrades(section, activities) {
      if (activities && section) {
        if (typeof activities[section.id] !== 'undefined') {
          console.log('undefined', section.id)
          console.log(activities[section.id])
          return activities[section.id].filter(activity => {
            return activity.qualificationMoodle !== '-'
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
          return 'warning lighten-5'
        case 'RENUNCIA EN CURSO':
          return 'warning lighten-5'
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
    sectionFiltered() {
      return this.sections.filter(
        section =>
          section.description !== 'Formativa' &&
          section.description !== 'Renuncia'
      )
    }
  }
}
</script>

<style scoped>
.v-card--reveal {
  align-items: flex-start;
  bottom: 22%;
  padding: 0.2em;
  justify-content: left;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
.title-section {
  width: 100px;
  text-align: left;
}
</style>

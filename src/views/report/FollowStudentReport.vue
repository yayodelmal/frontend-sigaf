<template>
  <base-card
    color="blueS"
    class="px-5 py-3"
    icon="mdi-clipboard-edit-outline"
    title="Reportes seguimiento de alumnos"
  >
    <sigaf-category-course-toolbar
      @selectedCourse="selectedCourse = $event"
      source="Reports"
    />

    <v-card v-if="selectedCourse" class="mt-3">
      <v-card-text>
        <div class="d-flex">
          <v-tooltip top color="blueS">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-auto"
                color="blueS"
                dark
                v-bind="attrs"
                v-on="on"
                @click="handleDownloadReport"
              >
                <v-icon left> mdi-file-excel</v-icon>
                Descargar reporte
              </v-btn>
            </template>
            <span>Descargar reporte</span>
          </v-tooltip>
        </div>
        <v-row justify="center" align="center" no-gutters>
          <v-col cols="12">
            <v-slide-group
              v-model="model"
              class="pa-4"
              show-arrows
              center-active
            >
              <v-slide-item
                v-for="classroom in classrooms"
                :key="classroom"
                v-slot="{ active, toggle }"
              >
                <v-card
                  :color="active ? 'blueS' : 'grey lighten-2'"
                  class="mx-4"
                  height="50"
                  width="125"
                  outlined
                  @click="
                    toggle()
                    handleChart()
                  "
                >
                  <v-row class="fill-height" align="center" justify="center">
                    <v-scale-transition>
                      <v-icon
                        v-if="active"
                        color="white"
                        size="24"
                        v-text="'mdi-calendar-check'"
                      ></v-icon>
                    </v-scale-transition>
                  </v-row>
                  <div class="d-flex">
                    <span
                      :class="active ? 'white--text' : 'black--text'"
                      class="mx-auto"
                      >{{ classroom }}</span
                    >
                  </div>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </base-card>
</template>

<script>
//import moment from 'moment'
//import axios from '../../services/axios'
import { mapActions, mapGetters } from 'vuex'
import SigafCategoryCourseToolbar from '../../components/utility/SigafCategoryCourseToolbar.vue'

export default {
  components: { SigafCategoryCourseToolbar },
  data: () => ({
    model: null,
    modalDates: false,
    dates: [],
    transformDates: [],
    loadingDates: false,
    selectedCourse: null,
    renderChart: false
  }),
  watch: {
    selectedCourse(value) {
      this.findSectionByCourse(value.id)
      this.findClassroomByCourse(value.id)
    }
  },
  computed: {
    ...mapGetters({
      sectionByCourse: 'section/sectionByCourse',
      classroomByCourse: 'classroom/classroomByCourse'
    }),
    sections() {
      if (!this.sectionByCourse) return []
      const arraySections = Object.keys(
        this.sectionByCourse.reduce(function(accumulator, object) {
          let key = object['description']
          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(object)
          return accumulator
        }, {})
      )

      return arraySections.sort()
    },
    classrooms() {
      if (!this.classroomByCourse) return []
      const array = Object.keys(
        this.classroomByCourse.reduce(function(accumulator, object) {
          let key = object['description']
          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(object)
          return accumulator
        }, {})
      )

      return array.sort()
    }
  },
  methods: {
    ...mapActions({
      findSectionByCourse: 'section/findSectionByCourse',
      findClassroomByCourse: 'classroom/findClassroomByCourse'
    }),
    handleDownloadReport() {}
  }
}
</script>

<style lang="scss" scoped></style>

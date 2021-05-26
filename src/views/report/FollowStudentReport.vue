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

    <v-card v-if="selectedCourse" class="mt-3" elevation="0">
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
        <v-row class="mt-6" justify="center" align="center" no-gutters>
          <v-col cols="6">
            <span class="ml-8 font-weight-bold subtitle"
              >Seleccione un aula:</span
            >
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
    <v-card v-if="isLoadedFollowStudentByClassroom && selectedCourse">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6" lg="3">
            <base-material-stats-card
              color="warning"
              icon="mdi-view-dashboard"
              title="Matrícula inicial"
              :value="'' + total"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="3">
            <base-material-stats-card
              color="info"
              icon="mdi-view-dashboard"
              title="Renuncias"
              :value="'' + resign"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="3">
            <base-material-stats-card
              color="redS"
              icon="mdi-view-dashboard"
              title="Activos"
              :value="'' + active"
            />
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="3">
            <base-material-stats-card
              color="success"
              icon="mdi-view-dashboard"
              title="Inactivos"
              :value="'' + inactive"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-hover v-slot:default="{ hover }">
              <v-card
                class="d-flex text-center ma-1"
                color="grey lighten-4"
                :elevation="hover ? '5' : '0'"
                max-height="300"
              >
                <v-card-text>
                  <base-doughnut-chart
                    :render="isLoadedStatusUserClassroomChart"
                    :chartData="statusUserClassroomChart"
                    title="Alumnos según estado"
                    :height="250"
                  />
                </v-card-text> </v-card
            ></v-hover>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="8">
            <v-hover v-slot:default="{ hover }">
              <v-card
                class="d-flex text-center ma-1"
                color="grey lighten-4"
                :elevation="hover ? '5' : '0'"
              >
                <v-card-text>
                  <base-horizontal-bar-chart
                    :render="isLoadedProgressUserClassroomBySection"
                    :chartData="progressUserClassroomBySection"
                    title="Progreso de actividades calificadas según unidad (%)"
                    :height="250"
                    xLabel="Porcentaje de progreso de actividades calificadas"
                    yLabel="Secciones"
                  />
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      v-if="isLoadedFollowStudentByClassroom && selectedCourse"
      elevation="0"
      class="mt-3"
    >
      <v-card-text>
        <v-row justify="center" align="center" no-gutters>
          <v-col cols="10">
            <span class="ml-8 font-weight-bold subtitle"
              >Seleccione una sección:</span
            >
            <v-slide-group
              v-model="modelSection"
              class="pa-4"
              show-arrows
              center-active
            >
              <v-slide-item
                v-for="section in sections"
                :key="section"
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
                    handleChartSection()
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
                      >{{ section }}</span
                    >
                  </div>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-6">
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-hover v-slot:default="{ hover }">
              <v-card
                class="d-flex text-center ma-1"
                color="grey lighten-4"
                :elevation="hover ? '5' : '0'"
              >
                <v-card-text>
                  <base-horizontal-bar-chart
                    :render="isLoadedProgressUserClassroomByActivity"
                    :chartData="progressUserClassroomByActivity"
                    title="Progreso de actividades calificadas"
                    :height="250"
                    xLabel="Porcentaje de progreso de actividades calificadas"
                    yLabel="Actividades"
                  />
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-hover v-slot:default="{ hover }">
              <v-card
                class="d-flex text-center ma-1"
                color="grey lighten-4"
                :elevation="hover ? '5' : '0'"
              >
                <v-card-text>
                  <base-horizontal-bar-chart
                    :render="isLoadedProgressUserClassroomByActivityAvance"
                    :chartData="progressUserClassroomByActivityAvance"
                    title="Progreso de actividades realizadas"
                    :height="250"
                    xLabel="Porcentaje de progreso de actividades realizadas"
                    yLabel="Actividades"
                  />
                </v-card-text>
              </v-card>
            </v-hover>
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
import BaseDoughnutChart from '../../components/dashboard/base/BaseDoughnutChart.vue'
import BaseHorizontalBarChart from '../../components/dashboard/base/BaseHorizontalBarChart.vue'
import SigafCategoryCourseToolbar from '../../components/utility/SigafCategoryCourseToolbar.vue'

export default {
  components: {
    SigafCategoryCourseToolbar,
    BaseDoughnutChart,
    BaseHorizontalBarChart
  },
  data: () => ({
    model: null,
    modelSection: null,
    modalDates: false,
    dates: [],
    transformDates: [],
    loadingDates: false,
    selectedCourse: null,
    renderChart: false
  }),
  watch: {
    selectedCourse(value) {
      console.log(value)
      this.findSectionByCourse(value.id)
      this.findClassroomByCourse(value.id)
    }
  },
  computed: {
    ...mapGetters({
      sectionByCourse: 'section/sectionByCourse',
      classroomByCourse: 'classroom/classroomByCourse',
      followStudentByClassroom: 'report/followStudentByClassroom',
      isLoadedFollowStudentByClassroom:
        'report/isLoadedFollowStudentByClassroom',
      statusUserClassroomChart: 'report/statusUserClassroomChart',
      isLoadedStatusUserClassroomChart:
        'report/isLoadedStatusUserClassroomChart',
      progressUserClassroomBySection: 'report/progressUserClassroomBySection',
      isLoadedProgressUserClassroomBySection:
        'report/isLoadedProgressUserClassroomBySection',
      progressUserClassroomByActivity: 'report/progressUserClassroomByActivity',
      isLoadedProgressUserClassroomByActivity:
        'report/isLoadedProgressUserClassroomByActivity',
      progressUserClassroomByActivityAvance:
        'report/progressUserClassroomByActivityAvance',
      isLoadedProgressUserClassroomByActivityAvance:
        'report/isLoadedProgressUserClassroomByActivityAvance'
    }),
    resign() {
      if (!this.followStudentByClassroom) return ''
      return this.followStudentByClassroom.resign
    },
    active() {
      if (!this.followStudentByClassroom) return ''
      return this.followStudentByClassroom.active
    },
    inactive() {
      if (!this.followStudentByClassroom) return ''
      return this.followStudentByClassroom.inactive
    },
    total() {
      if (!this.followStudentByClassroom) return ''
      return this.followStudentByClassroom.total
    },
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

      return arraySections.filter(section => section !== 'Formativa').sort()
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
      findClassroomByCourse: 'classroom/findClassroomByCourse',
      getFollowStudentByClassroom: 'report/getFollowStudentByClassroom',
      getStatusUserClassroomChart: 'report/getStatusUserClassroomChart',
      getProgressUserClassroomBySection:
        'report/getProgressUserClassroomBySection',
      getProgressUserClassroomByActivity:
        'report/getProgressUserClassroomByActivity',
      getAvanceProgressUserClassroomByActivity:
        'report/getAvanceProgressUserClassroomByActivity'
    }),
    handleDownloadReport() {},
    async handleChart() {
      await this.getFollowStudentByClassroom({
        course: this.selectedCourse.id,
        classroom: this.classrooms[this.model]
      })
      await this.getStatusUserClassroomChart({
        course: this.selectedCourse.id,
        classroom: this.classrooms[this.model]
      })
      await this.getProgressUserClassroomBySection({
        course: this.selectedCourse.id,
        classroom: this.classrooms[this.model]
      })
    },
    async handleChartSection() {
      await this.getProgressUserClassroomByActivity({
        course: this.selectedCourse.id,
        classroom: this.classrooms[this.model],
        section: this.sections[this.modelSection]
      })
      await this.getAvanceProgressUserClassroomByActivity({
        course: this.selectedCourse.id,
        classroom: this.classrooms[this.model],
        section: this.sections[this.modelSection]
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>

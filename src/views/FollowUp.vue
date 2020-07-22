<template>
  <v-container>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-google-classroom"
      title="Seguimiento de alumnos"
    >
      <v-col cols="12">
        <v-toolbar dark color="blueS darken-1" class="mb-1">
          <v-select
            v-model="category"
            :items="categoryItems"
            label="Categoría"
            item-value="id"
            item-text="description"
            color="blueS"
            flat
            solo-inverted
            hide-details
            return-object
            prepend-inner-icon="mdi-filter-outline"
          >
          </v-select>
        </v-toolbar>
      </v-col>
      <v-sheet color="white" class="px-3 pt-3 pb-3">
        <v-data-iterator
          :items="usersRegisteredFiltered"
          :items-per-page.sync="itemsPerPage"
          :page.sync="page"
          :loading="loading"
          hide-default-footer
          @page-count="pageCount = $event"
          :search="search"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
        >
          <template v-slot:loading>
            <v-row>
              <v-col
                v-for="n in itemsPerPage"
                :key="n"
                cols="12"
                sm="6"
                md="6"
                lg="4"
                xl="3"
              >
                <v-skeleton-loader
                  v-if="loading"
                  class="mx-auto"
                  type="card"
                  max-width="350"
                ></v-skeleton-loader>
              </v-col>
            </v-row>
          </template>

          <template v-if="usersRegisteredFiltered.length" v-slot:header>
            <v-toolbar dark color="blueS darken-1" class="mb-1">
              <v-text-field
                v-model="search"
                color="blueS"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Buscar"
              ></v-text-field>
              <template v-if="$vuetify.breakpoint.mdAndUp">
                <v-spacer></v-spacer>
                <v-select
                  v-model="sortBy"
                  flat
                  item-value="key"
                  item-text="value"
                  solo-inverted
                  hide-details
                  :items="keys"
                  prepend-inner-icon="mdi-filter-outline"
                  label="Ordernar por"
                ></v-select>
                <v-spacer></v-spacer>
                <v-btn-toggle v-model="sortDesc" mandatory>
                  <v-btn large depressed color="blueS" :value="false">
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  <v-btn large depressed color="blueS" :value="true">
                    <v-icon>mdi-arrow-down</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </template>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="(user, index) in props.items"
                :key="index"
                cols="12"
                sm="6"
                md="6"
                lg="4"
                xl="3"
              >
                <v-skeleton-loader
                  :loading="loading"
                  :transition="transition"
                  v-if="loading"
                  class="mx-auto"
                  type="card"
                ></v-skeleton-loader>

                <v-col v-else class="d-flex text-center">
                  <!-- <v-divider vertical></v-divider> -->
                  <v-hover v-slot:default="{ hover }" open-delay="200">
                    <v-card
                      class="pt-6 mx-auto rounded-t-xl"
                      flat
                      max-width="350"
                      :elevation="hover ? 16 : 0"
                      outlined
                    >
                      <v-card-text>
                        <span class="headline font-weight-bold">
                          {{ user.classroom.description }}</span
                        ><br />
                        <span class="text-caption"> Progreso:</span><br />
                        <v-avatar size="120">
                          <v-progress-circular
                            :rotate="-90"
                            :size="100"
                            :width="15"
                            :value="getValueProgress(user)"
                            color="blueS"
                          >
                            {{ getValueProgress(user) }}%
                          </v-progress-circular>
                        </v-avatar>
                        <h3 class="headline mb-2">
                          {{ user.registered_user.name }}
                        </h3>
                        <h3 class="mb-2">
                          {{ user.registered_user.last_name }}
                          {{ user.registered_user.mother_last_name }}
                        </h3>
                        <div class="blueS--text mb-2">
                          {{ user.registered_user.email }}
                        </div>
                        <div class="redS--text subheading font-weight-bold">
                          {{ user.registered_user.mobile }}
                        </div>
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
                                <h6 class="text-overline">
                                  {{ section.description }}:
                                </h6>
                              </div>
                              <div
                                class="px-1 py-2"
                                v-for="grade in getGrades(
                                  section,
                                  user.activities
                                )"
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
                          <v-card
                            :color="getColorState(user.state)"
                            flat
                            dark
                            class="py-1"
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
                </v-col>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-sheet>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="pageCount"
          circle
          color="blueS"
        ></v-pagination>
      </div>
    </base-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    headers: [
      {
        text: '#',
        align: 'center',
        width: 50,
        class: 'redS--text',
        sortable: false,
        value: 'id'
      },
      // {
      //   text: 'Curso',
      //   width: 50,
      //   class: 'redS--text',
      //   value: 'course.description'
      // },
      {
        text: 'Aula',
        width: 50,
        class: 'redS--text',
        value: 'classroom.description'
      },
      {
        text: 'RUT',
        width: 50,
        class: 'redS--text',
        value: 'registered_user.rut_registered_moodle'
      },
      {
        text: 'Nombre participante',
        width: 50,
        class: 'redS--text',
        value: 'registered_user.name_registered_moodle'
      },
      {
        text: 'Último acceso',
        width: 50,
        class: 'redS--text',
        value: 'last_access_registered_moodle'
      },
      {
        text: 'Estado',
        width: 50,
        class: 'redS--text',
        value: 'user.isActive'
      }
    ],
    search: '',
    loading: true,
    snackbar: false,
    message: '',
    timeout: 3000,
    category: null,
    userCourse: {},
    user: {
      registered_user: {},
      course: {},
      activities: [],
      isActive: null
    },
    usersRegisteredFiltered: [],
    classrooms: [],
    itemsPerPage: 6,
    page: 1,
    pageCount: 0,
    transition: 'scale-transition',
    sortBy: 'state',
    keys: [
      { key: 'state', value: 'Estado' },
      { key: 'classroom_id', value: 'Aula' },
      { key: 'progress', value: 'Progreso' }
    ],
    filter: {},
    sortDesc: false
  }),
  computed: {
    ...mapGetters({
      courseRegisteredUserItems: 'courseRegisteredUser/courseRegisteredUsers',
      courseItems: 'course/courses',
      categoryItems: 'category/categories',
      courseByCategory: 'course/coursesByCategory',
      sections: 'section/sections'
    }),
    sectionFiltered() {
      return this.sections.filter(
        section =>
          section.description !== 'Formativa' &&
          section.description !== 'Renuncia'
      )
    },
    breackPoint() {
      return this.$vuetify.breakpoint.name
    },
    isXS() {
      return this.breackPoint === 'xs'
    },
    isSM() {
      return this.breackPoint === 'sm'
    },
    isMD() {
      return this.breackPoint === 'md'
    },
    isLG() {
      return this.breackPoint === 'lg'
    },
    isXL() {
      return this.breackPoint === 'xl'
    },
    filterKeys() {
      let array = []
      this.keys.forEach(key => {
        array.push(Object.values(key))
      })

      return array
    },
    // numberOfPages() {
    //   return Math.ceil(this.items.length / this.itemsPerPage)
    // },
    filteredKeys() {
      return this.filterKeys.filter(key => key !== `Estado`)
    }
  },
  created() {
    this.fetchDataCourseRegisteredUserItems()
    this.fetchCourseItems()
    this.fetchDataCategoryItems()
    this.fetchSections()

    if (this.isXS) this.itemsPerPage = 3
    if (this.isSM) this.itemsPerPage = 6
    if (this.isMD) this.itemsPerPage = 6
    if (this.isLG) this.itemsPerPage = 9
    if (this.isXL) this.itemsPerPage = 12
  },
  watch: {
    breackPoint() {
      switch (this.breackPoint) {
        case 'xs':
          this.itemsPerPage = 3
          break
        case 'sm':
          this.itemsPerPage = 6
          break
        case 'md':
          this.itemsPerPage = 6
          break
        case 'lg':
          this.itemsPerPage = 9
          break
        case 'xl':
          this.itemsPerPage = 12
          break
        default:
          this.itemsPerPage = 6
      }
    },
    category() {
      this.loading = true
      this.usersRegisteredFiltered = []
      this.fetchUserByCourse()
    }
  },
  methods: {
    ...mapActions({
      fetchCourseRegisteredUserItems:
        'courseRegisteredUser/fetchCourseRegisteredUsers',
      fetchCourseItems: 'course/fetchCourses',
      fetchCategoryItems: 'category/fetchCategories',
      fetchCourseByCategory: 'course/getCoursesByCategory',
      fetchCourseUserByCategory:
        'courseRegisteredUser/getCourseRegisteredByCourse',
      fetchSections: 'section/fetchSections'
    }),
    getValueProgress(user) {
      return user.progress
    },
    getColorState(state) {
      switch (state) {
        case 'RENUNCIADO':
          return 'redS darken-1'
        case 'RENUNCIA EN CURSO':
          return 'warning darken-1'
        default:
          return 'blueS darken-1'
      }
    },
    groupBy(objectArray, property) {
      return objectArray.reduce(function(accumulator, object) {
        let key = object[property]
        if (!accumulator[key]) {
          accumulator[key] = []
        }
        accumulator[key].push(object)
        return accumulator
      }, {})
    },
    getGrades(section, activities) {
      if (activities[section.id] !== undefined) {
        return activities[section.id].filter(activity => {
          return activity.qualificationMoodle !== '-'
        })
      }
    },
    async fetchUserByCourse() {
      if (this.category !== null) {
        await this.fetchCourseByCategory(this.category.courses.href)

        this.mapActivityUser(this.courseByCategory)
      }
    },

    mapActivityUser(categories) {
      const vm = this

      categories.forEach(async course => {
        const response = await vm.fetchCourseUserByCategory(course)

        if (response) {
          response._data.forEach(user => {
            if (user.activity_course_users.length !== 0) {
              let state = 'ACTIVO'
              let progress = 0
              const activities = user.activity_course_users
                .map(activity => {
                  if (activity) {
                    if (
                      activity.activity.section.description === 'Renuncia' &&
                      activity.status_moodle === 'Finalizado'
                    ) {
                      state = 'Renunciado'.toUpperCase()
                    }

                    if (
                      activity.activity.section.description === 'Renuncia' &&
                      activity.status_moodle === 'En curso'
                    ) {
                      state = 'Renuncia en curso'.toUpperCase()
                    }

                    let checkQualificationMoodle = ['', '-']
                    if (
                      !checkQualificationMoodle.includes(
                        activity.qualification_moodle
                      ) &&
                      activity.activity.weighing !== 0
                    ) {
                      progress++
                    }

                    return {
                      qualificationMoodle: activity.qualification_moodle,
                      statusMoodle: activity.status_moodle,
                      description: activity.activity.description,
                      idActivityMoodle: activity.activity.id_activity_moodle,
                      idSection: activity.activity.section_id,
                      section: activity.activity.section.description,
                      type: activity.activity.type,
                      weighing: activity.activity.weighing
                    }
                  } else {
                    return activity
                  }
                })
                .filter(activity => {
                  if (activity) {
                    return activity.section !== 'Formativa'
                  }
                })

              const totalProgress = this.sections
                .filter(section => {
                  const filterSection = [
                    'Formativa',
                    'Renuncia',
                    'Inicio',
                    'Cierre'
                  ]
                  return !filterSection.includes(section.description)
                })
                .reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.numberActivities,
                  0
                )

              const accumulativeProgress = Number.parseFloat(
                (progress / totalProgress) * 100
              ).toFixed(0)
              user['state'] = state
              user[
                'fullname'
              ] = `${user.registered_user.name} ${user.registered_user.last_name}`
              user['progress'] = accumulativeProgress
              user['activities'] = this.groupBy(activities, 'idSection')
              vm.usersRegisteredFiltered.push(user)

              console.log(user)
            }
          })
          this.loading = false
        }
      })
    },
    async fetchDataCourseRegisteredUserItems() {
      this.loading = true
      const { success, message } = await this.fetchCourseRegisteredUserItems()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
    },
    async fetchDataCategoryItems() {
      this.loading = true
      const { success, message } = await this.fetchCategoryItems()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
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

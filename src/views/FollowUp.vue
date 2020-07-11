<template>
  <v-container>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-google-classroom"
      title="Seguimiento de alumnos"
    >
      <v-col cols="12" sm="6" md="8" lg="8">
        <base-autocomplete
          v-model="category"
          :items="categoryItems"
          label="Categoría"
          item-value="id"
          item-text="description"
          return-object
        >
        </base-autocomplete>
      </v-col>
      <v-sheet :color="white" class="px-3 pt-3 pb-3">
        <v-data-iterator
          :items="courseRegisteredUserItems"
          :items-per-page.sync="itemsPerPage"
          :page.sync="page"
          :loading="loading"
          hide-default-footer
          @page-count="pageCount = $event"
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
                ></v-skeleton-loader>
              </v-col>
            </v-row>
          </template>
          <!-- <template v-slot:header>
            <v-toolbar class="mb-2" color="blueS" dark flat>
              <v-toolbar-title>Listado alumnos</v-toolbar-title>
            </v-toolbar>
          </template> -->
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="user in props.items"
                :key="user.rut"
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
                        <v-avatar size="120">
                          <v-progress-circular
                            :rotate="-90"
                            :size="100"
                            :width="15"
                            :value="30"
                            color="blueS"
                          >
                            30
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
                          class="d-flex transition-fast-in-fast-out blueS darken-2 v-card--reveal display-3 white--text rounded-t-xl"
                          style="height: 100%;"
                        >
                          <div class="d-flex flex-column">
                            <div
                              class="d-flex flex-row mb-5 align-content-space-between"
                            >
                              <v-col cols="6">
                                <h3 class="headline">Unidad 1:</h3>
                              </v-col>
                              <v-col>
                                <v-tooltip color="white" bottom>
                                  <template v-slot:activator="{ on }">
                                    <h3 class="headline" v-on="on">
                                      <kbd>6.9</kbd>
                                    </h3>
                                  </template>
                                  <span class="blueS--text darken-2"
                                    >Unidad 1.1</span
                                  >
                                </v-tooltip>
                              </v-col>
                              <v-col>
                                <v-tooltip color="blueS" bottom>
                                  <template v-slot:activator="{ on }">
                                    <h3 class="headline" v-on="on">
                                      <kbd>6.9</kbd>
                                    </h3>
                                  </template>
                                  <span>Unidad 1.2</span>
                                </v-tooltip>
                              </v-col>
                            </div>
                            <div
                              class="d-flex flex-row mb-5 align-content-space-between"
                            >
                              <v-col cols="6">
                                <h3 class="headline">Unidad 1:</h3>
                              </v-col>
                              <v-col>
                                <v-tooltip color="blueS" bottom>
                                  <template v-slot:activator="{ on }">
                                    <h3 class="headline" v-on="on">
                                      <kbd>6.9</kbd>
                                    </h3>
                                  </template>
                                  <span>Unidad 1.1</span>
                                </v-tooltip>
                              </v-col>
                              <v-col>
                                <v-tooltip color="blueS" bottom>
                                  <template v-slot:activator="{ on }">
                                    <h3 class="headline" v-on="on">
                                      <kbd>6.9</kbd>
                                    </h3>
                                  </template>
                                  <span>Unidad 1.2</span>
                                </v-tooltip>
                              </v-col>
                            </div>
                            <div
                              class="d-flex flex-row mb-5 align-content-space-between"
                            >
                              <v-col cols="6">
                                <h3 class="headline">Unidad 1:</h3>
                              </v-col>
                              <v-col>
                                <v-tooltip color="blueS" bottom>
                                  <template v-slot:activator="{ on }">
                                    <h3 class="headline" v-on="on">
                                      <kbd>6.9</kbd>
                                    </h3>
                                  </template>
                                  <span>Unidad 1.1</span>
                                </v-tooltip>
                              </v-col>
                              <v-col>
                                <v-tooltip color="blueS" bottom>
                                  <template v-slot:activator="{ on }">
                                    <h3 class="headline" v-on="on">
                                      <kbd>6.9</kbd>
                                    </h3>
                                  </template>
                                  <span>Unidad 1.2</span>
                                </v-tooltip>
                              </v-col>
                            </div>
                          </div>
                        </div>
                      </v-expand-transition>
                      <v-divider></v-divider>
                      <v-row class="text-left" tag="v-card-text">
                        <v-col class="mb-2 pl-8" tag="strong" cols="5"
                          >Estado:</v-col
                        >
                        <v-col>ACTIVO</v-col>
                        <v-col class="mb-2 pl-8" tag="strong" cols="5"
                          >Conexión:</v-col
                        >
                        <v-col>
                          <span
                            class="font-weight-bold font-italic custom-class"
                          >
                            Hace {{ user.last_access_registered_moodle }}</span
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
  inject: ['theme'],

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
    transition: 'scale-transition'
  }),
  computed: {
    ...mapGetters({
      courseRegisteredUserItems: 'courseRegisteredUser/courseRegisteredUsers',
      courseItems: 'course/courses',
      categoryItems: 'category/categories',
      courseByCategory: 'course/coursesByCategory'
    }),
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
    }
  },
  created() {
    this.fetchDataCourseRegisteredUserItems()
    this.fetchCourseItems()
    this.fetchDataCategoryItems()
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
    }
  },
  methods: {
    ...mapActions({
      fetchCourseRegisteredUserItems:
        'courseRegisteredUser/fetchCourseRegisteredUsers',
      fetchCourseItems: 'course/fetchCourses',
      fetchCategoryItems: 'category/fetchCategories',
      fetchCourseByCategory: 'course/getCoursesByCategory'
    }),
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
    },
    async filterUsersByCategory() {
      this.userRegisteredFiltered = []
      if (this.category !== null) {
        await this.fetchCourseByCategory(this.category.courses.href)

        const vm = this

        this.courseByCategory.forEach(function(course) {
          vm.courseRegisteredUserItems.forEach(courseUser => {
            if (courseUser.course.id === course.properties.id) {
              vm.usersRegisteredFiltered.push(courseUser)
            }
          })
        })
      } else {
        this.userRegisteredFiltered = this.courseRegisteredUserItems
      }
    }
  }
}
</script>

<style scoped>
.v-card--reveal {
  align-items: flex-start;
  bottom: 0;
  padding: 0.2em;
  justify-content: left;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
/* 
.custom-class {
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  font-size: 1.2em;
} */
</style>

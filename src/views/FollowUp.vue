<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <base-card
        color="blueS"
        class="px-5 py-3"
        icon="mdi-google-classroom"
        title="Seguimiento de alumnos"
      >
        <template>
          <v-card>
            <v-card-title>
              <v-col cols="12">
                <base-autocomplete
                  v-model="category"
                  :items="categoryItems"
                  label="Curso"
                  item-value="id"
                  item-text="description"
                  @change="filterUsersByCategory()"
                  return-object
                >
                </base-autocomplete>
              </v-col>
            </v-card-title>
            <v-card-subtitle>
              <v-spacer></v-spacer>
              <v-col cols="12" sm="12" md="4" lg="4">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  color="blueS"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
            </v-card-subtitle>
            <v-col>
              <v-data-table
                :headers="headers"
                :items="usersRegisteredFiltered"
                :search="search"
                class="grayS--text"
                :loading="loading"
                loading-text="Cargando... por favor espere"
              >
                <template v-slot:progress>
                  <v-progress-linear
                    color="blueS"
                    :height="3"
                    indeterminate
                  ></v-progress-linear>
                </template>
              </v-data-table>
            </v-col>
            <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
              {{ message }}
              <v-btn dark text @click="snackbar = false">
                Cerrar
              </v-btn>
            </v-snackbar>
          </v-card>
        </template>
      </base-card>
    </v-col>
  </v-row>
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
    loading: false,
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
    classrooms: []
  }),
  computed: {
    ...mapGetters({
      courseRegisteredUserItems: 'courseRegisteredUser/courseRegisteredUsers',
      courseItems: 'course/courses',
      categoryItems: 'category/categories',
      courseByCategory: 'course/coursesByCategory'
    })
  },
  created() {
    this.fetchDataCourseRegisteredUserItems()
    this.fetchCourseItems()
    this.fetchDataCategoryItems()
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

        // this.courseByCategory.forEach(course => {
        //   this.usersRegisteredFiltered = this.courseRegisteredUserItems.filter(
        //     userCourse => {
        //       // console.log('userCourse', userCourse)
        //       console.log('ID USERCOURSE', userCourse.course.description)
        //       console.log('ID COURSE', course.properties.description)
        //       return userCourse.course.id === course.properties.id
        //     }
        //   )
        // })

        const vm = this

        this.courseByCategory.forEach(function(course) {
          console.log(course)
          vm.courseRegisteredUserItems.forEach(courseUser => {
            if (courseUser.course.id === course.properties.id) {
              vm.usersRegisteredFiltered.push(courseUser)
            }
            console.log(courseUser.course.id)
          })
          /** */

          // this.userRegisteredFiltered = this.courseRegisteredUserItems.filter(
          //   function(userCourse) {
          //     console.log(userCourse)
          //     return true
          //   }
          // )

          /** */
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped></style>

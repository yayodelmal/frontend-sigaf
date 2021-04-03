<template>
  <sigaf-toolbar>
    <template v-slot:left>
      <base-select-component
        v-model="category"
        :items="categories"
        label="Categorías"
      ></base-select-component>
    </template>
    <template v-slot:center>
      <base-select-component
        class="mx-3"
        v-model="selectedCourse"
        :items="arrayCourseByCategory"
        label="Cursos"
      ></base-select-component>
    </template>
    <template v-slot:right>
      <v-btn
        class="mx-auto"
        width="128"
        :disabled="selectedCourse === null"
        large
        depressed
        color="blueS"
        @click="findTicketByCourse"
        :loading="loadingButton"
      >
        Buscar
      </v-btn>
    </template>
  </sigaf-toolbar>
</template>

<script>
import SigafToolbar from '../ticket/SigafToolbar'
import BaseSelectComponent from '../base/BaseSelect'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { SigafToolbar, BaseSelectComponent },
  props: {
    source: {
      type: String,
      default: () => 'Ticket'
    }
  },
  data: () => ({
    category: null,
    selectedCourse: null,
    loadingButton: false
  }),
  watch: {
    async category() {
      await this.fetchCourseByCategory(this.category.courses.href)
    },
    selectedCourse() {
      this.$emit('showTable', false)
    }
  },
  async mounted() {
    await this.fetchCategories()
  },
  computed: {
    ...mapGetters({
      categories: 'category/categories',
      courseByCategory: 'course/coursesByCategory'
    }),
    arrayCourseByCategory() {
      return this.courseByCategory.map(({ properties }) => {
        return { id: properties.id, description: properties.description }
      })
    }
  },
  methods: {
    ...mapActions({
      fetchCategories: 'category/fetchCategories',
      fetchCourseByCategory: 'course/getCoursesByCategory',
      fetchTicketsByCourse: 'ticket/findTicketByCourse',
      getLastSyncDate: 'courseRegisteredUser/getLastSyncDate'
    }),
    async findTicketByCourse() {
      this.loadingButton = true

      if (this.source === 'Ticket') {
        await this.fetchTicketsByCourse(this.selectedCourse)

        this.loadingButton = false
        this.$emit('showTable', true)
        this.$emit('loading', false)
      }
      await this.getLastSyncDate(this.selectedCourse)
      this.$emit('selectedCourse', this.selectedCourse)
    }
  }
}
</script>

<style lang="scss" scoped></style>

<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-clipboard-edit-outline"
      title="Reportes de ticket"
    >
      <v-card>
        <sigaf-category-course-toolbar
          @selectedCourse="selectedCourse = $event"
          source="Reports"
        ></sigaf-category-course-toolbar>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="12" sm="4">
              <div class="d-flex">
                <v-dialog
                  ref="dialog"
                  v-model="modalDates"
                  :return-value.sync="dates"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      label="Rango de fechas"
                      prepend-inner-icon="mdi-calendar"
                      color="blueS"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="dates" range>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modalDates = false">
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(dates)"
                    >
                      Aceptar
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-btn
                  class="ml-2"
                  color="blueS"
                  dark
                  @click="handleFindByRangeOfDates"
                  :loading="loadingDates"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-sheet class="mx-auto" elevation="8">
            <v-slide-group
              v-model="model"
              class="pa-4"
              show-arrows
              mandatory
              center-active
            >
              <v-slide-item
                v-for="date in transformDates"
                :key="date"
                v-slot="{ active, toggle }"
              >
                <v-card
                  :color="active ? 'blueS' : 'grey lighten-2'"
                  class="ma-4"
                  height="50"
                  width="150"
                  outlined
                  @click="toggle"
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
                      >{{ date }}</span
                    >
                  </div>
                </v-card>
              </v-slide-item>
            </v-slide-group>

            <v-expand-transition>
              <v-sheet v-if="model != null" height="200" tile>
                <v-row class="fill-height" align="center" justify="center">
                  <h3 class="title">Selected {{ transformDates[model] }}</h3>
                </v-row>
              </v-sheet>
            </v-expand-transition>
          </v-sheet>
        </v-card-text>
      </v-card>
    </base-card>
  </div>
</template>

<script>
import moment from 'moment'
import SigafCategoryCourseToolbar from '../../components/utility/SigafCategoryCourseToolbar.vue'
export default {
  components: { SigafCategoryCourseToolbar },
  data: () => ({
    model: null,
    modalDates: false,
    dates: [],
    transformDates: [],
    loadingDates: false
  }),
  computed: {
    dateRangeText() {
      if (this.dates) {
        let array = [...this.dates]

        const mappedArray = array.map(date => {
          const split = date.split('-')

          return `${split[2]}-${split[1]}-${split[0]}`
        })
        return mappedArray.join(' a ')
      } else {
        return ''
      }
    }
  },
  methods: {
    handleFindByRangeOfDates() {
      if (this.dates.length === 2) {
        const firstDay = moment(this.dates[0])
        const secondDay = moment(this.dates[1])

        const numberOfDays = secondDay.diff(firstDay, 'days')

        let dates = []
        let date = moment(this.dates[0])
        dates.push(date.format('DD-MM-YYYY'))
        for (let index = 0; index < numberOfDays; index++) {
          const newDate = date.add(1, 'days')
          dates.push(newDate.format('DD-MM-YYYY'))
        }

        this.transformDates = [...dates]
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

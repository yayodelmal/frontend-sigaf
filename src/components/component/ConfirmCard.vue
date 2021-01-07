<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialog"
    max-width="350"
    persistent
  >
    <base-card :loading="loading">
      <template v-slot:progress>
        <v-progress-linear color="blueS" indeterminate></v-progress-linear>
      </template>
      <v-toolbar flat color="blueS darken-1" dark dense>
        <v-toolbar-title>SIGAF</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="d-flex align-center flex-column mt-6">
        <v-icon :color="colorIcon" size="40">{{ icon }}</v-icon>
        <div class="mt-2 text-center">
          <slot name="content"> </slot>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small outlined @click="cancel()">
          CANCELAR
        </v-btn>
        <v-btn
          small
          color="blueS"
          dark
          depressed
          @click="generateLoadingButton()"
        >
          ACEPTAR
        </v-btn>
      </v-card-actions>
    </base-card>
  </v-dialog>
</template>

<script>
import BaseCard from '../base/CardTest'

export default {
  components: {
    BaseCard
  },
  data: () => ({
    loading: false
  }),
  props: {
    dialog: Boolean,
    cancel: Function,
    accept: Function,
    icon: String,
    colorIcon: String
  },
  watch: {
    dialog() {
      if (this.dialog) {
        this.loading = false
      }
    }
  },
  methods: {
    generateLoadingButton() {
      this.loading = true
      this.accept()
    }
  }
}
</script>

<style scoped></style>

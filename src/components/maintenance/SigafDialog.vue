<template>
  <v-dialog :value="dialog" :max-width="maxWidth" persistent>
    <v-card :loading="loadingSave">
      <template v-slot:progress>
        <v-progress-linear color="blueS" indeterminate></v-progress-linear>
      </template>
      <v-toolbar dark color="blueS darken-1">
        <v-toolbar-title>
          {{ formTitle }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pt-5">
        <slot name="default"></slot>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">
          CANCELAR
        </v-btn>
        <v-btn :loading="loading" color="blueS" dark depressed @click="save">
          ACEPTAR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, required: true },
    formTitle: {
      type: String,
      required: true
    },
    loadingSave: { type: Boolean },
    loading: { type: Boolean },
    maxWidth: { type: String, default: () => '500px' }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      this.$emit('save')
    }
  }
}
</script>

<style lang="scss" scoped></style>

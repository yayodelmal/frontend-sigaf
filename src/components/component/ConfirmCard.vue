<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    v-model="computedDialog"
    max-width="350"
  >
    <base-card>
      <v-toolbar flat color="blueS" dark dense>
        <v-toolbar-title>SIGAF</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="text-center title my-6">
        ¿Cerrar sesión?
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined @click="dialog = false">
          CANCELAR
        </v-btn>
        <v-btn color="blueS" dark depressed @click="logout">
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
  props: {
    dialog: Boolean
  },
  computed: {
    computedDialog: {
      get() {
        return this.dialog
      },
      set(value) {
        this.$emit('update:dialog', value)
      }
    }
  }
}
</script>

<style scoped></style>

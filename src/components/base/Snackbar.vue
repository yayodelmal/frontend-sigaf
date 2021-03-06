<template>
  <v-snackbar
    v-bind="$attrs"
    v-on="$listeners"
    :color="setColor"
    :value="value"
    @input="$emit('input', $event)"
    :timeout="timeout"
  >
    <v-icon x-large dark>{{ setIcon }}</v-icon>
    <span class="ml-3">{{ message }}</span>
    <v-btn dark text @click="$emit('input', $event)">
      Cerrar
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BaseSnackbar',
  props: {
    type: String,
    message: String,
    value: Boolean
  },
  data: () => ({
    color: '',
    timeout: 5000,
    icon: ''
  }),

  computed: {
    setColor() {
      switch (this.type) {
        case 'success':
          return 'blueS'
        case 'warning':
          return 'warning'
        case 'danger':
          return 'redS'
        default:
          return 'blueS'
      }
    },
    setIcon() {
      switch (this.type) {
        case 'success':
          return 'mdi-check-circle-outline'
        case 'warning':
          return 'mdi-alert-circle-outline'
        case 'danger':
          return 'mdi-alert-outline'
        default:
          return ''
      }
    }
  }
}
</script>

<template>
  <v-snackbar
    v-bind="$attrs"
    v-on="$listeners"
    :color="setColor"
    v-model="isActive"
    :timeout="timeout"
  >
    <v-icon x-large dark>{{ setIcon }}</v-icon>
    <span class="ml-3">{{ message }}</span>
    <v-btn dark text @click="isActive = false">
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
    active: {
      type: Boolean
    },
    message: String
  },
  data: () => ({
    color: '',
    timeout: 5000,
    icon: '',
    isActive: false
  }),
  watch: {
    active() {
      this.isActive = this.active
    },
    isActive() {
      this.$emit('changeValue', this.isActive)
    }
  },
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

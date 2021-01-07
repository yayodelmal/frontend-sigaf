<template>
  <v-alert
    v-bind="$attrs"
    v-on="$listeners"
    v-model="active"
    color="success"
    elevation="4"
    dismissible
    close-icon="mdi-close"
    colored-border
    border="left"
    width="400"
    icon="mdi-checkbox-marked-circle-outline"
    transition="scale-transition"
  >
    <span class="ml-3">{{ message }}</span>
  </v-alert>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BaseAlert',
  props: {
    value: Boolean,
    typeAlert: String,
    message: String
  },
  data: () => ({
    color: '',
    timeout: 5000,
    icon: ''
  }),
  watch: {
    value() {
      if (this.value) {
        setTimeout(() => {
          this.active = false
        }, 4000)
      }
    }
  },
  computed: {
    active: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    setColor() {
      switch (this.typeAlert) {
        case 'success':
          return 'success'
        case 'warning':
          return 'warning'
        case 'error':
          return 'redS'
        default:
          return 'blueS'
      }
    },
    setIcon() {
      switch (this.typeAlert) {
        case 'success':
          return 'mdi-check-circle-outline'
        case 'warning':
          return 'mdi-alert-circle-outline'
        case 'error':
          return 'mdi-alert-outline'
        default:
          return ''
      }
    }
  }
}
</script>

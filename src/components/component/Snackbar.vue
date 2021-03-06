<template>
  <snackbar
    app
    v-bind="$attrs"
    v-on="$listeners"
    color="white"
    v-model="active"
    :timeout="timeout"
    transition="scale-transition"
    :content-class="setClass"
  >
    <div class="d-flex justtify-content-between">
      <v-icon size="30" :color="setColor" dark>{{ setIcon }}</v-icon>
      <v-spacer />
      <span class="ml-3 mr-10 mt-1 grayS--text text-subtitle-1">{{
        message
      }}</span>
      <v-spacer />
      <v-btn icon @click="active = false">
        <v-icon :color="setColor">mdi-close</v-icon>
      </v-btn>
    </div>
  </snackbar>
</template>

<script>
import Snackbar from '../../components/base/BaseSnackbar'
export default {
  inheritAttrs: false,
  name: 'BaseSnackbar',
  components: {
    Snackbar
  },
  props: {
    value: Boolean,
    type: String,
    message: String
  },
  data: () => ({
    colorIcon: '',
    timeout: 3000,
    icon: '',
    style: ''
  }),
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
      switch (this.type) {
        case 'success':
          return 'success'
        case 'warning':
          return 'warning'
        case 'error':
          return 'error'
        default:
          return 'blueS'
      }
    },
    setClass() {
      switch (this.type) {
        case 'success':
          return 'success_'
        case 'warning':
          return 'warning_'
        case 'error':
          return 'error_'
        default:
          return 'blueS'
      }
    },
    setIcon() {
      switch (this.type) {
        case 'success':
          return 'mdi-check-circle'
        case 'warning':
          return 'mdi-alert-circle'
        case 'error':
          return 'mdi-alert'
        default:
          return ''
      }
    }
  }
}
</script>
<style scope>
.v-application--is-ltr .v-snack__action {
  margin-right: 0;
}

.success_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #4caf50;
  border-left-style: solid;
  /* background-color: white; */
}

.error_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #ff5252;
  border-left-style: solid;
  /* background-color: white; */
}

.info_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #2196f3;
  border-left-style: solid;
  /* background-color: white; */
}

.warning_ {
  border-radius: 5px;
  border-left: 10px;
  border-left-color: #fb8c00; /*#ffc107;*/
  border-left-style: solid;
  /* background-color: white; */
}
</style>

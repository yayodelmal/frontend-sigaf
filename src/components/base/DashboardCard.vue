<template>
  <v-card v-bind="$attrs" :class="classes" class="v-card--material mt-5" fluid>
    <div class="d-flex grow flex-wrap">
      <v-sheet
        :color="color"
        :max-height="icon ? 90 : undefined"
        :width="icon ? 'auto' : '100%'"
        elevation="12"
        class="v-card--material__heading mb-n6 pa-7 rounded-lg"
        dark
      >
        <slot v-if="$slots.heading" name="heading" />

        <div
          v-else-if="title && !icon"
          class="display-1 font-weight-light"
          v-text="title"
        />

        <v-icon v-else-if="icon" size="32" v-text="icon" />

        <div v-if="text" class="headline font-weight-thin" v-text="text" />
      </v-sheet>

      <div v-if="$slots['after-heading']" class="ml-16">
        <slot name="after-heading" />
      </div>

      <div v-else-if="icon && title" class="ml-4">
        <div class="display-1 font-weight-light" v-text="title" />
      </div>
    </div>
    <v-card-text>
      <slot v-if="$slots.searchInput" name="searchInput" />
    </v-card-text>

    <slot />

    <template v-if="$slots.actions">
      <v-divider class="mt-2" />
      <slot name="actions" />
    </template>
  </v-card>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'DashboardCard',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'success'
    },
    icon: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },

  computed: {
    classes() {
      return {
        'v-card--material--has-heading': this.hasHeading
      }
    },
    hasHeading() {
      return Boolean(this.$slots.heading || this.title || this.icon)
    },
    hasAltHeading() {
      return Boolean(this.$slots.heading || (this.title && this.icon))
    }
  }
}
</script>

<style scope lang="sass">
.v-card--material
  &__avatar
    position: relative
    top: -64px
    margin-bottom: -32px

  &__heading
    position: relative
    top: -30px
    transition: .3s ease
    z-index: 1
</style>

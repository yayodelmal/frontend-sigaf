<template>
  <v-card class="rounded-t-lg" elevation="5">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <sigaf-header-card :title="title" />
        </v-col>
        <v-col cols="12">
          <v-row justify="center">
            <slot name="content" />
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import SigafHeaderCard from './SigafHeaderCard.vue'
export default {
  components: { SigafHeaderCard },
  props: {
    title: String
  }
}
</script>

<style lang="scss" scoped></style>

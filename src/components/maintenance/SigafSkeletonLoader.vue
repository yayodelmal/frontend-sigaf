<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      :transition="transition"
      class="mx-auto"
      type="table-heading"
    ></v-skeleton-loader>
    <v-skeleton-loader
      :loading="loading"
      :transition="transition"
      class="mx-auto"
      type="table-tbody"
    ></v-skeleton-loader>
    <v-skeleton-loader
      :loading="loading"
      :transition="transition"
      class="mx-auto"
      type="table-tfoot"
    ></v-skeleton-loader>
  </div>
</template>

<script>
export default {
  props: ['loading', 'transition']
}
</script>

<style scoped></style>

<template>
  <v-app-bar color="blueS" app clipped-left dark>
    <v-spacer></v-spacer>
    <v-toolbar-title>{{ mayusTitle }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  name: 'NavBarApp',
  data: () => ({
    title: `Sistema de Información para la Gestión de Acciones
      Formativas`
  }),
  computed: {
    mayusTitle() {
      return this.title.toUpperCase()
    }
  }
}
</script>

<style lang="scss" scoped></style>

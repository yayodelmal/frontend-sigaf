<template>
  <div>
    <div class="d-flex justify-space-between ml-5">
      <span
        class="font-weight-bold  blueS--text overline d-flex justify-start ml-5"
      >
        {{ title }}
      </span>
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="blueS"
            v-if="showEditButton"
            icon
            v-on="on"
            @click="$emit('showEditForm')"
          >
            <v-icon size="40">mdi-account-edit</v-icon>
          </v-btn>
        </template>
        <span>Editar</span>
      </v-tooltip>
    </div>
    <div class="d-flex justify-start container-divider">
      <v-divider class="blueS width-50" />
      <!--       <v-divider class="mt-1 blueS width-25" />
      <v-divider class="mt-1 blueS width-12" /> -->
      <!--       <v-divider class="mt-1 blueS width-6" />
      <v-divider class="mt-1 blueS width-3" /> -->
      <!--       <v-divider class="mt-1 blueS width-1" />
      <v-divider class="mt-1 blueS width-1" />
      <v-divider class="mt-1 blueS width-1" /> -->
      <v-divider class="blueS width-50" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SigafHeaderCard',
  props: {
    title: {
      type: String,
      default: () => 'Titulo por defecto'
    },
    showEditButton: Boolean
  }
}
</script>

<style lang="scss" scoped>
$margin-left: 0px;
$padding-top: 2px;
.width-50 {
  padding-top: $padding-top;
  width: 50%;
  max-width: 50%;
  margin: 0 $margin-left;
}
.width-25 {
  padding-top: $padding-top;
  width: 25%;
  max-width: 25%;
  margin-left: $margin-left;
}
.width-12 {
  padding-top: $padding-top;
  width: 12%;
  max-width: 12%;
  margin-left: $margin-left;
}
.width-6 {
  padding-top: $padding-top;
  width: 6%;
  max-width: 6%;
  margin-left: $margin-left;
}
.width-3 {
  padding-top: $padding-top;
  width: 3%;
  max-width: 3%;
  margin-left: $margin-left;
}
.width-1 {
  padding-top: $padding-top;
  width: 1%;
  max-width: 1%;
  margin-left: $margin-left;
}

.container-divider {
  width: 100%;
}
</style>

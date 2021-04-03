<template>
  <v-card class="rounded-t-lg" elevation="5">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <sigaf-header-card
            :showEditButton="showEditButton"
            :title="title"
            @showEditForm="$emit('showEditForm')"
          />
        </v-col>
        <v-col cols="12">
          <v-row justify="center">
            <slot name="content" />
          </v-row>
        </v-col>
        <v-col class="d-flex" v-if="showLastSync" cols="12">
          <div class="mx-auto">
            <v-chip color="blueS" dark class="mr-2">
              <v-icon left>
                mdi-cloud-sync
              </v-icon>
              {{ lastDateSync }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import SigafHeaderCard from './SigafHeaderCard.vue'
export default {
  components: { SigafHeaderCard },
  props: {
    title: String,
    showEditButton: Boolean,
    showLastSync: Boolean
  },
  computed: {
    ...mapGetters({
      lastDateSync: 'courseRegisteredUser/lastDateSync'
    })
  }
}
</script>

<style lang="scss" scoped></style>

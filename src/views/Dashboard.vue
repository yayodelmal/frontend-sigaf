<template>
  <div>
    <v-container class="grey lighten-5">
      <h1>Dashboard</h1>
      <v-row>
        <v-col v-for="n in 3" :key="n" cols="12" sm="4">
          <v-card class="mx-auto" max-width="344" outlined>
            <v-list-item three-line>
              <v-list-item-avatar tile size="80" color="grey"
                >5</v-list-item-avatar
              >
              <v-list-item-content>
                <div class="overline mb-4">OVERLINE</div>
                <v-list-item-title class="headline mb-1"
                  >Headline 5</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  created() {},
  computed: {},
  methods: {}
}
</script>

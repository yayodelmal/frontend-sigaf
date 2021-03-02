<template>
  <v-card elevation="0">
    <v-row>
      <v-col cols="12">
        <base-textfield
          required
          color="blueS"
          v-model="subject"
          clearable
          placeholder="Asunto"
          class="mb-n3"
        ></base-textfield>
        <sigaf-editor v-model="text" />
        <v-file-input
          outlined
          multiple
          dense
          v-model="files"
          placeholder="Adjuntar documentos"
          prepend-icon=""
          prepend-inner-icon="mdi-paperclip"
          color="blueS"
          show-size
          class="mt-3 mb-n10"
        >
          <template v-slot:selection="{ text }">
            <v-chip label color="blueS" dark small>
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import SigafEditor from './SigafEditor.vue'
export default {
  components: { SigafEditor },
  props: {
    sender: Boolean
  },
  data: () => ({
    text: '',
    subject: '',
    files: null
  }),
  watch: {
    sender() {
      if (this.sender) {
        this.$emit('emailComposer', {
          text: this.text,
          subject: this.subject,
          files: this.files
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

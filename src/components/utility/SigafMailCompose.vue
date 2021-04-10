<template>
  <v-card elevation="0">
    <v-row>
      <v-col cols="12">
        <base-textfield
          color="blueS"
          v-model="subject"
          clearable
          hide-details
          placeholder="Asunto"
        ></base-textfield>
      </v-col>
      <v-col cols="12">
        <base-textfield
          color="blueS"
          v-model="CCRecipient"
          clearable
          hide-details
          placeholder="CC"
        ></base-textfield>
      </v-col>
      <v-col cols="12">
        <sigaf-editor v-model="text" />
      </v-col>
      <!--       <v-col cols="12">
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
        >
          <template v-slot:selection="{ text }">
            <v-chip label color="blueS" dark small>
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-col> -->

      <v-col cols="12">
        <v-card outlined>
          <v-card-text>
            <div v-show="isFileUploadedExist">
              <span class="overline font-weight-size blueS--text ml-3"
                >Archivo adjuntos</span
              >
              <div class="d-flex justify-start flex-wrap">
                <v-chip
                  v-for="file in uploadedFiles"
                  :key="file.name"
                  class="ma-2"
                  close
                  color="blueS darken-2"
                  outlined
                  @click:close="handleDeleteFile(file)"
                >
                  <v-icon>
                    mdi-file-upload
                  </v-icon>
                  {{ file.name }}({{ Number((file.size / 1024).toFixed(1)) }}K)
                </v-chip>
              </div>

              <!--               <v-virtual-scroll
                :items="uploadedFiles"
                item-height="64"
                height="200"
              >
                <template v-slot:default="{ item }">
                  <v-list>
                    <v-list-item class="blue-grey lighten-5" :key="item.name">
                      <v-list-item-action>
                        <v-icon>
                          mdi-file-upload
                        </v-icon>
                      </v-list-item-action>

                      <v-list-item-content class="d-flex">
                        <v-list-item-title>
                          {{ item.name }}
                          <strong class="float-right">
                            {{
                              Number((item.size / 1024 / 1024).toFixed(1))
                            }}MB</strong
                          >
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-btn
                          small
                          icon
                          color="redS"
                          @click="handleDeleteFile(item)"
                        >
                          <v-icon>
                            mdi-close-circle-outline
                          </v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>
                  </v-list>
                </template>
              </v-virtual-scroll> -->
            </div>
            <v-row class="mb-n8">
              <v-col cols="8">
                <v-file-input
                  outlined
                  dense
                  v-model="file"
                  placeholder="Adjuntar documento"
                  prepend-icon=""
                  prepend-inner-icon="mdi-paperclip"
                  color="blueS"
                  show-size
                >
                  <template v-slot:selection="{ text }">
                    <v-chip label color="blueS" dark>
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
              <v-col cols="4">
                <v-btn
                  :loading="loadingFile"
                  block
                  color="blueS"
                  dark
                  depressed
                  right
                  @click="handleUploadFile"
                  >Subir</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import SigafEditor from './SigafEditor.vue'
import * as easings from 'vuetify/es5/services/goto/easing-patterns'

export default {
  components: { SigafEditor },
  props: {
    sender: Boolean
  },
  data: () => ({
    text: '',
    subject: '',
    files: null,
    file: null,
    uploadedFiles: [],
    easing: 'easeInOutCubic',
    easings: Object.keys(easings),
    duration: 1000,
    offset: 300,
    filesUploadedRef: null,
    CCRecipient: '',
    loadingFile: false
  }),
  mounted() {},
  watch: {
    sender() {
      if (this.sender) {
        this.$emit('emailComposer', {
          text: this.text,
          subject: this.subject,
          CCRecipient: this.CCRecipient,
          files: this.uploadedFiles
        })
      }
    }
  },
  computed: {
    isFileUploadedExist() {
      return this.uploadedFiles.length !== 0
    },
    options() {
      return {
        duration: this.duration,
        offset: this.offset
        // easing: this.easing
      }
    }
  },
  methods: {
    ...mapActions({
      uploadFileEmail: 'ticket/uploadFileEmail',
      deleteFileEmail: 'ticket/deleteFileEmail'
    }),
    async handleUploadFile() {
      this.loadingFile = true
      const uploadedFile = await this.uploadFileEmail({ file: this.file })

      /**
      * Object = {
      * name: "56653.jpg"
      * size: 68379
      + url: "/storage/56653.jpg"
      * }
      */

      this.uploadedFiles.push(uploadedFile)
      this.file = null
      this.loadingFile = false
    },
    async handleDeleteFile(file) {
      const deleteFile = await this.deleteFileEmail({ name: file.name })

      /**
      * Object = {
      * name: "56653.jpg"
      * size: 68379
      + url: "/storage/56653.jpg"
      * }
      */

      if (deleteFile) {
        const editedIndex = this.uploadedFiles.findIndex(
          find => find.name === file.name
        )
        this.uploadedFiles.splice(editedIndex, 1)
      } else {
        console.log('error')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

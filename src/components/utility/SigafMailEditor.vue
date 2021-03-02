<template>
  <v-card min-height="300">
    <v-text-field placeholder="Your Post Title" />
    <v-card-text id="scrolling-container" ref="container">
      <div id="editor" ref="editor"></div>
    </v-card-text>
  </v-card>
</template>

<script>
import Quill from 'quill'

import 'quill/dist/quill.snow.css'

export default {
  name: 'sigaf-mail-editor',
  data: () => ({
    quillData: ''
  }),
  mounted() {
    // Init the Quill RTE
    this.quillData = new Quill(this.$refs.editor, {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ color: [] }, { background: [] }]
        ]
      },
      scrollingContainer: this.$refs.container,
      theme: 'snow' // or 'bubble'
    })
    this.quillData.insert('Buenos días', { bold: true, color: '#ccc' })
  },
  computed: {
    content() {
      const delta = this.quillData.root.innerHTML
      return JSON.stringify(delta)
    }
  }
}
</script>

<style lang="scss">
// Quill Adjustments

/* Tell Quill not to scroll */
#editor {
  height: auto;
  min-height: 250px;
}
#editor .ql-editor {
  overflow-y: visible;
}
/* Specify our own scrolling container */
#scrolling-container {
  height: 100%;
  min-height: 100%;
  overflow-y: auto;
}
</style>

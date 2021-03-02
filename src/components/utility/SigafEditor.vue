<template>
  <ckeditor
    :editor="editor"
    :value="value"
    @input="$emit('input', $event)"
    :config="editorConfig"
  ></ckeditor>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  props: {
    value: String
  },
  data: () => ({
    editor: ClassicEditor,
    editorConfig: {
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'bulletedList',
        'numberedList',
        '|',
        'undo',
        'redo'
      ]
    }
  })
}
</script>

<style lang="scss" scoped></style>

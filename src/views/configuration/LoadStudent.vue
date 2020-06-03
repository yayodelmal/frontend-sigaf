<template>
  <base-card color="blueS" class="px-5 py-3" title="Gestión de estudiantes">
    <v-file-input
      v-model="file"
      placeholder="Cargar archivo estudiantes"
      label="Archivo"
      prepend-icon="mdi-paperclip"
      color="blueS"
      show-size
    >
      <template v-slot:selection="{ text }">
        <v-chip label color="blueS" dark large>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>
    <v-card-actions>
      <v-spacer></v-spacer>
      <base-button
        icon="mdi-check-circle"
        label="Cargar"
        @click="sendFile"
      ></base-button>
    </v-card-actions>
    <v-card>
      <ul>
        <li v-for="d in data" :key="d.rut">
          Rut: {{ d.rut }} Nombre: {{ d.nombre }} Apellidos:
          {{ d.apellidoPaterno }}
        </li>
      </ul>
    </v-card>
    <br /><br />
    <v-card>
      <ul>
        <li v-for="d in dataMoodle" :key="d.id">
          id: {{ d.id }} Rut: {{ d.rut }} Nombre: {{ d.nombre }}
        </li>
      </ul>
    </v-card>
  </base-card>
</template>

<script>
import axios from '../../services/axios'
export default {
  data: () => ({
    file: null,
    data: [],
    dataMoodle: []
  }),
  methods: {
    async sendFile() {
      let formData = new FormData()
      formData.append('file', this.file)

      const config = {
        'Content-Type': 'multipart/form-data'
      }
      const response = await axios.post('/api/v2/upload-file', formData, config)

      this.data = response.data.success

      const student = await axios.get('/api/v2/sync-moodle-student')

      this.dataMoodle = student.data
    }
  }
}
</script>

<style lang="scss" scoped></style>

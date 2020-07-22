module.exports = {
  // preset: '@vue/cli-plugin-unit-jest',
  // setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.js']

  verbose: true,
  roots: ['<rootDir>/src/', '<rootDir>/tests/unit'],
  moduleFileExtensions: ['js', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // 'vuetify/lib': '<rootDir>/node_modules/vuetify/es5',
    '^vue$': 'vue/dist/vue.common.js'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.js'],
  modulePaths: ['<rootDir>', '<rootDir>/src'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  transformIgnorePatterns: ['node_modules/(?!vue-router|@babel|vuetify|vue)']
}

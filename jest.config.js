module.exports = {
  // preset: '@vue/cli-plugin-unit-jest',
  // setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.js']

  verbose: true,
  roots: ['<rootDir>/src/', '<rootDir>/tests/unit'],
  moduleFileExtensions: ['js', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.js'],
  modulePaths: ['<rootDir>', '<rootDir>/src/components/base'],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue']
}

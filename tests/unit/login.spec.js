import { shallowMount } from '@vue/test-utils'
import '../../src/plugins/base'
import Vue from 'vue'
import Vuetify from 'vuetify'

import Login from '@/views/Login.vue'

Vue.use(Vuetify)

describe('Renders', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Login)
  })
  it('renders a Login view', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
})

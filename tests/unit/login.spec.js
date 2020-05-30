import { createLocalVue, shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue'
import Navbar from '@/components/my/Navbar'
import Vuetify from 'vuetify'

const localVue = createLocalVue()

describe('Login.vue', () => {
  let wrapper
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()

    wrapper = shallowMount(Login, {
      localVue,
      vuetify
    })
  })
  it('renders a vue instance', () => {
    expect(shallowMount(Login).isVueInstance()).toBe(true)
  })

  it('has an base-card', () => {
    expect(wrapper.contains('base-card')).toBe(true)
  })
  it('check if child NavBar exists', () => {
    expect(wrapper.contains(Navbar)).toBe(true)
  })
  it('has an v-form', () => {
    expect(wrapper.contains('v-form')).toBe(true)
  })
  // it('has an base-card', () => {
  //   expect(wrapper.contains('base-card')).toBe(true)
  // })
})

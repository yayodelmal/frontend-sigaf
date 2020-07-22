import { mount, createLocalVue } from '@vue/test-utils'
import '../../src/plugins/base'
import store from '../../src/store/index'
//import Vue from 'vue'
import Vuetify from 'vuetify'
// import { VBtn, VContainer } from 'vuetify/lib'

import Classroom from '@/views/maintenance/Classroom.vue'

//Vue.use(Vuetify)

const localVue = createLocalVue()

describe('Renders', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  test('renders a Classroom view', () => {
    const wrapper = mount(Classroom, {
      store,
      localVue,
      vuetify
    })

    expect(wrapper.isVueInstance()).toBe(true)
  })

  test('should emit an event when the action v-btn is clicked', () => {
    const wrapper = mount(Classroom, {
      store,
      localVue,
      vuetify
    })

    const event = jest.fn()
    const button = wrapper.find('.v-btn')
    //  wrapper.setMethods({ event: jest.fn() })

    console.log(event)

    // Here we bind a listener to the wrapper
    // instance to catch our custom event
    // https://vuejs.org/v2/api/#Instance-Methods-Events
    wrapper.vm.$on('action-btn:clicked', event)

    expect(event).toHaveBeenCalledTimes(0)

    // Simulate a click on the button
    button.trigger('click')

    // Ensure that our mock event was called
    expect(event).toHaveBeenCalledTimes(1)
  })
})

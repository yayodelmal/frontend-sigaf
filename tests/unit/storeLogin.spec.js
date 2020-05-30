import Vuex from 'vuex'

import '@/plugins/base.js'
import authStore from '@/store/modules/auth.js'
import { createLocalVue, shallowMount } from '@vue/test-utils'

import Login from '@/views/Login'
import Navbar from '@/components/my/Navbar'

const VueWithVuex = createLocalVue()
VueWithVuex.use(Vuex)

describe('Login.vue', () => {
  test('Se renderiza el componente Login ', () => {
    const wrapper = shallowMount(Login, {
      localVue: VueWithVuex
    })

    expect(wrapper.exists()).toBe(true)
  })

  test('Se renderiza el componente hijo NavBar ', () => {
    const wrapper = shallowMount(Login, {
      localVue: VueWithVuex
    })

    const nav = wrapper.find(Navbar) // => finds Bar by component instance
    expect(nav.exists()).toBe(true)
  })

  test('Se inicializan validaciones Vuelidate ', () => {
    const wrapper = shallowMount(Login, {
      localVue: VueWithVuex
    })

    console.log(wrapper.vm.$v.$touch)

    expect(wrapper.vm.$v).toBeDefined()
  })

  test('Validación de email ', () => {
    const wrapper = shallowMount(Login, {
      localVue: VueWithVuex
    })

    wrapper.setData({
      userEdited: {
        email: 'robaraneda@gmail.com'
      }
    })

    const inputForNewUser = wrapper.find({ name: 'BaseTextfield' })

    console.log(inputForNewUser)
    expect(wrapper.vm.userEdited.email).toBe('robaraneda@gmail.com')
  })

  test('Se inicializa store ', () => {
    const store = new Vuex.Store(authStore)
    shallowMount(Login, {
      localVue: VueWithVuex,
      store
    })

    store.state.loginUser = {
      email: 'test@test.cl',
      password: '12345'
    }

    expect(store.getters.user).toEqual({
      email: 'test@test.cl',
      password: '12345'
    })
  })

  test('Se obtiene el usuario a través de mapGetters ', () => {
    const store = new Vuex.Store(authStore)
    const wrapper = shallowMount(Login, {
      localVue: VueWithVuex,
      store
    })

    store.state.loginUser = {
      email: 'test@test.cl',
      password: '12345'
    }

    expect(wrapper.vm.user).toEqual({
      email: 'test@test.cl',
      password: '12345'
    })
  })
})

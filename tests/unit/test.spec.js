import Button from '@/components/base/Btn.vue'
import { mount } from '@vue/test-utils'

test('Montar el componente Base Button', () => {
  const wrapper = mount(Button)

  expect(wrapper.html()).toMatchSnapshot()
})

import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import Register from '../Register.vue';

describe('Register', () => {
  const mountComponent = () => {
    return mount(Register, {
      global: {
        plugins: [Quasar],
      },
    });
  };

  it('renders register form', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.register-card').exists()).toBe(true);
    expect(wrapper.text()).toContain('Register');
  });
});

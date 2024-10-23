import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import Login from '../Login.vue';

describe('Login', () => {
  const mountComponent = () => {
    return mount(Login, {
      global: {
        plugins: [Quasar],
        stubs: ['router-link'],
      },
    });
  };

  it('renders login form', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.login-card').exists()).toBe(true);
    expect(wrapper.text()).toContain('Login');
  });

  it('displays link to Poloniex Live Trades', () => {
    const wrapper = mountComponent();
    const link = wrapper.find('router-link-stub[to="/poloniex-feed"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toContain('View Poloniex Live Trades');
  });
});

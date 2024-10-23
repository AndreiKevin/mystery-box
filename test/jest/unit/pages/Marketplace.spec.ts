import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Quasar } from 'quasar';
import Marketplace from '../Marketplace.vue';
import { useMarketStore } from '@/stores/market';

describe('Marketplace', () => {
  const mountComponent = () => {
    return mount(Marketplace, {
      global: {
        plugins: [
          Quasar,
          createTestingPinia({
            createSpy: jest.fn,
          }),
        ],
        stubs: ['mystery-box', 'treasure-grid'],
      },
    });
  };

  it('renders mystery box and treasure grid components', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('mystery-box-stub').exists()).toBe(true);
    expect(wrapper.find('treasure-grid-stub').exists()).toBe(true);
  });

  it('calls refreshInventory on mount', async () => {
    const wrapper = mountComponent();
    const marketStore = useMarketStore();
    
    await flushPromises();

    expect(marketStore.fetchInventory).toHaveBeenCalled();
    expect(marketStore.fetchMysteryBoxes).toHaveBeenCalled();
  });

  it('refreshes inventory when refresh button is clicked', async () => {
    const wrapper = mountComponent();
    const marketStore = useMarketStore();
    
    await wrapper.find('.q-btn').trigger('click');
    await flushPromises();

    expect(marketStore.fetchInventory).toHaveBeenCalledTimes(2);
    expect(marketStore.fetchMysteryBoxes).toHaveBeenCalledTimes(2);
  });
});

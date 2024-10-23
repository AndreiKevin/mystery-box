import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Quasar } from 'quasar';
import TreasureGrid from '@/components/market/TreasureGrid.vue';
import { dummyTreasures } from '@/test/dummyData';

describe('TreasureGrid', () => {
  const mountComponent = () => {
    return mount(TreasureGrid, {
      global: {
        plugins: [
          Quasar,
          createTestingPinia({
            createSpy: jest.fn,
            initialState: {
              market: { treasures: dummyTreasures },
            },
          }),
        ],
      },
    });
  };

  it('renders treasures', () => {
    const wrapper = mountComponent();
    const treasureCards = wrapper.findAll('.treasure-card');
    expect(treasureCards).toHaveLength(dummyTreasures.length);
  });

  it('displays correct treasure information', () => {
    const wrapper = mountComponent();
    const firstTreasureCard = wrapper.findAll('.treasure-card')[0];
    expect(firstTreasureCard.text()).toContain(dummyTreasures[0].name);
    expect(firstTreasureCard.text()).toContain(`${dummyTreasures[0].remaining_quantity}/${dummyTreasures[0].initial_quantity}`);
  });

  it('calculates progress color correctly', () => {
    const wrapper = mountComponent();
    const progressBars = wrapper.findAll('.q-linear-progress');
    expect(progressBars[0].classes()).toContain('bg-positive');
    expect(progressBars[1].classes()).toContain('bg-warning');
  });
});

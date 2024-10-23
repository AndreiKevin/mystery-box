import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Quasar } from 'quasar';
import MysteryBox from '@/components/market/MysteryBox.vue';
import { dummyMysteryBoxes } from '@/test/dummyData';

describe('MysteryBox', () => {
  const mountComponent = () => {
    return mount(MysteryBox, {
      global: {
        plugins: [
          Quasar,
          createTestingPinia({
            createSpy: jest.fn,
            initialState: {
              market: { mysteryBoxes: dummyMysteryBoxes },
              auth: { userCredits: 200 },
            },
          }),
        ],
      },
    });
  };

  it('renders mystery boxes', async () => {
    const wrapper = mountComponent();
    await flushPromises();

    const boxes = wrapper.findAll('.mystery-box');
    expect(boxes).toHaveLength(dummyMysteryBoxes.length);
  });

  it('disables purchase button when user has insufficient credits', async () => {
    const wrapper = mountComponent();
    await flushPromises();

    const purchaseButtons = wrapper.findAll('.q-btn');
    expect(purchaseButtons[0].attributes('disabled')).toBeFalsy();
    expect(purchaseButtons[1].attributes('disabled')).toBeTruthy();
  });

  it('opens purchase modal when clicking on a box', async () => {
    const wrapper = mountComponent();
    await flushPromises();

    const firstBox = wrapper.findAll('.mystery-box')[0];
    await firstBox.trigger('click');

    expect(wrapper.vm.showPurchaseModal).toBe(true);
    expect(wrapper.vm.selectedBox).toEqual(dummyMysteryBoxes[0]);
  });
});

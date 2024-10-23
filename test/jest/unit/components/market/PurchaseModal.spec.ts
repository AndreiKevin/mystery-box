import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import PurchaseModal from '../PurchaseModal.vue';
import { dummyMysteryBoxes } from '@/test/dummyData';

describe('PurchaseModal', () => {
  const mountComponent = (props = {}) => {
    return mount(PurchaseModal, {
      props: {
        modelValue: true,
        selectedBox: dummyMysteryBoxes[0],
        ...props,
      },
      global: {
        plugins: [Quasar],
      },
    });
  };

  it('renders correctly', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Confirm Purchase');
    expect(wrapper.text()).toContain(dummyMysteryBoxes[0].name);
    expect(wrapper.text()).toContain(dummyMysteryBoxes[0].price);
  });

  it('emits purchase event when confirming', async () => {
    const wrapper = mountComponent();
    await wrapper.find('button[label="Confirm"]').trigger('click');
    expect(wrapper.emitted('purchase')).toBeTruthy();
    expect(wrapper.emitted('purchase')[0]).toEqual([dummyMysteryBoxes[0]]);
  });

  it('closes modal when canceling', async () => {
    const wrapper = mountComponent();
    await wrapper.find('button[label="Cancel"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
  });
});

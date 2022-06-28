import { mount } from 'enzyme';
import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import { render, sleep } from '../../../tests/utils';
import ConfigProvider from '../../config-provider';
import Wave from '../wave';

describe('Wave component', () => {
  mountTest(Wave);

  afterEach(() => {
    const styles = document.getElementsByTagName('style');
    for (let i = 0; i < styles.length; i += 1) {
      styles[i].remove();
    }
  });

  it('isHidden works', () => {
    const TEST_NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const wrapper = mount(
      <Wave>
        <button type="button">button</button>
      </Wave>,
    );
    expect(wrapper.find('button').getDOMNode().className).toBe('');
    wrapper.find('button').getDOMNode().click();
    expect(
      wrapper.find('button').getDOMNode().hasAttribute('ant-click-animating-without-extra-node'),
    ).toBe(false);
    wrapper.unmount();
    process.env.NODE_ENV = TEST_NODE_ENV;
  });

  it('isHidden is mocked', () => {
    const wrapper = mount(
      <Wave>
        <button type="button">button</button>
      </Wave>,
    );
    expect(wrapper.find('button').getDOMNode().className).toBe('');
    wrapper.find('button').getDOMNode().click();
    expect(
      wrapper.find('button').getDOMNode().getAttribute('ant-click-animating-without-extra-node'),
    ).toBe('false');
    wrapper.unmount();
  });

  it('wave color is grey', async () => {
    const wrapper = mount(
      <Wave>
        <button
          type="button"
          style={{ borderColor: 'rgb(0, 0, 0)', backgroundColor: 'transparent' }}
        >
          button
        </button>
      </Wave>,
    );
    wrapper.find('button').getDOMNode().click();
    await sleep(0);
    const styles = wrapper.find('button').getDOMNode().getRootNode().getElementsByTagName('style');
    expect(styles.length).toBe(0);
    wrapper.unmount();
  });

  it('wave color is not grey', async () => {
    const wrapper = mount(
      <Wave>
        <button type="button" style={{ borderColor: 'red' }}>
          button
        </button>
      </Wave>,
    );
    wrapper.find('button').getDOMNode().click();
    await sleep(200);
    const styles = wrapper.find('button').getDOMNode().getRootNode().getElementsByTagName('style');
    expect(styles.length).toBe(1);
    expect(styles[0].innerHTML).toContain('--antd-wave-shadow-color: red;');
    wrapper.unmount();
  });

  it('read wave color from border-top-color', async () => {
    const wrapper = mount(
      <Wave>
        <div style={{ borderTopColor: 'blue' }}>button</div>
      </Wave>,
    );
    wrapper.find('div').getDOMNode().click();
    await sleep(0);
    const styles = wrapper.find('div').getDOMNode().getRootNode().getElementsByTagName('style');
    expect(styles.length).toBe(1);
    expect(styles[0].innerHTML).toContain('--antd-wave-shadow-color: blue;');
    wrapper.unmount();
  });

  it('read wave color from background color', async () => {
    const wrapper = mount(
      <Wave>
        <div style={{ backgroundColor: 'green' }}>button</div>
      </Wave>,
    );
    wrapper.find('div').getDOMNode().click();
    await sleep(0);
    const styles = wrapper.find('div').getDOMNode().getRootNode().getElementsByTagName('style');
    expect(styles.length).toBe(1);
    expect(styles[0].innerHTML).toContain('--antd-wave-shadow-color: green;');
    wrapper.unmount();
  });

  it('read wave color from border firstly', async () => {
    const wrapper = mount(
      <Wave>
        <div style={{ borderColor: 'yellow', backgroundColor: 'green' }}>button</div>
      </Wave>,
    );
    wrapper.find('div').getDOMNode().click();
    await sleep(0);
    const styles = wrapper.find('div').getDOMNode().getRootNode().getElementsByTagName('style');
    expect(styles.length).toBe(1);
    expect(styles[0].innerHTML).toContain('--antd-wave-shadow-color: yellow;');
    wrapper.unmount();
  });

  it('hidden element with -leave className', async () => {
    const wrapper = mount(
      <Wave>
        <button type="button" className="xx-leave">
          button
        </button>
      </Wave>,
    );
    wrapper.find('button').getDOMNode().click();
    await sleep(0);
    const styles = wrapper.find('button').getDOMNode().getRootNode().getElementsByTagName('style');
    expect(styles.length).toBe(0);
    wrapper.unmount();
  });

  it('ConfigProvider csp', async () => {
    const wrapper = mount(
      <ConfigProvider csp={{ nonce: 'YourNonceCode' }}>
        <Wave>
          <button type="button">button</button>
        </Wave>
      </ConfigProvider>,
    );
    wrapper.find('button').getDOMNode().click();
    await sleep(0);
    const styles = wrapper.find('button').getDOMNode().getRootNode().getElementsByTagName('style');
    expect(styles[0].getAttribute('nonce')).toBe('YourNonceCode');
    wrapper.unmount();
  });

  it('bindAnimationEvent should return when node is null', () => {
    const ref = React.createRef();
    render(
      <Wave ref={ref}>
        <button type="button" disabled>
          button
        </button>
      </Wave>,
    );
    expect(ref.current?.bindAnimationEvent()).toBe(undefined);
  });

  it('bindAnimationEvent.onClick should return when children is hidden', () => {
    const ref = React.createRef();
    render(
      <Wave ref={ref}>
        <button type="button" style={{ display: 'none' }}>
          button
        </button>
      </Wave>,
    );
    expect(ref.current?.bindAnimationEvent()).toBe(undefined);
  });

  it('bindAnimationEvent.onClick should return when children is input', () => {
    const ref = React.createRef();
    render(
      <Wave ref={ref}>
        <input />
      </Wave>,
    );
    expect(ref.current?.bindAnimationEvent()).toBe(undefined);
  });

  it('should not throw when click it', () => {
    expect(() => {
      const wrapper = mount(
        <Wave>
          <div />
        </Wave>,
      );
      wrapper.simulate('click');
    }).not.toThrow();
  });

  it('should not throw when no children', () => {
    expect(() => mount(<Wave />)).not.toThrow();
  });

  it('wave color should inferred if border is transparent and background is not', async () => {
    const wrapper = mount(
      <Wave>
        <button type="button" style={{ borderColor: 'transparent', background: 'red' }}>
          button
        </button>
      </Wave>,
    );
    wrapper.find('button').getDOMNode().click();
    await sleep(200);
    const styles = wrapper.find('button').getDOMNode().getRootNode().getElementsByTagName('style');
    expect(styles.length).toBe(1);
    expect(styles[0].innerHTML).toContain('--antd-wave-shadow-color: red;');
    wrapper.unmount();
  });
});

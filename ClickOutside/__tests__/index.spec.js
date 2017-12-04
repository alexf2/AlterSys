// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import ClickOutside from '../index.js';
import {fire} from 'simulant';

type TestComponentMockProps = {
  items?: Array<string | number>,
};
type TestComponentMockState = {
  clickOusideCount: number,
  clickCount: number,
  clickKeys: Array<string>,
};

class TestComponentMock extends React.Component {
  props: TestComponentMockProps;
  state: TestComponentMockState;

  constructor(props: TestComponentMockProps) {
    super(props);
    this.state = {clickOusideCount: 0, clickCount: 0, clickKeys: []};
  }

  handleClickOutside = () => {
    this.setState((prevState, props) => ({clickOusideCount: prevState.clickOusideCount + 1}));
  };

  handleClick = (key: any) => (ev: SyntheticEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState((prevState, props) => ({
      clickCount: prevState.clickCount + 1,
      clickKeys: [...prevState.clickKeys, key],
    }));
  };

  render() {
    const {items} = this.props;
    const itemRender = (it, i) =>
      <li key={i} id={'item_' + i} onClick={this.handleClick(i)}>
        {1}.&nbsp;{it}
      </li>;

    return (
      <ul id="myList">
        {items && items.length ? items.map(itemRender) : <span>'Empty List'</span>}
      </ul>
    );
  }
}

class SimpleWrap extends Component {
  render() {
    return (
      <div id="rootDiv">
        {this.props.children}
      </div>
    );
  }
}

describe('ClickOutside', () => {
  it('handles clicks', () => {
    const WrappedComponent = ClickOutside(TestComponentMock);

    const root = document.createElement('div');
    document.body.appendChild(root);

    const instance = ReactDOM.render(
      <SimpleWrap>
        <WrappedComponent items={['Test item 1', 12, 'Test item 2']} />
        <div id="outerDiv">XXX</div>
      </SimpleWrap>,
      root
    );

    const compInst = TestUtils.findRenderedComponentWithType(instance, TestComponentMock);

    fire(document.body.querySelector('#outerDiv'), 'mousedown');
    fire(document.body.querySelector('#outerDiv'), 'mouseup');

    fire(document.body.querySelector('#item_1'), 'click');
    fire(document.body.querySelector('#item_2'), 'click');
    fire(document.body.querySelector('#item_0'), 'click');
    fire(document.body.querySelector('#myList'), 'click');

    fire(document.body.querySelector('#item_1'), 'mousedown');
    fire(document.body.querySelector('#item_2'), 'mousedown');
    fire(document.body.querySelector('#item_0'), 'mousedown');
    fire(document.body.querySelector('#myList'), 'mousedown');

    fire(document.body.querySelector('#rootDiv'), 'click');
    fire(document.querySelector('body'), 'click');

    fire(document.body.querySelector('#rootDiv'), 'mousedown');
    fire(document.querySelector('body'), 'mousedown');

    expect(compInst.state.clickOusideCount).toBe(1);
    expect(compInst.state.clickCount).toBe(3);
    expect(compInst.state.clickKeys).toEqual([1, 2, 0]);

    document.body.innerHTML = '';
  });

  it('handles multiple clicks', () => {
    const WrappedComponent = ClickOutside(TestComponentMock, true);

    const root = document.createElement('div');
    document.body.appendChild(root);

    const instance = ReactDOM.render(
      <SimpleWrap>
        <WrappedComponent items={['Test item 1', 12, 'Test item 2']} />
        <div id="outerDiv">XXX</div>
      </SimpleWrap>,
      root
    );

    const compInst = TestUtils.findRenderedComponentWithType(instance, TestComponentMock);

    fire(document.body.querySelector('#outerDiv'), 'mousedown');
    fire(document.body.querySelector('#outerDiv'), 'mouseup');

    fire(document.body.querySelector('#item_1'), 'click');
    fire(document.body.querySelector('#item_2'), 'click');
    fire(document.body.querySelector('#item_0'), 'click');
    fire(document.body.querySelector('#myList'), 'click');

    fire(document.body.querySelector('#item_1'), 'mousedown');
    fire(document.body.querySelector('#item_2'), 'mousedown');
    fire(document.body.querySelector('#item_0'), 'mousedown');
    fire(document.body.querySelector('#myList'), 'mousedown');

    fire(document.body.querySelector('#rootDiv'), 'click');
    fire(document.querySelector('body'), 'click');

    fire(document.body.querySelector('#rootDiv'), 'mousedown');
    fire(document.querySelector('body'), 'mousedown');
    fire(document.body.querySelector('#outerDiv'), 'mousedown');

    expect(compInst.state.clickOusideCount).toBe(4);
    expect(compInst.state.clickCount).toBe(3);
    expect(compInst.state.clickKeys).toEqual([1, 2, 0]);

    document.body.innerHTML = '';
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import {NotConnectedRiskAssWidget as RiskAssessmentWidget} from './index';
import * as stdLib from '../../stdLib';
import {mount, render} from 'enzyme';
import toJson from 'enzyme-to-json';

import {stdDashboardProps} from '../dashboard-fixtures';
import {fire} from 'simulant';

describe('<RiskAssessmentWidget1 />', () => {
  const datatable = {
    result: {
      chart: {
        data: [
          {x: 'EMEA OnPremise', y: [16111597.97, 40358151.34, 12900823.79, 11898107.16]},
          {x: 'US East SaaS', y: [7841718.02, 11679528.27, 1264551.55, 12834213.17]},
          {x: 'EMEA SaaS', y: [9598742.43, 5781346.23, 1039881.72, 4815503.56]},
          {x: 'US OnPremise', y: [3660034.88, 2253774.77, 2160655.1, 8427756.06]},
          {x: 'Asia Private Cloud', y: [1703536.47, 1128769.02, 6475414.83, 2257987.36]},
          {x: 'US Private Cloud', y: [4846567.58, 7037438.81, 0, 2067997.61]},
          {x: 'US West SaaS', y: [14078233.23, 783284.55, 275379.63, 6482574.68]},
        ],
      },

      table: {
        data: [
          {accountName: 'At Lacus Foundation', value: 7390381.86},
          {accountName: 'Velit In Aliquet Institute', value: 3350955.64},
          {accountName: 'Lectus Rutrum Limited', value: 1916834.35},
          {accountName: 'Convallis Incorporated', value: 1859014.34},
          {accountName: 'Arcu Ac Orci Incorporated', value: 1809226.03},
        ],
      },
    },
  };

  const dtDefinition = {
    props: {
      tableName: 'riskAss',
      type: 'risk',
      metrics: {
        responseid: 's1.responseid',
        status: 's1.status',
        noOfEmailsSent: 's1.NoOfEmailsSent',
        nps: 'b2s1.Q1',
        respondent: 's2.respondent',
        accountName: 's2.accountName',
        renew: 's3.health',
        navigationAccountName: 'accountName', //should be an alias without DS
      },
    },
  };
  const riskFilters = {
    riskSegmentFilter: null,
    timeFilter: null,
    riskSegmentFilterTitle: null,
  };

  let oldSendMessage;
  beforeAll(() => {
    oldSendMessage = stdLib.sendMessage;
    stdLib.sendMessage = jest.fn();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    stdLib.sendMessage = oldSendMessage;
  });

  beforeEach(() => {
    stdLib.sendMessage.mockClear();
  });

  describe('Smoke tests', () => {
    test('Risk Assessment widget renders correctly', () => {
      const component = mount(
        <RiskAssessmentWidget
          datatable={datatable}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={stdDashboardProps.settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      expect(toJson(component)).toMatchSnapshot();
    });
  });

  test('Renders data', () => {
    const wrapper = mount(
      <RiskAssessmentWidget
        datatable={datatable}
        config={stdDashboardProps.config}
        stdLib={stdLib}
        settings={stdDashboardProps.settings}
        datatableDefinition={dtDefinition}
        riskFilters={riskFilters}
      />
    );

    expect(wrapper.find('.r2-table2__cell--left').length).toBe(datatable.result.table.data.length);
    expect(wrapper.find('.r2-table2__cell--left').first().text()).toBe('At Lacus Foundation');
    expect(wrapper.find('.r2-table2__cell--left').last().text()).toBe('Arcu Ac Orci Incorporated');
  });

  describe('Widget frame tests', () => {
    test('Sets size and caption', () => {
      const settings = Object.assign({}, stdDashboardProps.settings, {label: 'Test label', size: 'medium'});

      const wrapper = render(
        <RiskAssessmentWidget
          datatable={datatable}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      expect(wrapper.find('article').first().hasClass('dashboard__widget--medium')).toBeTruthy();
      expect(wrapper.find('.widget__title').first().text()).toBe(settings.label);
    });

    test('Shows progress', () => {
      const dt = Object.assign({}, datatable, {isFetching: true});
      const wrapper = mount(
        <RiskAssessmentWidget
          datatable={dt}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={stdDashboardProps.settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      jest.runTimersToTime(1000);

      expect(wrapper.find('.r2-spinner-pane--shading').length).toBe(1);
    });

    test('Does not show progress prematurely', () => {
      const dt = Object.assign({}, datatable, {isFetching: true});
      const wrapper = mount(
        <RiskAssessmentWidget
          datatable={dt}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={stdDashboardProps.settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      jest.runTimersToTime(100);

      expect(wrapper.find('.r2-spinner-pane--shading').length).toBe(0);
    });

    test('Shows error', () => {
      const dt = Object.assign({}, datatable, {error: {message: 'Some error msg'}});
      const wrapper = mount(
        <RiskAssessmentWidget
          datatable={dt}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={stdDashboardProps.settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      expect(wrapper.find('.r2-widget-errmsg__txt').text()).toBe(dt.error.message);
    });

    test('Hides  error', () => {
      const dt = Object.assign({}, datatable, {error: {message: 'Some error msg'}});
      const wrapper = mount(
        <RiskAssessmentWidget
          datatable={dt}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={stdDashboardProps.settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      expect(wrapper.find('.r2-widget-errmsg__txt').text()).toBe(dt.error.message);
      jest.runTimersToTime(20000);
      expect(wrapper.find('.r2-widget-errmsg__txt').length).toBe(0);
    });
  });

  describe('Functional tests', () => {
    describe('Native tests', () => {
      afterEach(() => {
        document.body.innerHTML = '';
      });

      test('Native: Handles breakdownBy.title and statistic.title', () => {
        const settings = Object.assign({}, stdDashboardProps.settings, {
          'statistic.title': 'yAxis',
          'breakdownBy.title': 'xAxis',
        });

        const root = document.createElement('div');
        root.setAttribute('id', 'testRoot');
        document.body.appendChild(root);

        ReactDOM.render(
          <RiskAssessmentWidget
            datatable={datatable}
            config={stdDashboardProps.config}
            stdLib={stdLib}
            settings={settings}
            datatableDefinition={dtDefinition}
            riskFilters={riskFilters}
          />,
          root
        );

        const items = document.body.querySelectorAll('.r2-chart3__axis-name');
        expect(items.length).toBe(2);
        expect(items.item(0).innerHTML).toBe('xAxis');
        expect(items.item(1).innerHTML).toBe('yAxis');
      });


      test('Native: Handles full filtering', () => {
        const wrapper = mount(
          <RiskAssessmentWidget
            datatable={datatable}
            config={stdDashboardProps.config}
            stdLib={stdLib}
            settings={stdDashboardProps.settings}
            datatableDefinition={dtDefinition}
            riskFilters={riskFilters}
          />
        );
        const item = wrapper.find('#riskR0_1');
        expect(item).toBeDefined();
        item.simulate('click');

        expect(stdLib.sendMessage).toHaveBeenCalled();

        expect(stdLib.sendMessage.mock.calls[0][0][0]).toHaveProperty('value', 'medium');
        expect(stdLib.sendMessage.mock.calls[0][0][1]).toHaveProperty('value', 'EMEA OnPremise');
        expect(stdLib.sendMessage.mock.calls[0][0][2]).toHaveProperty('value', '0');
      });

      test('Native: Shows Reset button and clears the selection', () => {
        const filters = Object.assign({}, riskFilters, {timeFilter: '0'});

        const root = document.createElement('div');
        root.setAttribute('id', 'testRoot');
        document.body.appendChild(root);

        const instance = ReactDOM.render(
          <RiskAssessmentWidget
            datatable={datatable}
            config={stdDashboardProps.config}
            stdLib={stdLib}
            settings={stdDashboardProps.settings}
            datatableDefinition={dtDefinition}
            riskFilters={filters}
          />,
          root
        );

        const item = document.body.querySelector('#riskR0_1');
        expect(item).toBeDefined();
        fire(item, 'click');

        expect(stdLib.sendMessage).toHaveBeenCalled();

        //fixme: This part is not working - itemReset is null.
        const itemReset = document.body.querySelector('.filter__btn--reset .r2-icon');
        expect(itemReset).toBeDefined();

        stdLib.sendMessage.mockClear();
        fire(itemReset, 'click');
        expect(stdLib.sendMessage).toHaveBeenCalled();
        expect(stdLib.sendMessage.mock.calls[0][0][0]).toHaveProperty('value', null);
      });
    }); //end native

    test('Filters data by risk level on menu click', () => {
      let wrapper = mount(
        <RiskAssessmentWidget
          datatable={datatable}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={stdDashboardProps.settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      wrapper.find('.r2-table2__cell-header__container').first().simulate('click');
      const menItem = wrapper.find('.r2-menu-list__text').at(2);
      menItem.simulate('click');

      expect(stdLib.sendMessage).toHaveBeenCalled();
      expect(stdLib.sendMessage.mock.calls[0][0][0]).toHaveProperty('value', 'safe');
    });

    test('Adds Navigation on undefined detailNav', () => {
      let settings = Object.assign({}, stdDashboardProps.settings, {detailNav: 'Detail Page'});

      let wrapper = mount(
        <RiskAssessmentWidget
          datatable={datatable}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      expect(wrapper.find('.r2-table2__cell--left').first().hasClass('r2-table2__cell--navigable')).toBeTruthy();
    });

    test('Does not add Navigation on undefined detailNav', () => {
      let wrapper = render(
        <RiskAssessmentWidget
          datatable={datatable}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={stdDashboardProps.settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      expect(wrapper.find('.r2-table2__cell--left').first().hasClass('r2-table2__cell--navigable')).toBeFalsy();
    });

    test('Navigates properly on click', () => {
      let settings = Object.assign({}, stdDashboardProps.settings, {detailNav: 'Detail Page'});

      let wrapper = mount(
        <RiskAssessmentWidget
          datatable={datatable}
          config={stdDashboardProps.config}
          stdLib={stdLib}
          settings={settings}
          datatableDefinition={dtDefinition}
          riskFilters={riskFilters}
        />
      );

      const item = wrapper.find('.r2-table2__cell--left').first();
      item.simulate('click');

      expect(stdLib.sendMessage).toHaveBeenCalled();
      expect(stdLib.sendMessage.mock.calls[0][0][0].type).toBe('navigate');
      expect(stdLib.sendMessage.mock.calls[0][0][0].params).toHaveProperty('accountName', item.text());
    });
  });
});

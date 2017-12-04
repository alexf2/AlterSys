//@flow
import React, {Component} from 'react';
import {formatterFactory, capitalize} from 'conf-r2-utilities';
import {SimpleMenu, SortingArrow, FixedPositionContainer} from 'conf-r2-components';
import {ArrowDropdownIcon, iconModifiers} from 'conf-r2-icons';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import type {RiskSegment, RiskAssessmentConfig, RiskData, RiskChartData} from './riskAssessmentTypes.js';
import {rwdFields} from './riskConstants';
import {ConsoleUtil} from 'conf-r2-utilities';

import './css/table.scss';

const {size: {size10px}} = iconModifiers;

type RiskTableProps = {
  table?: RiskData,
  chart?: RiskChartData,
  viewConfiguration: RiskAssessmentConfig,
  sendMessage: (messages: [Object]) => void,
};
type RiskTableState = {
  isMenuVisible: boolean,
};

class RiskTable extends Component {
  props: RiskTableProps;
  state: RiskTableState;

  constructor(props: RiskTableProps) {
    super(props);
    this.state = {
      isMenuVisible: false,
    };
  }

  showMenu = () => {
    if (!this.state.isMenuVisible) this.setState({isMenuVisible: true});
  };

  selectMenuItem = (riskSegmentName: RiskSegment) => {
    const {viewConfiguration: {riskSegmentFilter}} = this.props;

    if (riskSegmentFilter !== riskSegmentName) {
      //menu item picked
      if (riskSegmentName)
        //requesting risk segment filtering
        this.props.sendMessage([{name: rwdFields.riskSegmentFilter, value: riskSegmentName}]);
    }

    this.setState({isMenuVisible: false});
  };

  selectAccount = (accountName: string) => (ev: SyntheticEvent) => {
    if (!this.isAccountSelectable) return;
    const {viewConfiguration: {detailNav, accountNameQuestion}} = this.props;

    ev.stopPropagation();
    ev.preventDefault();

    const messages = [
      {
        type: 'navigate',
        page: detailNav,
        params: {[accountNameQuestion]: accountName},
      },
    ];

    this.props.sendMessage(messages);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !!nextProps.table &&
      (nextProps.table !== this.props.table ||
        !isEqual(nextProps.viewConfiguration, this.props.viewConfiguration) ||
        nextState !== this.props.state)
    );
  }

  static riskFilterData: Array<SimpleMenuItem> = [
    {key: 'high', name: 'High Risk Accounts'},
    {key: 'medium', name: 'Medium Risk Accounts'},
    {key: 'safe', name: 'Safe Risk Accounts'},
    {key: 'unknown', name: 'Unknown Risk Accounts'},
  ];

  static riskLevelToDisplay(riskLevel: RiskSegment) {
    const level = RiskTable.riskFilterData.find(elem => elem.key === riskLevel);
    if (!level) {
      ConsoleUtil.logErr(`Risk level "${riskLevel}" is not found`);
      return 'error';
    }
    return level.name;
  }

  get isAccountSelectable(): boolean {
    const {viewConfiguration: {detailNav}} = this.props;

    return !!detailNav;
  }

  //Fixed headers
  //http://stackoverflow.com/questions/11891065/css-only-scrollable-table-with-fixed-headers
  render() {
    const {table, viewConfiguration} = this.props;
    const {riskSegmentFilter, metricSorting, statistic, riskSegmentFilterTitle, tableFormatter} = viewConfiguration;
    const emptyDataResult = (
      <div>
        &nbsp;No accounts returned{riskSegmentFilterTitle ? ': ' + riskSegmentFilterTitle : ''}
      </div>
    );

    const accountCellStyles = classNames({
      'r2-table2__cell': true,
      'r2-table2__cell--left': true,
      'r2-table2__cell--navigable': this.isAccountSelectable,
    });

    const metricHeadStyles = classNames({
      'r2-table2__cell-header': true,
      'r2-table2__cell-header--clickable': false,
      'r2-table2__cell-header--right': true,
    });

    if (!table || table.data.length === 0) return emptyDataResult;

    const formatNumber = formatterFactory(tableFormatter);
    const arrow = <SortingArrow ascending={metricSorting === 'asc'} size={size10px} />;
    const metricCaption = capitalize(statistic.title, true);
    const riskCaption =
      RiskTable.riskLevelToDisplay(riskSegmentFilter) + (riskSegmentFilterTitle ? ' ' + riskSegmentFilterTitle : '');

    const row = (item, i) =>
      <tr key={i} className="r2-table2__row">
        <td className={accountCellStyles} onClick={this.selectAccount(item.accountName)}>
          {item.accountName}
        </td>
        <td className="r2-table2__cell r2-table2__cell--right">
          {formatNumber(item.value)}
        </td>
      </tr>;

    return (
      <div className="table-view">
        <table className="r2-table2">
          <thead>
            <tr className="r2-table2__row">
              <th
                className="r2-table2__cell-header r2-table2__cell-header--clickable r2-table2__cell-header--left"
                onClick={this.showMenu}>
                <span ref={el => (this._elAccountHdr = el)} className="r2-table2__cell-header__container">
                  <span className="r2-table2__cell-header__caption" title={riskCaption}>
                    {riskCaption}
                  </span>

                  <ArrowDropdownIcon
                    className="r2-table2__icon--arrow-dropdown"
                    iconId="DropdownIconRevenueRiskAssessment"
                    iconTitle="Open risk level filter menu"
                    size={size10px}
                  />
                </span>
              </th>
              <th className={metricHeadStyles}>
                <span>
                  {arrow}&nbsp;{metricCaption}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {table.data.map(row)}
          </tbody>
        </table>

        {this.state.isMenuVisible &&
          <FixedPositionContainer elementSelector={this._elAccountHdr} shiftX={-10} shiftY={-5} anchor="RightTop">
            <SimpleMenu data={RiskTable.riskFilterData} action={this.selectMenuItem} />
          </FixedPositionContainer>}
      </div>
    );
  }
}

export default RiskTable;

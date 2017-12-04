// @flow

import React from 'react';
import RiskAssessmentWidget from './RiskAssessmentWidget';
import type {RiskAssessmentDashboardProps} from './riskAssessmentTypes.js';
import {connect} from 'react-redux';
import {selectors} from '../../../common/redux';
import deriveRiskAssessmentConfig from './riskAssessmentConfiguration.js';
import {rwdFields} from './riskConstants';

/**
 * This component is a configurator.
 * Pulls only needed data from 'props', passed in by the dashboard connector.
 * Also, pulls come data from Redux state.
 */
const RiskAssessmentWidgetConfigurator = (props: RiskAssessmentDashboardProps) => {
  const {
    settings = {} /*comes from widget*/,
    datatableDefinition = {} /*comes from the table, referenced in the widget*/,
    riskFilters = {},
    datatable,
    stdLib,
    config = {},
    id,
  } = props;

  const {label = 'Revenue R. Ass.', size} = settings;

  const tag = datatableDefinition.props && datatableDefinition.props.tag;

  const widgetSettings = {
    label,
    size,
    viewConfiguration: deriveRiskAssessmentConfig(
      datatableDefinition.props || {},
      riskFilters,
      settings || {},
      config || {},
      stdLib
    ),
  };

  return <RiskAssessmentWidget id={id} config={widgetSettings} tag={tag} datatable={datatable} stdLib={stdLib} />;
};

const mapStateToProps = (state, ownProps) => {
  const {settings: {datatableId}} = ownProps;

  const mapper = {
    riskFilters: {
      riskSegmentFilter: selectors.getDatatableFilterValue(state, datatableId, rwdFields.riskSegmentFilter),
      timeFilter: selectors.getDatatableFilterValue(state, datatableId, rwdFields.timeFilter),
      riskSegmentFilterTitle: selectors.getDatatableFilterValue(state, datatableId, rwdFields.riskSegmentFilterTitle),
    },
  };
  return mapper;
};

export default connect(mapStateToProps)(RiskAssessmentWidgetConfigurator);

//for testing
export {RiskAssessmentWidgetConfigurator as NotConnectedRiskAssWidget};

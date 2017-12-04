// @flow
import {handleActions} from '../utils';
import types from './action-types';
import type {ReportListState} from '../../../types';

const initialState: ReportListState = {
  reports: [],
  error: null,
  searchTerm: '',
  skip: 0,
  take: 20,
  totalAmount: 0,
  next: false,
  previous: false,
  isFetching: false,
  reportToDelete: null,
};

const reportListReducer = handleActions(
  {
    [types.ReportList.loadReports]: (state: ReportListState) => {
      return {...state, isFetching: true};
    },

    [types.ReportList.createReport]: (state: ReportListState) => {
      return {...state, isFetching: true};
    },

    [types.ReportList.nextPage]: (state: ReportListState) => {
      return {...state, skip: state.take + state.skip};
    },

    [types.ReportList.previousPage]: (state: ReportListState) => {
      if (state.skip <= state.take) {
        return {...state, skip: 0};
      }
      return {...state, skip: state.skip - state.take};
    },

    [types.ReportList.createReportSuccess]: (state: ReportListState, action) => {
      const {report} = action;
      return {...state, reports: [...state.reports, report], isFetching: false};
    },

    [types.ReportList.loadReportsSuccess]: (state: ReportListState, action) => {
      const {reports, next, previous, totalAmount} = action;
      return {...state, reports, next: !!!next, previous: !!!previous, isFetching: false, totalAmount};
    },

    [types.ReportList.reloadReports]: (state: ReportListState) => {
      return {...state, skip: 0, take: 20};
    },

    [types.ReportList.openDeleteReportDialog]: (state: ReportListState, action) => {
      return {
        ...state,
        reportToDelete: action.reportId,
      };
    },

    [types.ReportList.closeDeleteReportDialog]: (state: ReportListState) => {
      return {
        ...state,
        reportToDelete: null,
      };
    },

    [types.ReportList.deleteReportSuccess]: (state: ReportListState, action) => {
      const {reportId} = action;

      let reportIndex = state.reports.findIndex(report => report.id === reportId);

      return {
        ...state,
        reports: [...state.reports.slice(0, reportIndex), ...state.reports.slice(reportIndex + 1)],
        isFetching: false,
      };
    },

    [types.ReportList.resetPaging]: (state: ReportListState) => {
      return {...state, skip: 0};
    },

    [types.ReportList.loadReportsFailure]: (state: ReportListState, action) => {
      const {error} = action;
      return {...state, error, isFetching: false};
    },
    [types.ReportList.deleteReportFailure]: (state: ReportListState, action) => {
      const {error} = action;
      return {...state, error, isFetching: false};
    },
    [types.ReportList.createReportFailure]: (state: ReportListState, action) => {
      const {error} = action;
      return {...state, error, isFetching: false};
    },

    [types.ReportList.updateSearchTerm]: (state: ReportListState, action) => {
      const {term} = action;
      return {...state, searchTerm: term, isFetching: true};
    },
  },
  initialState
);

export {initialState, reportListReducer as default};

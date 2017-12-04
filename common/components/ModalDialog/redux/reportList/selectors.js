// @flow
import type {ReportListState} from '../../../types';

export const getReportsList = (state: ReportListState) => state.reports;

export const getError = (state: ReportListState) => state.error;

export const getSearchTerm = (state: ReportListState) => state.searchTerm;

export const getSkip = (state: ReportListState) => state.skip;

export const getTake = (state: ReportListState) => state.take;

export const getHasNext = (state: ReportListState) => state.next;

export const getHasPrevious = (state: ReportListState) => state.previous;

export const isFetching = (state: ReportListState) => state.isFetching;

export const getTotalAmount = (state: ReportListState) => state.totalAmount;

export const getReportToDelete = (state: ReportListState) => state.reportToDelete;

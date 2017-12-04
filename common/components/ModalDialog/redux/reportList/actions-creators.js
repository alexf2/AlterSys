// @flow
import types from './action-types';

export const resetPaging = () => ({
  type: types.ReportList.resetPaging,
});

export const nextPage = () => ({
  type: types.ReportList.nextPage,
});

export const previousPage = () => ({
  type: types.ReportList.previousPage,
});

export const reloadReports = () => ({
  type: types.ReportList.reloadReports,
});

export const loadReports = () => ({
  type: types.ReportList.loadReports,
});

export const loadReportsSuccess = (reportList: Object) => ({
  type: types.ReportList.loadReportsSuccess,
  reports: reportList.items,
  next: reportList.links.nextPage,
  previous: reportList.links.previousPage,
  totalAmount: reportList.totalAmount,
});

export const loadReportsFailure = (error: Object) => ({
  type: types.ReportList.loadReportsFailure,
  error,
});

export const createReport = (name: string) => ({
  type: types.ReportList.createReport,
  name,
});

export const createReportSuccess = (report: Object) => ({
  type: types.ReportList.createReportSuccess,
  report,
});
export const createReportFailure = (error: Object) => ({
  type: types.ReportList.createReportFailure,
  error,
});

export const openDeleteReportDialog = (reportId: number) => ({
  type: types.ReportList.openDeleteReportDialog,
  reportId,
});

export const closeDeleteReportDialog = (reportId: number) => ({
  type: types.ReportList.closeDeleteReportDialog,
});

export const deleteReport = (reportId: number) => ({
  type: types.ReportList.deleteReport,
  reportId,
});

export const deleteReportSuccess = (reportId: number) => ({
  type: types.ReportList.deleteReportSuccess,
  reportId,
});

export const deleteReportFailure = (error: Object) => ({
  type: types.ReportList.deleteReportFailure,
  error,
});

export const updateSearchTerm = (term: string) => ({
  type: types.ReportList.updateSearchTerm,
  term,
});

import {takeEvery, delay} from 'redux-saga';
import {call, put, select, take, cancel, fork} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import types from './action-types';
import {
  loadReports,
  loadReportsSuccess,
  loadReportsFailure,
  createReportSuccess,
  createReportFailure,
  deleteReportSuccess,
  deleteReportFailure,
  resetPaging,
} from './actions-creators';
import {selectors} from '../index';
import {createDashboard, deleteDashboard, getAvailableDashboards} from '../../services/dashboardService';

function* getReportList() {
  // sort, skip, take, nameContains
  const skip = yield select(selectors.getReportListSkip);
  let take = yield select(selectors.getReportListTake);
  const searchTerm = yield select(selectors.getReportSearchTerm);

  try {
    const reportList = yield call(getAvailableDashboards, 'asc', skip, take, searchTerm);
    yield put(loadReportsSuccess(reportList));
  } catch (e) {
    yield put(loadReportsFailure(e));
  }
}

function* createReport(action) {
  const {name} = action;
  const report = {name, sourceCode: `title "${name}"`};
  try {
    const createdReport = yield call(createDashboard, report);
    yield put(createReportSuccess(createdReport));
    yield put(push(`/editor/${createdReport.id}`));
  } catch (e) {
    yield put(createReportFailure(e));
  }
}

function* deleteReport(action) {
  const {reportId} = action;
  try {
    yield call(deleteDashboard, reportId);
    yield put(deleteReportSuccess(reportId));
  } catch (e) {
    yield put(deleteReportFailure(e));
  }
}

function* updateSearch() {
  yield call(delay, 500);
  yield put(resetPaging());
  yield put(loadReports());
}

function* updateSearchSaga() {
  let task;
  while (true) {
    yield take(types.ReportList.updateSearchTerm);
    if (task) {
      yield cancel(task);
    }
    task = yield fork(updateSearch);
  }
}

function* loadReportListSaga() {
  yield takeEvery(types.ReportList.loadReports, getReportList);
}

function* createReportSaga() {
  yield takeEvery(types.ReportList.createReport, createReport);
}

function* deleteReportSaga() {
  yield takeEvery(types.ReportList.deleteReport, deleteReport);
}

export default function* reportListSaga() {
  yield [loadReportListSaga(), createReportSaga(), deleteReportSaga(), updateSearchSaga()];
}

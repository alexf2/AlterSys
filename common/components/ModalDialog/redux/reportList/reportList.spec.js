// @flow
import deepFreeze from 'deep-freeze-strict';
import reducer, {initialState} from './reducer';
import {
  loadReportsSuccess,
  loadReportsFailure,
  createReportFailure,
  createReportSuccess,
  deleteReportFailure,
  updateSearchTerm,
  deleteReportSuccess,
  reloadReports,
  nextPage,
  previousPage,
  openDeleteReportDialog,
  closeDeleteReportDialog,
} from './actions-creators';
import {getReportsList, getError, getSearchTerm, getSkip, getTake, getReportToDelete} from './selectors';

describe('Report List redux store', () => {
  let state;

  beforeEach(() => {
    state = reducer(undefined, {type: '@@INIT'});
    deepFreeze(state);
  });

  it('Has initial state', () => {
    expect(state).toEqual(initialState);
  });

  it('Stores reports when loaded', () => {
    const state2 = reducer(
      state,
      loadReportsSuccess({
        items: [{name: 'report1'}, {name: 'report2'}],
        links: {
          nextPage: 'yes',
          previousPage: undefined,
        },
      })
    );
    deepFreeze(state2);
    expect(getReportsList(state2)).toEqual([{name: 'report1'}, {name: 'report2'}]);
  });

  it('Stores report when created', () => {
    const state2 = reducer(
      state,
      loadReportsSuccess({
        items: [{name: 'report1'}, {name: 'report2'}],
        links: {
          nextPage: 'yes',
          previousPage: undefined,
        },
      })
    );
    deepFreeze(state2);
    const state3 = reducer(state2, createReportSuccess({name: 'report3'}));
    deepFreeze(state3);
    expect(getReportsList(state3)).toEqual([{name: 'report1'}, {name: 'report2'}, {name: 'report3'}]);
  });

  it('Stores error when load report fails', () => {
    const state2 = reducer(state, loadReportsFailure({error: 'Error'}));
    deepFreeze(state2);
    expect(getError(state2)).toEqual({error: 'Error'});
  });
  it('Stores error when create report fails', () => {
    const state2 = reducer(state, createReportFailure({error: 'Error'}));
    deepFreeze(state2);
    expect(getError(state2)).toEqual({error: 'Error'});
  });
  it('Stores error when delete report fails', () => {
    const state2 = reducer(state, deleteReportFailure({error: 'Error'}));
    deepFreeze(state2);
    expect(getError(state2)).toEqual({error: 'Error'});
  });

  it('Can update search term', () => {
    const state2 = reducer(state, updateSearchTerm('term'));
    deepFreeze(state2);
    expect(getSearchTerm(state2)).toEqual('term');
    const state3 = reducer(state2, updateSearchTerm('term2'));
    deepFreeze(state3);
    expect(getSearchTerm(state3)).toEqual('term2');
  });

  it('Can remove a report from the list', () => {
    const state2 = reducer(
      state,
      loadReportsSuccess({
        items: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
        links: {
          nextPage: 'yes',
          previousPage: undefined,
        },
      })
    );
    deepFreeze(state2);
    const state3 = reducer(state2, deleteReportSuccess(3));
    deepFreeze(state3);
    expect(getReportsList(state3)).toEqual([{id: 1}, {id: 2}, {id: 4}, {id: 5}]);
  });

  it('Reload reports resets skip and take', () => {
    const state2 = reducer(
      state,
      loadReportsSuccess({
        items: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
        links: {
          nextPage: 'yes',
          previousPage: undefined,
        },
      })
    );
    deepFreeze(state2);
    const state3 = reducer(state2, reloadReports());
    let take = getTake(state3);
    let skip = getSkip(state3);
    expect(take).toEqual(20);
    expect(skip).toEqual(0);
  });

  it('Next page updates skip', () => {
    let take = getTake(state);
    const state2 = reducer(state, nextPage());
    deepFreeze(state2);
    let skip = getSkip(state2);
    expect(skip).toEqual(0 + take);
    const state3 = reducer(state2, nextPage());
    deepFreeze(state3);
    skip = getSkip(state3);
    expect(skip).toEqual(20 + take);
  });

  it('Previous page updates skip', () => {
    const state2 = reducer(state, nextPage());
    deepFreeze(state2);
    let skip = getSkip(state2);
    expect(skip).toEqual(20);

    const state3 = reducer(state2, nextPage());
    deepFreeze(state3);
    skip = getSkip(state3);
    expect(skip).toEqual(40);

    const state4 = reducer(state3, previousPage());
    deepFreeze(state4);
    skip = getSkip(state4);
    expect(skip).toEqual(20);

    const state5 = reducer(state4, previousPage());
    deepFreeze(state5);
    skip = getSkip(state5);
    expect(skip).toEqual(0);

    const state6 = reducer(state5, previousPage());
    deepFreeze(state6);
    skip = getSkip(state6);
    expect(skip).toEqual(0);
  });

  it('Sets report to delete', () => {
    const state2 = reducer(state, openDeleteReportDialog(5));
    deepFreeze(state2);
    expect(getReportToDelete(state2)).toEqual(5);
  });

  it('Removes report to delete', () => {
    const state2 = reducer(state, openDeleteReportDialog(5));
    deepFreeze(state2);
    const state3 = reducer(state2, closeDeleteReportDialog());
    expect(getReportToDelete(state3)).toBeNull();
  });
});

// @flow
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {CloseIcon} from 'conf-r2-icons';
import {ModalDialog} from './../common/components/ModalDialog';
import {createReport} from '../common/redux/reportList/actions-creators';

type Props = {
  open: boolean,
  closeDialog: () => void,
  createReport: () => void,
};

type State = {
  name: string,
  enteredReportName: false,
};

export class CreateReportDialog extends React.Component {
  state: State;
  props: Props;
  textField = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  handleNameChanged = (event: {target: {value: string}}) => {
    event.preventDefault();
    this.setState({name: event.target.value});
    this.setState({enteredReportName: true});
  };

  handleClearName = () => {
    this.setState({name: ''});
    this.setState({enteredReportName: false});
  };

  handleCreateReport = () => {
    if (this.state.name === '') return;
    this.setState({name: ''});
    this.props.createReport(this.state.name);
    this.props.closeDialog();
  };

  handleCLoseDialog = () => {
    this.setState({name: ''});
    this.props.closeDialog();
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleCreateReport();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      this.handleCLoseDialog();
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.open === true && this.props.open === false) {
      // the dialog fades in, need to wait to set focus until the animation is done
      setTimeout(() => this.textField.focus(), 200);
    }
  }

  render() {
    const {open} = this.props;
    const {enteredReportName} = this.state;

    return (
      <ModalDialog open={open} onClose={this.handleCLoseDialog} largeDialog={false}>
        <ModalDialog.Heading>New report</ModalDialog.Heading>
        <ModalDialog.Body>
          <form className="r2-form r2-modal__form">
            <label className="r2-form__label" htmlFor="createNewReport">
              Report name
            </label>
            <input
              className="r2-form__input"
              id="createNewReport"
              data-new-dashboard-name
              value={this.state.name}
              type="text"
              placeholder="New report name"
              ref={i => (this.textField = i)}
              onKeyDown={this.handleKeyPress}
              onChange={this.handleNameChanged}
            />
            {enteredReportName &&
              <button
                className="r2-button r2-button--reset"
                type="reset"
                data-clear-search
                onClick={this.handleClearName}>
                <CloseIcon
                  className="r2-icon--close"
                  iconId="dashboardsSearchClearIcon"
                  iconTitle="Clear new report name"
                />
              </button>}
          </form>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <button className="r2-button r2-button--cancel r2-button--cancel--modal" onClick={this.handleCLoseDialog}>
            Cancel
          </button>
          <button
            className="r2-button r2-button--conf r2-button--conf--modal"
            onClick={this.handleCreateReport}
            data-create-dashboard>
            Create
          </button>
        </ModalDialog.Footer>
      </ModalDialog>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      createReport,
    },
    dispatch
  );
};

// $FlowIgnore
export default connect(undefined, mapDispatchToProps)(CreateReportDialog);

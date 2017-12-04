// @flow
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {CloseIcon} from 'conf-r2-icons';
import './css/modal-dialog.scss';

const childContext = {
  closeModal: PropTypes.func,
};

type ChildContext = {
  closeModal: Function,
};

const Body = (props: {children?: any}) =>
  <div className="r2-modal__body" data-modal-body>
    {props.children}
  </div>;

const Heading = (props: {children?: any}, context: ChildContext) =>
  <div className="r2-modal__heading">
    <h3 className="r2-modal__heading-content">
      {props.children}
    </h3>
    <button className="r2-modal__close-btn" onClick={context.closeModal}>
      <CloseIcon />
    </button>
  </div>;

Heading.contextTypes = childContext;

const Footer = (props: any) =>
  <div className="r2-modal__footer">
    {props.children}
  </div>;

type ModalProps = {
  open: boolean,
  onClose: Function,
  children?: any,
};

export class ModalDialog extends React.Component<*, ModalProps, *> {
  static Heading = Heading;
  static Body = Body;
  static Footer = Footer;
  static childContextTypes = childContext;

  getChildContext = (): ChildContext => ({
    closeModal: this.props.onClose,
  });

  render() {
    const {open, onClose, children, largeDialog} = this.props;

    return (
      <div
        data-modal={open ? 'open' : 'closed'}
        className={cn('r2-modal', {'r2-modal--open': open, 'r2-modal--large': largeDialog})}>
        <div className="r2-modal__overlay" onClick={onClose} />
        <div className="r2-modal__window">
          {children}
        </div>
      </div>
    );
  }
}

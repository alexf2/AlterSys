import React, {Component} from 'react';
import ReactDOM from 'react-dom';

/*eslint react/no-find-dom-node: "off"*/

export default function ClickOutside(WrappedComponent, multiple = false, checkScrollBar = true) {
  const IGNORE_CLASS = 'ignore-react-onclickoutside';

  const isSourceFound = function(source, localNode) {
    if (source === localNode) {
      return true;
    }
    // SVG <use/> elements do not technically reside in the rendered DOM, so
    // they do not have classList directly, but they offer a link to their
    // corresponding element, which can have classList. This extra check is for
    // that case.
    // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
    // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
    if (source.correspondingElement) {
      return source.correspondingElement.classList.contains(IGNORE_CLASS);
    }
    return source.classList.contains(IGNORE_CLASS);
  };

  return class ClickWrapper extends Component {
    componentDidMount() {
      this.enableOnClickOutside();
    }

    componentWillUnmount() {
      this.disableOnClickOutside();
    }

    bindClickHandler = () => evt => {
      evt.stopPropagation();
      let source = evt.target;

      if (!checkScrollBar || evt.target.tagName.toLowerCase() !== 'html') {
        //checks to see if the click is done on the scrollbar
        let found = false;
        // If source=local then this event came from "somewhere"
        // inside and should be ignored. We could handle this with
        // a layered approach, too, but that requires going back to
        // thinking in terms of Dom node nesting, running counter
        // to React's "you shouldn't care about the DOM" philosophy.
        while (source.parentNode) {
          found = isSourceFound(source, ReactDOM.findDOMNode(this));
          if (found) return;
          source = source.parentNode;
        }
        this._wrappedInstance.handleClickOutside(evt);
        if (!multiple) this.disableOnClickOutside();
      }
    };

    /**
     * Can be called to explicitly enable event listening
     * for clicks and touches outside of this element.
     */
    enableOnClickOutside() {
      if (typeof this._wrappedInstance.handleClickOutside !== 'function')
        throw new Error('Component lacks a handleClickOutside(event) function for processing outside click events.');

      this.boundHandler = this.bindClickHandler();

      if (document !== null) {
        document.addEventListener('mousedown', this.boundHandler);
        document.addEventListener('touchstart', this.boundHandler);
      }
    }

    /**
     * Can be called to explicitly disable event listening
     * for clicks and touches outside of this element.
     */
    disableOnClickOutside() {
      if (document !== null) {
        document.removeEventListener('mousedown', this.boundHandler);
        document.removeEventListener('touchstart', this.boundHandler);
      }
    }

    render() {
      return <WrappedComponent ref={comp => (this._wrappedInstance = comp)} {...this.props} />;
    }
  };
}

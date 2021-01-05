import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class OutsideClick extends Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.props.exceptions && ([...event.target.classList].some(el => this.props.exceptions.includes(el)) || ([...event.target.classList].length === 0 && this.props.exceptions.includes(null)))) {
        return;
      }

      this.props.onOutsideClick();
    }
  }

  render() {
    return <span className={this.props.className} ref={this.setWrapperRef}>{this.props.children}</span>;
  }
}

OutsideClick.propTypes = {
  children: PropTypes.element.isRequired,
};

// External Dependencies
import React, { Component } from 'react';
import $ from 'jquery';

// Internal Dependencies
import './style.css';

class ObLayout extends Component {

  static slug = 'wpfnl_ob_layout';

  /**
   * Handle input value change.
   *
   * @param {object} event
   */
  _onChange = (event) => {
    this.props._onChange(this.props.name, event.target.value);
  }

  render() {
    const { fieldDefinition } = this.props;
    let layoutList = Object.keys(fieldDefinition.options).map((item, i) => {
          return (
              <option key={i} value={item}>{fieldDefinition.options[item]}</option>
          )
        }, this);

    return(
      <select value={this.props.value}>
        {layoutList}
      </select>
    );
  }
}

export default ObLayout;

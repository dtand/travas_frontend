import React from "react";

/**
 * CSS Specific
 */
const HEADER_STYLES = {
  color: "white"
}

export default class AlphaField extends React.Component {
  render() {
    return (
      <div className="col-md-4">
        <h3 style={ HEADER_STYLES }>
            {this.props.label} <br/> <span id={this.props.id}>{this.props.text}</span>
        </h3>
      </div>
    );
  }
}


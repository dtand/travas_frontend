import React from "react";

export default class Submit extends React.Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={this.props.onClick}
      >
      {this.props.defaultValue}
      </button>
    );
  }
}

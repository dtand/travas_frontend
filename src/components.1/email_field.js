import React from "react";

export default class EmailField extends React.Component {

  state = {
    email: ""
  };

  change = e => {
    this.props.onChange({ email: e.target.value });
    this.setState({ email: e.target.value })
  };

  render() {
    return (
      <div className="form-group">
        <label htmlFor="emailInput">{this.props.label}</label>
        <input
          className="form-control"
          type={this.props.type}
          aria-describedby="emailHelp"
          placeholder="Enter email"
          value={this.state.email}
          onChange={e => this.change(e)}
          required
        />
      </div>
    );
  }
}

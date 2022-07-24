import React from "react";

export default class UsernameField extends React.Component {
  state = {
    username: ""
  };

  change = e => {
    this.props.onChange({ username: e.target.value });
    this.setState({ username: e.target.value })
  };

  render() {
    return (
      <div className="form-group text-left">
        <label htmlFor="usernameInput">{this.props.label}</label>
        <input
          className="form-control"
          id="usernameInput"
          type={this.props.type}
          placeholder="Enter username"
          value={this.state.username}
          onChange={e => this.change(e)}
          required
        />
      </div>
    );
  }
}

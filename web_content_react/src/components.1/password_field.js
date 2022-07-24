import React from "react";

export default class PasswordField extends React.Component {
  
  state = {
    password: ""
  };

  change = e => {
    this.props.onChange({ password: e.target.value });
    this.setState({ password: e.target.value })
  };

  render() {
    return (
      <div className="form-group">
        <label htmlFor="passwordInput">{ this.props.label }</label>
        <input
          className="form-control"
          type={ this.props.type }
          placeholder="Password"
          value={ this.state.password }
          onChange={ e => this.change(e) }
          required
        />
      </div>
    );
  }
}

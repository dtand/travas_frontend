import React from "react";

const MARGIN_TOP = {
  marginTop: "7px"
}

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
        <div className="row">
          <div className="col-md-1">
            <h1 className="text-secondary text-center"><i className="fa fa-user"/></h1>
          </div>
          <div className="col-md-11">
            <input style={ MARGIN_TOP }
              className="form-control"
              id="usernameInput"
              type={this.props.type}
              placeholder="Enter username"
              value={this.state.username}
              onChange={e => this.change(e)}
              required
            />
          </div>
        </div>
      </div>
    );
  }
}

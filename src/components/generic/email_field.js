import React from "react";

const MARGIN_TOP = {
  marginTop: "7px"
}

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
        <div className="row">
          <div className="col-md-1">
            <h1 className="text-center text-secondary">
              <i className="fa fa-envelope"/>
            </h1>
          </div>
          <div className="col-md-11" style={ MARGIN_TOP }>
            <input
              id="email"
              className="form-control"
              type={this.props.type}
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={this.state.email}
              onChange={e => this.change(e)}
              required
            />
          </div>
        </div>
      </div>
    );
  }
}

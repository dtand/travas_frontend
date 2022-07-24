import React from "react";

const MARGIN_TOP = {
  marginTop: "7px"
}


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
        <div className="row">
          <div className="col-md-1">
            <h1 className={ this.props.classOverride ? this.props.classOverride : "text-center text-secondary" }>
              <i className="fa fa-key"/>
            </h1>
          </div>
          <div className="col-md-11" style={ MARGIN_TOP }>
            <input
              id={ this.props.id }
              className="form-control"
              type={ this.props.type }
              placeholder={ this.props.label }
              value={ this.state.password }
              onChange={ e => this.change(e) }
              required
            />
          </div>
        </div>
      </div>
    );
  }
}

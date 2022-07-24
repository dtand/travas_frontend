import React from "react";
import ChangePasswordForm from "../generic/change_password_form"

/**
 * CSS Specific
 */
const HEADER_STYLES = {
  color: "white"
}

export default class ChangePasswordMain extends React.Component {

  constructor(props){
    super(props);
    this.state={
      verificationKey: undefined
    }
  }

  getJsonFromUrl() {
    var query = window.location.search.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  componentDidMount(){
    const restParams = this.getJsonFromUrl();
    if(!restParams["verificationKey"]){
      //window.location = "login";
      //return;
    }
    else{
      this.setState({
        verificationKey: restParams["verificationKey"]
      });
    }
  }

  render() {
    return (
      <div>
        { this.state.verificationKey &&
        <div className="margin-top-100">
          <br />
          <h1 className="text-white text-center">
            TRAVAS PLATFORM
          </h1>
          <div className="container">
            <h2 className="text-center" style={ HEADER_STYLES }>
              Change Password
            </h2>
            <h5 className="text-center" style={ HEADER_STYLES }>
              <i> Enter new password below </i>
            </h5>
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
          <ChangePasswordForm verificationKey={ this.state.verificationKey }/>
        </div>
        }
      </div>
    );
  }
}

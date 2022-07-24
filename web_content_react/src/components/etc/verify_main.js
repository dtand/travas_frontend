import React from "react";
import ApiController from "../../js/ApiController"
import SessionManager from "../../js/SessionManager"
import Loader from "../generic/loader"

/**
 * CSS Specific
 */
const HEADER_STYLE = {
  color: "white",
  marginTop: window.innerHeight / 2.0
}

/**
 * CSS Specific
 */
const LOADER_STYLE = {
  color: "white",
  marginTop: window.innerHeight / 2.0
}

export default class VerifyMain extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loading:true
    };
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
      window.location = "login";
      return;
    }
    const payload = {
      verificationKey: restParams["verificationKey"]
    }
    const self = this;
    ApiController.doPost(
      "verify_account",
      payload,
      function(response){
        window.location = ApiController.server + "dashboard";
        SessionManager.updateSession(response.sessionToken);
        self.setState({
            loading: false
          });
      },
      {},
      function(){
        window.location = "login";
      }
    )
  }
  
  render() {
    return (
      <div>
        { this.state.loading &&
          <Loader loadingMessage="Verifying Account..." 
                  styleOverride={ LOADER_STYLE }
                  classOverride="text-center"/>
        }
        { !this.state.loading &&
          <h1 style={ HEADER_STYLE } className="text-center">
            Success!
          </h1>
        }
      </div>
    );
  }
}

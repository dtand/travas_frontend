import React from "react";
import SignupArea from "./signup_area";
import LoginTitle from "../login/login_title";
import LoginImages from "../login/login_images"; 
import Constants from "../../js/Constants";

const LEFT_STYLE = {
  backgroundColor: "white",
  height: window.innerHeight
}

const LEFT_MARGINS = {
  marginRight: "50px",
  marginLeft: "50px"
}

const MARGIN_TOP = {
  marginTop: window.innerHeight / 6
}

const MARGIN_TOP_FORM = {
  marginTop: "100px"
}

const HOME_MARGINS = {
  marginTop: "10px",
  marginLeft: "10px"
}

export default class SignupMain2 extends React.Component {
  render() {
    return (
      <div className="overflow-x-hidden">
         <div className="row">
          <div className={ Constants.IS_MOBILE ? "col-md-12" : "col-md-6" } style={ LEFT_STYLE }>
          <h4 className="text-left text-primary" style={ HOME_MARGINS }>
            <a href="../">
              <i className="fa fa-home"/> TRAVAS
            </a>
          </h4>
          <div style={ LEFT_MARGINS }>
              <div style={ MARGIN_TOP }>
                <LoginTitle title={ "SIGNUP" }/>
                <div className="margin-top-50">
                  <h1>The Travas Platform has closed signups. <br/> 
                      Please contact an admin directly regarding <br/> 
                      interest in the platform.
                  </h1>
                </div>
              </div>
            </div>
          </div>
          { !Constants.IS_MOBILE &&
            <div className="tr-background col-md-6">
              <LoginImages/>
            </div>
          }
        </div>    
        
      </div>
    );
  }
}

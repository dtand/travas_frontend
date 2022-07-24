import React from "react";
import AlertTemplate from "react-alert-template-basic";
import LoginForm from "./login_form";
import ApiController from "../../js/ApiController"
import NotificationController from "../../js/NotificationController";

const options = {
  timeout: 3000,
  position: "top center"
};

export default class LoginArea extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      loading: false
    }
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  forgotPassword(){
    const email = document.getElementById("email").value;
    if(email === ""){
      NotificationController.displayNotification(
        "BAD EMAIL",
        "Please input a valid email",
        "error"
      );
      return;
    }
    this.setState({
      loading: true
    });
    const self = this;
    ApiController.doPostWithToken(
      "request_new_password",
      {
        "email": document.getElementById("email").value 
      },
      function(){
        self.setState({
          loading: false
        });
        NotificationController.displayNotification(
          "PASSWORD RESET SENT",
          "Instructions to change your password have been sent to " + email,
          "info"
        );
      },
      undefined,
      () => {
        self.setState({
          loading: false
        });
      }
    );      
  }
  
  render() {
    return (
      <div className="container">
        <LoginForm template={AlertTemplate} {...options}/>
        <br/>
        <div className="text-center text-secondary">
            DON'T HAVE AN ACCOUNT? <a className="text-center" href="signup"> SIGNUP </a> 
            <br/>
            FORGOT YOUR PASSWORD? <a className="text-center" href="#" onClick={ this.forgotPassword }> 
              RECOVER { this.state.loading && 
                <i className="fa fa-spin fa-spinner"/>
            }
            </a>
        </div>
      </div>
    );
  }
}
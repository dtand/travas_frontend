import React from "react";
// import { withAlert } from "react-alert";
import EmailField from "../generic/email_field";
import PasswordField from "../generic/password_field";
import Submit from "../generic/submit";
import SessionManager from "../../js/SessionManager"
import ApiController from "../../js/ApiController"
import NotificationController from "../../js/NotificationController"
let NotificationSystem = require('react-notification-system');

export default class LoginForm extends React.Component {

  constructor(props){
    super(props);
    this.state={
      loading: false
    }
    this.submitLogin = this.submitLogin.bind(this);
    this.notificationSystem = null;
  }

  state = {
    fields: {}
  };

  onChange = updatedValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...updatedValue
      }
    });
  };

  async submitLogin() {
    
    if(!this.state.fields){
      NotificationController.displayNotification(
        "INPUT MISSING",
        "Either username or password are missing from login.  Please enter this information to continue.",
        "error"
      );
      return;
    }

    if(!this.state.fields['password']){
      NotificationController.displayNotification(
        "PASSWORD MISSING",
        "Please enter a password to continue",
        "error"
      );
      return;
    }


    if(!this.state.fields['email']){
      NotificationController.displayNotification(
        "EMAIL MISSING",
        "Please enter an email or username to continue",
        "error"
      );
      return;
    }

    const data = {
      "username": this.state.fields['email'],
      "password": this.state.fields['password']
    };

    if(data.username === ""){
      NotificationController.displayNotification(
        "INPUT EMAIL",
        "Please provide a valid email address or username",
        "error"
      );
      return;
    }

    if(data.password === ""){
      NotificationController.displayNotification(
        "INPUT PASSWORD",
        "Please provide a valid password",
        "error"
      );
      return;
    }

    if(data.username.length < 3){
      NotificationController.displayNotification(
        "NO USER",
        "Provided username does not exist",
        "error"
      );
      return;
    }

    if(data.password.length < 8){
      NotificationController.displayNotification(
        "INCORRECT PASSWORD",
        "Password provided is incorrect",
        "error"
      );
      return;
    }

    this.setState({
      loading: true
    });

    const self = this;
    ApiController.doPost(
      "auth",
      data,
      function(response){
        window.location = "beta";
        SessionManager.updateSession(response.sessionToken);
      },
      undefined,
      () => { 
        self.setState({
          loading: false
        });
      });
  }

  componentDidMount(){
    this.notificationSystem = this.refs.notificationSystem;
    NotificationController.setNotificationSystem(this.notificationSystem);
  }

  render() {
    return (
      <div>
        <form id="loginForm">
          <EmailField onChange={fields => this.onChange(fields)} label="Email" type="email" id="emailInput" />
          <PasswordField onChange={fields => this.onChange(fields)} label="Password" type="password" id="passwordInput"/>
          <Submit defaultValue={
            <h4>
              <span className="text-white">
              { !this.state.loading ? 
                 <i className="text-white fa fa-sign-in"/> :
                 <i className="text-white fa fa-spin fa-spinner"/> } LOGIN 
              </span>
            </h4>
          } onClick={this.submitLogin} />
        </form>
        <div>
          <NotificationSystem ref="notificationSystem"/>
        </div>
      </div>
    );
  }
}

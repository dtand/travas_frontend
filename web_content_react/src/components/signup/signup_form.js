import React from "react";
import EmailField from "../generic/email_field";
import UsernameField from "../platform/username_field";
import PasswordField from "../generic/password_field";
import Submit from "../generic/submit";
import ApiController from "../../js/ApiController"
import NotificationController from "../../js/NotificationController"
import SessionManager from "../../js/SessionManager";
import SimpleToggle from "../generic/simple_toggle";
let NotificationSystem = require('react-notification-system');

/**
 * Signup form component, encapsulates field updates and
 * performs submission to signup endpoint
 */
export default class SignupForm extends React.Component {

  /**
   * Bind internal functions 
   * @param {*} props 
   */
  constructor(props){
    super(props);
    this.state = {
      fields: {},
      loading: false,
      checkBox: true
    };
    this.signupData   = undefined;
    this.submitSignup = this.submitSignup.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.notificationSystem = null;
    this.toggleCheckBox = this.toggleCheckBox.bind(this);
  }

  /**
   * Called when a field changes inside the form
   */
  onChange = updatedValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...updatedValue
      }
    });
  };

  toggleCheckBox(){
    this.setState({
      checkBox: !this.state.checkBox
    });
  }

  /**
   * Called when user submits the signup form
   */
  async submitSignup() {
    const data = {
      email: this.state.fields['email'],
      username: this.state.fields['username'],
      password: document.getElementById('passwordInput').value,
      passwordConfirmed: document.getElementById('confirmPasswordInput').value,
      signupData: this.signupData,
      mailingList: this.state.checkBox
    };

    if( !data.email || data.email === ""){
      NotificationController.displayNotification(
        "INPUT EMAIL",
        "Please provide a valid email address",
        "error"
      );
      return;
    }

    if( !data.username || data.username === ""){
      NotificationController.displayNotification(
        "INPUT USERNAME",
        "Please provide a valid username",
        "error"
      );
      return;
    }

    if( !data.password || data.password === ""){
      NotificationController.displayNotification(
        "INPUT PASSWORD",
        "Please provide a valid password",
        "error"
      );
      return;
    }

    if( !data.passwordConfirmed || data.passwordConfirmed === ""){
      NotificationController.displayNotification(
        "CONFIRM PASSWORD",
        "Please confirm your password",
        "error"
      );
      return;
    }

    if(data.passwordConfirmed !== data.password){
      NotificationController.displayNotification(
        "PASSWORD MISMATCH",
        "Entered passwords do not match",
        "error"
      );
      return;
    }

    if(data.password.length < 8){
      NotificationController.displayNotification(
        "PASSWORD TOO SHORT",
        "Password must be at least 8 characters",
        "error"
      );
      return;
    }
    
    this.setState({
      loading: true
    });
    const self = this;
    ApiController.doPost(
      "signup", 
      data, 
      this.onSignup,
      data.email,
      () => {
        self.setState({
          loading: false
        });
      }
    );
  }

  /**
   * Called when user successfully signs up
   * @param {object} response 
   */
  async onSignup(response){
    window.location = "alpha";
    SessionManager.updateSession(response.sessionToken);
    this.setState({
      loading: false
    });
  }

  componentDidMount(){
    this.notificationSystem = this.refs.notificationSystem;
    NotificationController.setNotificationSystem(this.notificationSystem);

    if(window.localStorage.signupData){
      this.signupData = JSON.parse(window.localStorage.signupData);
      window.localStorage.removeItem("signupData");
    }

  }

  /**
   * Renders the signup form with all relevant fields
   */
  render() {
    return (
      <div>
        <form id="signupForm" className="text-left">
          <EmailField onChange={fields => this.onChange(fields)} label="Email" type="email" id="emailInput" />
          <UsernameField onChange={fields => this.onChange(fields)} label="Username" type="text" id="usernameInput"/>
          <PasswordField onChange={fields => this.onChange(fields)} label="Password" type="password" id="passwordInput"/>
          <PasswordField onChange={fields => this.onChange(fields)} label="Confirm Password" type="password" id="confirmPasswordInput"/>
          <br/>
          <h5 className="text-center text-secondary">
            SEND ME MONTHLY PLATFORM UPDATES 
            <span className="margin-left-5">
              <input onClick={ this.toggleCheckBox }
                     checked={ this.state.checkBox }
                     className="prop-up clickable" 
                     type="checkbox"/>
            </span>
          </h5>
          <br/>
          <Submit defaultValue={
            <h4>
              <span className="text-white">
              { !this.state.loading ? 
                 <i className="text-white fa fa-user-plus"/> :
                 <i className="text-white fa fa-spin fa-spinner"/> } SIGNUP
              </span>
            </h4>
          } onClick={this.submitSignup}/>
          <div className="text-center text-secondary margin-top-15">
              ALREADY HAVE AN ACCOUNT? <a className="text-center" href="login"> LOGIN </a>
          </div>
          <br/>
        </form>
        <div>
          <NotificationSystem ref="notificationSystem"/>
        </div>
      </div>
    );
  }
}

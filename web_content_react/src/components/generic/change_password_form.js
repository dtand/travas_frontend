import React from "react";
import PasswordField from "./password_field";
import ApiController from "../../js/ApiController"
import NotificationController from "../../js/NotificationController"
import IconHeader from "../generic/icon_header"
import ChangePasswordButton from "../login/change_password_button";
let NotificationSystem = require('react-notification-system');

/**
 * Signup form component, encapsulates field updates and
 * performs submission to signup endpoint
 */
export default class ChangePasswordForm extends React.Component {

  /**
   * Bind internal functions 
   * @param {*} props 
   */
  constructor(props){
    super(props);
    this.state = {
      fields: {}
    };
    this.changePassword     = this.changePassword.bind(this);
    this.onChangePassword   = this.onChangePassword.bind(this);
    this.notificationSystem = null;
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

  /**
   * Called when user submits the signup form
   */
  async changePassword() {
    const data = {
      passwordKey: this.props.verificationKey,
      newPassword: document.getElementById('passwordInput').value,
      newPasswordConfirmed: document.getElementById('confirmPasswordInput').value
    };

    if( !data.newPassword || data.newPassword === ""){
      NotificationController.displayNotification(
        "INPUT PASSWORD",
        "Please provide a valid password",
        "error"
      );
      return;
    }

    if( !data.newPasswordConfirmed || data.newPasswordConfirmed === ""){
      NotificationController.displayNotification(
        "CONFIRM PASSWORD",
        "Please confirm your password",
        "error"
      );
      return;
    }

    if(data.newPassword != data.newPasswordConfirmed){
      NotificationController.displayNotification(
        "PASSWORD MISMATCH",
        "Both password must match in order to continue",
        "error"
      );
      return;
    }
    
    ApiController.doPost("update_password", data, this.onChangePassword);
  }

  /**
   * Called when user successfully signs up
   * @param {object} response 
   */
  async onChangePassword(response){
    NotificationController.displayNotification(
      "PASSWORD CHANGED",
      response.message,
      "success"
    );
    window.location = "login";
  }

  componentDidMount(){
    this.notificationSystem = this.refs.notificationSystem;
    NotificationController.setNotificationSystem(this.notificationSystem);
  }
  /**
   * Renders the signup form with all relevant fields
   */
  render() {
    return (
      <div>
        <div className="container">
          <PasswordField onChange={fields => this.onChange(fields)} classOverride="text-white text-center" label="New Password" type="password" id="passwordInput"/>
          <PasswordField onChange={fields => this.onChange(fields)} classOverride="text-white text-center" label="Confirm Password" type="password" id="confirmPasswordInput"/>
          <br/>
          <div className="row text-center">
            <div className="col-md-12 text-center">
              <ChangePasswordButton onClick={ this.changePassword } text={ "CONFIRM" }/>
            </div>
          </div>
        </div>
        <div>
          <NotificationSystem ref="notificationSystem"/>
        </div>
      </div>
    );
  }
}

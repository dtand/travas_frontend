import React from "react";
// import { withAlert } from "react-alert";
import EmailField from "./email_field";
import PasswordField from "./password_field";
import Submit from "./submit";
import SessionManager from "../js/SessionManager"
import ApiController from "../js/ApiController"

export default class LoginForm extends React.Component {

  constructor(props){
    super(props);
    this.submitLogin = this.submitLogin.bind(this);
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
    
    const data = {
      "username": this.state.fields['email'],
      "password": this.state.fields['password']
    };

    ApiController.doPost("auth",data,function(response){
      window.location = "http://localhost:3000/dashboard";
      SessionManager.updateSession(response.sessionToken);
    });
  }

  render() {
    return (
      <form id="loginForm">
        <EmailField onChange={fields => this.onChange(fields)} label="Email" type="email" id="emailInput" />
        <PasswordField onChange={fields => this.onChange(fields)} label="Password" type="password" id="passwordInput"/>
        <Submit defaultValue="Login" onClick={this.submitLogin} />
      </form>
    );
  }
}

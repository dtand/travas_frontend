import React from "react";
import EmailField from "./email_field";
import UsernameField from "./username_field";
import PasswordField from "./password_field";
import Submit from "./submit";
import ApiController from "../js/ApiController"
import SessionManager from "../js/SessionManager"

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
      fields: {}
    };
    this.submitSignup = this.submitSignup.bind(this);
    this.onSignup = this.onSignup.bind(this);
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
  async submitSignup() {
    const data = {
      email: JSON.stringify(this.state.fields['email']),
      username: JSON.stringify(this.state.fields['username']),
      password: JSON.stringify(this.state.fields['password'])
    };
    ApiController.doPost("signup", data, this.onSignup);
  }

  /**
   * Called when user successfully signs up
   * @param {object} response 
   */
  async onSignup(response){
    alert(JSON.stringify(response))
  }

  /**
   * Renders the signup form with all relevant fields
   */
  render() {
    return (
      <form id="signupForm" className="text-left">
        <EmailField onChange={fields => this.onChange(fields)} label="Email" type="email" id="emailInput" />
        <UsernameField onChange={fields => this.onChange(fields)} label="Username" type="text" id="usernameInput"/>
        <PasswordField onChange={fields => this.onChange(fields)} label="Password" type="password" id="passwordInput"/>
        <PasswordField onChange={fields => this.onChange(fields)} label="Confirm Password" type="password" id="confirmPasswordInput"/>
        <Submit defaultValue="Sign Up" onClick={this.submitSignup}/>
      </form>
    );
  }
}

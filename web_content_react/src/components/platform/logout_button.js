import React from "react";

export default class LogoutButton extends React.Component {
  render() {
    return (
        <a class="nav-link" data-toggle="modal" data-target="#logoutModal">
        <i class="fa fa-fw fa-sign-out"></i>Logout</a>
    );
  }
}
import React from "react";
import SideNav from "./side_nav";

export default class MainNav extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" 
              id="mainNav">
              <a className="navbar-brand" href="dashboard.html">
                <i><strong>{ this.props.dashboardTitle }</strong></i>
              </a>
        <SideNav/>
        </nav>
      );
    }
  }
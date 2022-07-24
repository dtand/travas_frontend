import React from "react";
import Radium, { Style } from 'radium';

/**
 * Specific style
 */
const NAV_STYLE = {
  color: "white"
}


export default class NavItem extends React.Component {

    constructor(props){
      super(props);
    }

    render() {
      return (
        <li className="nav-item" 
            data-toggle="tooltip" 
            data-placement="right" 
            title="" 
            data-original-title="Components">
            <a className="nav-link" 
               href={ this.props.href } 
              style={ NAV_STYLE }>
              <i className={ this.props.iconClass }></i>
              <span className="nav-link-text" style={ NAV_STYLE }>{ this.props.serviceName }</span>
            </a>
        </li>
      );
    }
  }
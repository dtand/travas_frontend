import React from "react";
import Radium, { Style } from 'radium';


const NAV_STYLE = {
  color: "white"
}

const NAV_STYLE_SELECTED = {
  color: "white",
  font: "bold"
}

const SELECTED_BG = {
  backgroundColor: "#0e365fc4"
}

const HOVERED_BG = {
  backgroundColor: "rgba(218, 220, 222, 0.25)"
}

export default class NavItem extends React.Component {

    constructor(props){
      super(props);
      this.state={
        hovered: false
      }
      this.handleMouseOut = this.handleMouseOut.bind(this);
      this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    handleMouseOver(){
      this.setState({
        hovered: !this.props.selected 
      });
    }

    handleMouseOut(){
      this.setState({
        hovered: false
      });
    }

    render() {
      return (
        <li onClick={ () => this.props.serviceProps.selectService(this.props.serviceProps.serviceName) }
            className={ this.props.selected || this.state.hovered ? "nav-item border-bottom border-top" : "nav-item" }
            data-toggle="tooltip" 
            data-placement="right" 
            title="" 
            data-original-title="Components"
            style={ this.props.selected ? SELECTED_BG : this.state.hovered ? HOVERED_BG : undefined }
            onMouseOver={ this.handleMouseOver }
            onMouseOut={ this.handleMouseOut }>
            <a className="nav-link" 
               /**href={ this.props.href }**/
               style={ this.props.selected ? NAV_STYLE_SELECTED : NAV_STYLE }>
              <i className={ this.props.serviceProps.iconClass }></i>
              <span className="nav-link-text" style={ this.props.selected ? NAV_STYLE_SELECTED : NAV_STYLE }>{ this.props.serviceProps.serviceName }</span>
            </a>
        </li>
      );
    }
  }
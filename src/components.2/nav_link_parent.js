import React from "react";

/**
 * Specific style
 */
const NAV_STYLE = {
  color: "white"
}

export default class NavLinkParent extends React.Component {
   
    constructor(props){
      super(props);
    }

    render() {

      const anchorClass = this.props.collapsed ? 
                          "nav-link nav-link-collapse" :
                          "nav-link nav-link-collapse collapse"
      return(
        <a className={ anchorClass } 
           onClick={ this.props.onClick }
           data-toggle="collapse" 
           href={ this.props.parentHref } 
           data-parent="#exampleAccordion"
           aria-expanded={ !this.props.collapsed }
           style={ NAV_STYLE }>
          <i className={ this.props.iconClass }></i>
            <span className="nav-link-text" style={ NAV_STYLE }>{ this.props.serviceName }</span>
        </a>
      );
    }
}
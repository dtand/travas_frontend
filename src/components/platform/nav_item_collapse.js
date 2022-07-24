import React from "react";
import NavLinkParent from "./nav_link_parent";


/**
 * Anchor style
 */
const ANCHOR_STYLE = {
  color: '#dee2e6',
  ':hover': {
    color: 'white'
  }
};

export default class NavItemCollapse extends React.Component {
   
    constructor(props){
      super(props);
      this.state = {
        collapsed: true
      }
      this.onClick = this.onClick.bind(this);
    }

    onClick(){
      this.setState({
        collapsed: !this.state.collapsed
      });
    }

    render() {
      
      const listItems = this.props.pages.map((p) => 
        <li key={ p.name }>
          <a href={ p.href } style={ ANCHOR_STYLE }>{ p.name }</a>
        </li>          
      );

      const childClass  = this.state.collapsed ? 
                          "sidenav-second-level collapse" :
                          "sidenav-second-level collapse show";
      return (

        <li key={ this.props.serviceName }
            className="nav-item" 
            data-toggle="tooltip" 
            data-placement="right" 
            title="" 
            data-original-title="Components">
            <NavLinkParent 
              collapsed={ this.props.collapsed }
              onClick={ this.onClick }
              parentHref={ this.props.parentHref }
              iconClass={ this.props.iconClass }
              serviceName={ this.props.serviceName } />
            <ul className={ childClass }
                id="collapseComponentsStrategy">
              {listItems}
            </ul>
        </li>
      );
  }
}
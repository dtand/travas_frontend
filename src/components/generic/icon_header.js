import React from "react";

/**
 * CSS Specific
 */
const MARGIN_RIGHT = {
  marginRight: "5px"
}

export default class IconHeader extends React.Component {
  render() {

    if( !this.props.anchor || this.props.anchor === "left"){
      return (
        <div className={ this.props.textClass ? this.props.textClass : "text-left" }> 
            <i style={ MARGIN_RIGHT } className={ this.props.iconClass } aria-hidden="true"/>
            <strong>{ this.props.header }</strong>
        </div>
      );
    }
    else{
      return (
        <div className={ this.props.textClass ? this.props.textClass : "text-left" }> 
            <strong style={ MARGIN_RIGHT }>{ this.props.header }</strong>
            <i className={ this.props.iconClass } aria-hidden="true"/>
        </div>
      );     
    }
  }
}


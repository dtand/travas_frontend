import React from "react";

const SCALED = {
  transform: "scale(1.5) translate(0px,-2px)",
}

const NON_SCALED = {
  transform: "scale(1.0)",
}

export default class HoverIcon extends React.Component {

  constructor(props){
    super(props);
    this.state={
      hovered: false
    }
    this.handleMouseOut  = this.handleMouseOut.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  handleMouseOver(){
    this.setState({
      hovered: true
    });
  }

  handleMouseOut(){
    this.setState({
      hovered: false
    });
  }

  render() {

    const defaultClass     = this.props.classOverride ? this.props.classOverride : "text-secondary";
    const defaultTextStyle = this.textStyleOverride ? this.props.textStyleOverride : {};

    return (
      <div className="text-center"
           onMouseOver={ this.handleMouseOver } 
           onMouseOut={ this.handleMouseOut }>
        <i className={ "clickable fa " + this.props.icon + " " + (this.state.hovered ? "text-primary" : defaultClass) } 
           onClick={ this.props.onClick } 
           style={ this.state.hovered ? SCALED : NON_SCALED }/>
        { this.state.hovered && <h6 className="text-center text-primary" style={ defaultTextStyle }><strong>{ this.props.info }</strong></h6> }
      </div>
    );
  }
}


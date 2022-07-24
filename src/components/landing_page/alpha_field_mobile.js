import React from "react";

export default class AlphaFieldMobile extends React.Component {

  constructor(props){
    super(props);
  }

  getIcon(){
    if(this.props.label === "NETWORK"){
      return <i className="fa fa-sitemap medium-icon text-blue-fade-dark"/>
    }
    else if(this.props.label === "TRADING BOTS"){
      return <i className="fa fa-cogs medium-icon text-blue-fade-dark"/>
    }
    else if(this.props.label === "TRADE EXECUTION"){
      return <i className="fa fa-exchange medium-icon text-blue-fade-dark"/>
    }
  }

  render() {
    return (
      <div className="col-lg-12 margin-top-25 margin-bottom-25">
           <h1>{ this.getIcon() }</h1>
           <h2 className="text-blue-fade-light"> <strong>{ this.props.label }</strong></h2>
           <p className="about text-secondary margin-left-25 margin-right-25"><i>{ this.props.text }</i></p>
      </div>
    );
  }
}


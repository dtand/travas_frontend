import React from "react";

export default class BotViewSelector extends React.Component {

  constructor(props){
    super(props);
  }
 
  render() {
    return (
      <div className="container text-center margin-top-25">
      <div className="row text-center">
        <div className="col-md-1"/>
        <div className= { this.props.selectedView === "summary" ?
              "col-md-3 hover-primary hover-border-selected margin-left-25 margin-right-25" :
              "col-md-3 hover-primary hover-border margin-left-25 margin-right-25" }>
          <h3 onClick={ () => this.props.selectView("summary") }
              className="clickable margin-bottom-15"> 
              <span className= { this.props.selectedView === "summary" ? " hover-primary text-primary" : "hover-primary text-secondary" }>SUMMARY <i className="margin-left-5 fa fa-bar-chart-o"/> </span>
          </h3>
        </div>
        <div className= { this.props.selectedView === "graphs" ?
              "col-md-3 hover-primary hover-border-selected margin-left-25 margin-right-25" :
              "col-md-3 hover-primary hover-border margin-left-25 margin-right-25" }>
          <h3  onClick={ () => this.props.selectView("graphs") }
              className="clickable margin-bottom-15"> 
              <span className= { this.props.selectedView === "graphs" ? " hover-primary text-primary" : "hover-primary text-secondary" }>GRAPHS <i className="margin-left-5 fa fa-area-chart"/> </span>
          </h3>
        </div>
        <div className= { this.props.selectedView === "trades" ?
              "col-md-3 hover-primary hover-border-selected margin-left-25 margin-right-25" :
              "col-md-3 hover-primary hover-border margin-left-25 margin-right-25" }>
          <h3 onClick={ () => this.props.selectView("trades") }
              className="clickable margin-bottom-15"> 
              <span className= { this.props.selectedView === "trades" ? " hover-primary text-primary" : "hover-primary text-secondary" }>TRADES <i className="margin-left-5 fa fa-exchange"/> </span>
          </h3>
        </div>
        <div className="col-md-1"/>
      </div>
  </div>
  )}
}


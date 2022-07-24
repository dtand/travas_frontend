import React from "react";

const STYLE = {
  width: "100%",
  height: "64px",
  marginTop: "10px",
  right: "40px"
}

const PADDING = {
  paddingLeft: "5px"
}

const MARGIN_TOP = {
  marginTop: "30px"
}

export default class SubmitBacktestButton extends React.Component {
  

  render() {
    return (
      <button className="btn btn-large btn-secondary" 
              style={ STYLE }
              onClick={ this.props.submit }>
                RUN BACKTEST
        <i className="fa fa-fw fa-area-chart" 
          style={ PADDING }/>
      </button>
    );
  }
}


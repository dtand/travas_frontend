import React from "react";
import Constants from "../js/Constants"

const BUTTON_STYLE = {
  right: "30px"
}

export default class IntervalList extends React.Component {

  constructor(props){
      super(props);
      this.handleClick = this.handleClick.bind(this);
  }

  handleClick(interval){
      this.props.updateInterval(interval);
  }

  render() {
    const buttonList = Constants.SUPPORTED_INTERVALS.map((i) => 
      <button key={ i }
              id={ this.props.graphId + "-" + i } 
              type="button" 
              className="btn btn-primary" 
              onClick={ () => this.handleClick(i) }>
              { i.toUpperCase() }
      </button>          
    );

    return (
        <div className="btn-group btn-group-sm float-right" 
             role="group" 
             aria-label="Second group"
             style = { BUTTON_STYLE }>
			{ buttonList }
		</div>
    );
  }
}

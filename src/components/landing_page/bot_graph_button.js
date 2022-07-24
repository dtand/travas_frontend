import React from "react";
import ReactTooltip from "react-tooltip"

export default class BotGraphButton extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      hovered: false
    }
    this.onHover  = this.onHover.bind(this);
    this.offHover = this.offHover.bind(this);
  }

  onHover(){
    this.setState({
      hovered: true
    });
  }

  offHover(){
    this.setState({
      hovered: false
    });
  }

  getTooltip(){
    return <ReactTooltip id={ this.props.text + "-graph-button" } 
                          type="info" 
                          place="bottom" 
                          effect="solid"
                          className="react-tooltip-fixed">
          <span> 
            <p className="text-white text-left">{ this.props.tooltip }</p>
          </span>
        </ReactTooltip>
  }

  render() {

    const btnClass = this.state.hovered || 
                     this.props.selected ? 
                     "btn-join-primary" : 
                     "btn-join-secondary";

    return (
      <span>
        <button data-tip data-for={ this.props.text + "-graph-button" }
                style={ { width: "124px", height: "40px" } }
                onMouseEnter={ this.onHover }
                onMouseLeave={ this.offHover }
                onMouseDown={ () => this.props.select(this.props.text.toLowerCase()) }
                class={ "border rounded text-center btn btn-sm " + btnClass } >
          <div class="text-center">
            <i>
              { this.props.text }
            </i>
          </div>
        </button>
        { this.props.tooltip && this.getTooltip() }
      </span>
    );
  }
}


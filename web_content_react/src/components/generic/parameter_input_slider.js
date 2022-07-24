import React from "react";
import ReactTooltip from "react-tooltip"
import Constants from "../../js/Constants"
import InputRange from 'react-input-range';

const MARGIN_LEFT = {
  marginLeft: "5px"
}

const STYLE = {
  paddingLeft:  "10px"
}

const TOOLTIP = {
  width: "5em"
}

export default class ParameterInputSlider extends React.Component {

  constructor(props){
    super(props);
    this.state={
      value: this.props.defaultValue
    }
  }

  /**
   * Handles operations done explicitely on the input box
   */
  handleChange = (value) => {
    //document.getElementById(this.props.inputId).value = value;
    this.setState({
     value: parseFloat(value.toFixed(4))
    });
  }

  render() {
    return (
      <div>
    <div className={ this.props.classOverride ? this.props.classOverride : "text-secondary" }>
      <h5 className="text-black">
        { this.props.parameter }
        <span style={ TOOLTIP }>
          <a className={ this.props.classOverride ? 
                         this.props.classOverride  + " fa fa-info-circle" : 
                         "text-secondary fa fa-info-circle"  }
            data-tip data-for={ this.props.signalId + "-tooltip" }
            style={ MARGIN_LEFT }> 
          </a>
            <ReactTooltip id={ this.props.signalId + "-tooltip" } 
                          type="info" 
                          place="right" 
                          effect="solid"
                          className="react-tooltip-fixed">
            <h5 className="text-white" style={ this.props.headerStyle ? this.props.headerStyle : {} }>{ Constants.INDICATOR_METADATA[this.props.parameter].name }</h5>
            <span> 
              { 
                Constants.INDICATOR_METADATA[this.props.parameter].description
              } 
            </span>
          </ReactTooltip>
        </span>
      </h5>
    </div>
    <br/>
    <div className="input-group input-group-sm mb-2" style={ MARGIN_LEFT }>
      <InputRange maxValue={ 1 }
                  minValue={ 0 }
                  value={ this.state.value }
                  step={ this.props.step }
                  onChange={ value => this.handleChange(value) } />    
    </div>
    </div>
    );
  }
}
import React from "react";
import Constants from "../../js/Constants";
import ParameterInputSpinner from "../generic/parameter_input_spinner";

export default class ValueSpinner extends React.Component {

    constructor(props){
        super(props);
        this.state={
            value: this.props.defaultValue
        }
        this.incrementValue = this.incrementValue.bind(this);
        this.decrementValue = this.decrementValue.bind(this);
    }
      
        incrementValue(){
          if(this.props.onChangeCallback){
            this.props.onChangeCallback();
          }
          if(this.state.value < this.props.max){
            this.setState({
              value: this.state.value + this.props.step
            });
            if(this.props.onUpdateValue){
                this.props.onUpdateValue(this.state.value + this.props.step,this.props.index)
            }
          }
        
        }
      
        decrementValue(){
          if(this.props.onChangeCallback){
            this.props.onChangeCallback();
          }
          if(this.state.value > this.props.min){
            this.setState({
              value: this.state.value - this.props.step
            });
            if(this.props.onUpdateValue){
                this.props.onUpdateValue(this.state.value - this.props.step,this.props.index)
            }
          }
        }
      
        getValue(){
          const value = Math.abs(parseFloat(this.state.value).toFixed(this.props.precision));
          if(Constants.INDICATOR_METADATA[this.props.indicator] && 
             Constants.INDICATOR_METADATA[this.props.indicator].display){
            return Constants.INDICATOR_METADATA[this.props.indicator].display(value);
          }
          return value;
        }

    render() {
    return(
        <div>
            <span className="margin-left-5 small-toggles btn-group text-secondary">
                { this.props.indicator.toUpperCase() }
                { " " }
                { this.getValue() }
                <span className="text-sm">
                    <span className="margin-left-5">
                        <i className="fa fa-plus clickable" onClick={ this.incrementValue }/>
                    </span>
                    <span className="margin-left-5">
                        <i className="fa fa-minus clickable" onClick={ this.decrementValue }/>
                    </span>
                </span>
            </span>
        </div>
    )}
}
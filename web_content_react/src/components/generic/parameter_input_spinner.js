import React from "react";
import ReactTooltip from "react-tooltip"
import Constants from "../../js/Constants"

const MARGIN_LEFT = {
  marginLeft: "5px"
}

const STYLE = {
  paddingLeft:  "10px"
}

const TOOLTIP = {
  width: "5em"
}

const SUPER_SPEED_CONSTANT = 1000;

export default class ParameterInputSpinner extends React.Component {

  constructor(props){
    super(props);
    this.state={
      value: this.props.defaultValue,
    }

    this.defaultValue       = this.props.defaultValue;
    this.startTimeIncrement = new Date().getTime();
    this.startTimeDecrement = new Date().getTime();
  }

  /**
   * Start incrementing process
   */
  handleMouseDown = (increment) =>{
    if(increment){
      this.startTimeIncrement = new Date().getTime();
      this.runIncrement = setInterval(this.repeatIncrement,50);
    }
    else{
      this.startTimeDecrement = new Date().getTime();
      this.runDecrement = setInterval(this.repeatDecrement,50);
    }
  }

  /**
   * Start decrementing process
   */
  handleMouseUp = (increment) =>{
    if(increment){
      this.runIncrement = clearInterval(this.runIncrement);
      if(this.props.onChangeCallback){
        this.props.onChangeCallback();
      }
    }
    else{
      this.runDecrement = clearInterval(this.runDecrement);
      if(this.props.onChangeCallback){
        this.props.onChangeCallback();
      }
    }
  }

  /**
   * Called while user is holding down increment button
   */
  repeatIncrement = () => {
    const totalTimeHeld = new Date().getTime() - this.startTimeIncrement;
    if(totalTimeHeld >= SUPER_SPEED_CONSTANT){
      this.incrementValue(true,1);
    }
  }

  /**
   * Called while user is holding down decrement button
   */
  repeatDecrement = () => {
    
    const totalTimeHeld = new Date().getTime() - this.startTimeDecrement;
    if(totalTimeHeld >= SUPER_SPEED_CONSTANT){
      this.decrementValue(true,1);
    }
  }

  /**
   * Increments the current value in the spinner by this.props.step
   */
  incrementValue = (skipCallback,weight) =>{
    if(this.state.value < this.props.max){
      this.setState({
        value: Math.min(this.props.max,this.state.value + (this.props.step*weight))
      });
    }
    document.getElementById(this.props.inputId).value = this.state.value + this.props.step;
    if(skipCallback){
      return;
    }
    if(this.props.onChangeCallback){
      this.props.onChangeCallback();
    }
  }

  /**
   * Decrements the current value in the spinner by this.props.step
   */
  decrementValue = (skipCallback,weight) =>{
    if(this.state.value > this.props.min){
      this.setState({
        value: Math.max(this.props.min,this.state.value - (this.props.step*weight))
      });
    }
    document.getElementById(this.props.inputId).value = this.state.value - this.props.step;
    if(skipCallback){
      return;
    }
    if(this.props.onChangeCallback){
      this.props.onChangeCallback();
    }
  }

  /**
   * Handles operations done explicitely on the input box
   */
  handleChange = (event) => {
    
    const valueBefore = this.state.value;
    const value = event.target.value;

    if(isNaN(value)){
      return;
    }

    this.state.value = Number(value);
    
    if(this.state.value >= this.props.min && 
       this.state.value <= this.props.max || 
       this.state.value === "" ){
       document.getElementById(this.props.inputId).value = value;
       this.setState({
        value: this.state.value
       });
    }
    else{
      this.setState({
        value: valueBefore
      });
    }
    if(this.props.onChangeCallback){
      this.props.onChangeCallback();
    }
  }

  getValue(){
    const value = Math.abs(parseFloat(this.state.value).toFixed(this.props.precision));
    if(Constants.INDICATOR_METADATA[this.props.parameter].display){
      return Constants.INDICATOR_METADATA[this.props.parameter].display(value);
    }
    return value;
  }

  componentDidMount(){
    /**
     * Check for no value, force update on new signal selection
     */
    if(!document.getElementById(this.props.inputId).value){
      document.getElementById(this.props.inputId).value = this.props.defaultValue;
      if(this.props.onChangeCallback){
        this.props.onChangeCallback();
      }
    }
  }
  componentDidUpdate(){

    /**
     * Check for no value, force update on new signal selection
     */
    if(!document.getElementById(this.props.inputId).value){
      document.getElementById(this.props.inputId).value = this.props.defaultValue;
      if(this.props.onChangeCallback){
        this.props.onChangeCallback();
      }
    }

    /**
     * Check if inputs changed, reset to defaults
     */
    if(this.props.defaultValue !== this.defaultValue){
      this.defaultValue = this.props.defaultValue;
      this.setState({
        value: this.props.defaultValue
      });
    }

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
    <div className="input-group input-group-sm mb-2" style={ MARGIN_LEFT }>
      <div className="btn-group">
        <input style={ this.props.inputBoxStyle ? this.props.inputBoxStyle : STYLE }
               id={ this.props.inputId }
               value={ this.props.precision === 0 ? this.state.value : this.getValue() }
               min={ this.props.min } 
               max={ this.props.max }
               step={ this.props.step } 
               class="border"
               onChange={ this.handleChange }/>
        <div className="btn-group">
          <button class="btn btn-sm btn-secondary" onClick={ () => this.decrementValue(false,1) } 
                                                   onMouseDown={ () => this.handleMouseDown(false) }
                                                   onMouseUp={ () => this.handleMouseUp(false) }>-</button>
          <button class="btn btn-sm btn-secondary" onClick={ () => this.incrementValue(false,1) } 
                                                   onMouseDown={ () => this.handleMouseDown(true) }
                                                   onMouseUp={ () => this.handleMouseUp(true) }>+</button>
        </div>
      </div> 
    </div>
    <div className="row text-center prop-up-big">
        <div className="col-md-12 margin-left-10 text-left">
          <span className="border text-sm margin-right-10 text-left primary-hover clickable"
                onClick={ () => this.decrementValue(false,10) } > 
            { "SKIP ↓" } 
          </span> 
          <span className="border text-sm text-right primary-hover clickable"
                onClick={ () => this.incrementValue(false,10) } > 
            { "SKIP ↑" } 
          </span>
        </div>
      </div>  
    </div>
    );
  }
}
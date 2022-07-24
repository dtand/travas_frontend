import React from "react";
import ModalController from "../../js/ModalController"
import Constants from "../../js/Constants"
import ParameterInputSpinner from "../generic/parameter_input_spinner"

const MARGIN_LEFT={
  marginLeft: "5px"
}

const INPUT_STYLE={
  width: "100%",
  height: "42px"
}

const INPUT_STYLE_DESC={
  width: "100%",
  height:"100px"
}

const MIN_CHARACTERS = 0;

const MAX_CHARACTERS = 299;

export default class SaveStrategyModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      data: undefined,
      characterCount: MAX_CHARACTERS - (ModalController.getData("saveStrategyModal").defaultDescription ? ModalController.getData("saveStrategyModal").defaultDescription.length : 0),
      inputValue: ModalController.getData("saveStrategyModal").defaultDescription ? ModalController.getData("saveStrategyModal").defaultDescription : "",
      update: false,
      stopLossType: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
  }

  update(){
    this.setState({
      update: true
    });
  }

  handleChange(event) {
    const numCharacters = document.getElementById("descriptionArea").value.length;
    this.state.characterCount = MAX_CHARACTERS - numCharacters;

    if(this.state.characterCount >= 0){
      this.setState({
        characterCount: this.state.characterCount,
        inputValue: document.getElementById("descriptionArea").value
      });
    }
  }

  signalToHtml(signal){
    let keys    = Object.keys(signal);
    const index = keys.indexOf("signal");
    
    if (index !== -1) {
        keys.splice(index, 1);
    }

    const listElements = keys.map((key) => 
      <span>
        { this.camelToHyphen(key) + ": " + signal[key] }
        <br/>
      </span>);

    return (
      <div> 
        <div style={ MARGIN_LEFT }>
          { listElements } 
        </div>
      </div>);
  }

  camelToHyphen(str){
    return str.split(/(?=[A-Z])/).join("-").toUpperCase();
  }

  componentDidUpdate() {
    
    const payload={
      buySignals: [this.state.data.buySignal],
      sellSignals: [this.state.data.sellSignal],
      stopLoss: this.state.data.stopLoss,
      strategyName: document.getElementById("strategyName").value,
      description: document.getElementById("descriptionArea").value,
      advanced: false
    }

    ModalController.setData("saveStrategyModal",payload);
    this.state.update = false;
  }

  render() {

    if(!this.state.data){
      this.state.data = ModalController.getData("saveStrategyModal");
    }
    
    const parameter = "STOP LOSS %";
    const self = this;
    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <input id="strategyName"
                     placeholder="Insert Strategy Name..."
                     style={ INPUT_STYLE }
                     onChange={ this.update }/>
            </div>
            <br/><br/>
          </div><br/>
          <div class="row text-center">
            <div class="col-md-12">
              <textarea id="descriptionArea"
                        name="message" 
                        rows="10" 
                        cols="30"
                        style={ INPUT_STYLE_DESC }
                        placeholder="Insert short description..."
                        onChange={ this.handleChange }
                        value={ this.state.inputValue }/>
            </div>
            <div class="col-md-12 text-right">
              <h6 class="pull-right" id="count_message">{ this.state.characterCount }</h6>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 margin-top-5 border-right">
              <h5 className="text-success">
                {this.state.data.buySignal.signal }
              </h5>
              <div className="margin-top-5">
                { this.signalToHtml(this.state.data.buySignal) }
              </div>
              <h5 className="text-danger">
                {this.state.data.sellSignal.signal }
              </h5>
              <div className="margin-top-5">
                { this.signalToHtml(this.state.data.sellSignal) }
              </div>
            </div>
          </div>
          <div className="row margin-top-5">
            <div className="col-sm-12">
              <span className="text-primary">
                { this.state.data.stopLoss.type.toUpperCase() + " STOP LOSS" }
              </span>
            </div>
            <div className="col-sm-12">
              {"STOP LOSS %: " + parseFloat((this.state.data.stopLoss.stopLossPercent*100).toFixed(4))+"%" }
            </div>
            { this.state.data.stopLoss.type === "targetTrailing" && 
              <div className="col-sm-12">
                {"TARGET %: " + parseFloat((this.state.data.stopLoss.targetPercent*100).toFixed(4))+"%" }
              </div>
            }
          </div>
        </div>
    );
  }
}


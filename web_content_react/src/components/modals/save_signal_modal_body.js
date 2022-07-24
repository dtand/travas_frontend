import React from "react";
import ModalController from "../../js/ModalController"
import Constants from "../../js/Constants"
import ParameterInputSpinner from "../generic/parameter_input_spinner"
import SimpleToggle from "../generic/simple_toggle";

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

export default class SaveSignalModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      characterCount: MAX_CHARACTERS - (ModalController.getData("saveSignalModal").defaultDescription ? ModalController.getData("saveSignalModal").defaultDescription.length : 0),
      inputValue: ModalController.getData("saveSignalModal").defaultDescription ? ModalController.getData("saveSignalModal").defaultDescription : "",
      update: false,
      buySignal: true,
      sellSignal: false
    }
  }

  update = () => {
    this.setState({
      update: true
    });
  }
  
  handleChange = (event) => {
    const numCharacters = document.getElementById("descriptionArea").value.length;
    this.state.characterCount = MAX_CHARACTERS - numCharacters;

    if(this.state.characterCount >= 0){
      this.setState({
        characterCount: this.state.characterCount,
        inputValue: document.getElementById("descriptionArea").value
      });
    }
  }

  componentDidMount(){
    ModalController.updateData("saveSignalModal", {
      name: document.getElementById("signalName").innerHTML,
      description: this.state.inputValue,
      signalType: this.state.buy ? "BUY" : "SELL"
    });
  }

  componentDidUpdate(){
    ModalController.updateData("saveSignalModal", {
      name: document.getElementById("signalName").innerHTML,
      description: this.state.inputValue,
      signalType: this.state.buy ? "BUY" : "SELL"
    });
  }

  render() {
    
    const parameter = "STOP LOSS %";
    const self = this;
    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <input id="signalName"
                     placeholder="Insert Signal Name..."
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
          <div className="text-center">
            <h3 className="margin-top-10 margin-bottom-10">
              Signal Category
            </h3>
          </div>
          <div className="row text-center margins-25">

            <div className="col-md-6 text-center">
              <SimpleToggle active={ this.state.buySignal && !this.state.sellSignal }
                            label="Buy Signal"
                            onChange={ () => { self.setState( { 
                              buySignal: !self.state.buySignal ,
                              sellSignal: !self.state.sellSignal
                            })}}/>
            </div>
            <div className="col-md-6 text-center">
              <SimpleToggle active={ this.state.sellSignal && !this.state.buySignal }
                            label="Sell Signal"
                            onChange={ () => { self.setState( { 
                              sellSignal: !self.state.sellSignal ,
                              buySignal: !self.state.buySignal
                            })}}/>
            </div>
          </div>
        </div>
    );
  }
}


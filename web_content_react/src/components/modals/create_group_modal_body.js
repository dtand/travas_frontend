import React from "react";
import ModalController from "../../js/ModalController"

const INPUT_STYLE={
  width: "100%",
  height: "42px"
}

const INPUT_STYLE_DESC={
  width: "100%",
  height:"100px"
}

const MIN_CHARACTERS = 0;

const MAX_CHARACTERS = 124;

export default class CreateGroupModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      data: undefined,
      characterCount: MAX_CHARACTERS,
      inputValue: "",
      update: false
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

  componentDidUpdate() {
    this.state.update = false;
  }

  render() {

    if(!this.state.data){
      this.state.data = ModalController.getData("createGroupModal");
    }

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <input id="groupNameInput"
                     placeholder="Insert Group Name..."
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
                        placeholder="Insert group description..."
                        onChange={ this.handleChange }
                        value={ this.state.inputValue }/>
            </div>
            <div class="col-md-12 text-right">
              <h6 class="pull-right" id="count_message">{ this.state.characterCount }</h6>
            </div>
          </div>
        </div>
    );
  }
}


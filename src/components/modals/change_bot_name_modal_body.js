import React from "react";
import ModalController from "../../js/ModalController"

const INPUT_STYLE={
  width: "100%",
  height: "42px"
}

export default class ChangeBotNameModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      data: undefined,
    }
  }

  render() {

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <p>
                Type a new name for your bot below.  Click submit when 
                done.  The name can only contain alpha-numeric characters, 
                spaces, hyphens and underscores.
              </p>
              <br/>
              <input id="botNameInput"
                     placeholder="Insert New Bot Name..."
                     style={ INPUT_STYLE }
                     onChange={ this.update }/>
            </div>
            <br/><br/>
          </div><br/>
        </div>
    );
  }
}


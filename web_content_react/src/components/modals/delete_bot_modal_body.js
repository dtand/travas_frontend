import React from "react";

const INPUT_STYLE={
  width: "100%",
  height: "50px"
}

export default class DeleteBotModalBody extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <input className="text-center"
                     id="botNameInput"
                     placeholder="Enter Bot's Name"
                     style={ INPUT_STYLE }/>
            </div>
            <br/><br/>
          </div><br/>
          <div class="row text-center">
            <div class="col-md-12">
              <p class="text-left">
                By confirming this bot's name above and clicking submit below, this bot will be deleted.  Once deleted,
                all trade records and logs will no longer be accessible.  To continue, enter the bot's name above and click
                submit.
              </p>
            </div>
          </div>
        </div>
    );
  }
}


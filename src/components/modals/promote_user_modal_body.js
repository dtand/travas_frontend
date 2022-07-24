import React from "react";

const INPUT_STYLE={
  width: "100%",
  height: "50px"
}

export default class PromoteUserModalBody extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <input className="text-center"
                     id="promoteUserInput"
                     placeholder="Enter member's name"
                     style={ INPUT_STYLE }/>
            </div>
            <br/><br/>
          </div><br/>
          <div class="row text-center">
            <div class="col-md-12">
              <p class="text-left">
                By confirming this user's name and clicking submit this user will be promoted to admin. In doing this, you
                will lose admin status and the new user will recieve it.  If this is what you would like to do, type the
                new admin's username and click submit.
              </p>
            </div>
          </div>
        </div>
    );
  }
}


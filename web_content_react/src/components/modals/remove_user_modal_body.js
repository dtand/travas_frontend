import React from "react";

const INPUT_STYLE={
  width: "100%",
  height: "50px"
}

export default class RemoveUserModalBody extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <input className="text-center"
                     id="removeUserInput"
                     placeholder="Enter Member's Name"
                     style={ INPUT_STYLE }/>
            </div>
            <br/><br/>
          </div><br/>
          <div class="row text-center">
            <div class="col-md-12">
              <p class="text-left">
                By confirming this user's name and clicking submit this user will no longer be a group member. If you
                are sure this is what you would like to do, please confirm the group name and continue
              </p>
            </div>
          </div>
        </div>
    );
  }
}


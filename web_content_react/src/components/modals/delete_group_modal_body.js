import React from "react";

const INPUT_STYLE={
  width: "100%",
  height: "50px"
}

export default class DeleteGroupModalBody extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <input className="text-center"
                     id="groupNameInput"
                     placeholder="Enter Groups's Name"
                     style={ INPUT_STYLE }/>
            </div>
            <br/><br/>
          </div><br/>
          <div class="row text-center">
            <div class="col-md-12">
              <p class="text-left">
                By confirming this group's name and clicking submit this group will be removed forever. If you
                are sure this is what you would like to do, please confirm the group name and continue.
              </p>
            </div>
          </div>
        </div>
    );
  }
}


import React from "react";

const INPUT_STYLE={
  width: "100%",
  height: "50px"
}

export default class DeleteStrategyModalBody extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <input className="text-center"
                     id="strategyNameInput"
                     placeholder="Enter Strategy's Name"
                     style={ INPUT_STYLE }/>
            </div>
            <br/><br/>
          </div><br/>
          <div class="row text-center">
            <div class="col-md-12">
              <p class="text-left">
                By confirming this strategy's name above and clicking submit below, this strategy will be deleted.  
                To continue, enter the strategy's name above and click submit.
              </p>
            </div>
          </div>
        </div>
    );
  }
}


import React from "react";
import ModalController from "../../js/ModalController"

const HEIGHT = {
  height: "64px",
  fontSize: "32px",
  marginTop: "15px"
}

export default class MakeBetModalBody extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    const bot = ModalController.getData("bidBotModal").bot;

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12 text-left">
              <h5>
                Available Balance: { " " + this.props.userInfo.availableBalance }
              </h5>
            </div>
            <br/><br/>
            <div class="col-md-12">
              <h1 className="text-secondary">
                You are bidding on <span className="text-primary">{ " " + bot.botName }</span>
              </h1>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div class="col-md-12">
              <input  type="text" 
                      id="bidInput" 
                      name="bid" 
                      class="form-control text-secondary font-weight-bold" 
                      placeholder="Insert Offer (BP)..."
                      style={ HEIGHT }/>
            </div>
            <br/>
          </div>
        </div>
    );
  }
}


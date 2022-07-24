import React from "react";
import ModalController from "../../js/ModalController";

export default class RemoveExchangeKeyModalBody extends React.Component {

  render() {

    const data = ModalController.getData("removeExchangeKeysModal");

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-12">
              <br/>
              <p>
                  You have selected to remove your api key linked to { data.exchange } exchange.  If
                  you meant to take this action, please confirm by clicking submit below.  Please note, 
                  if you have any bots running that require a dependency on this key, this action will
                  fail.  
              </p>
              <br/><br/>
            </div>
            <br/><br/>
          </div><br/>
        </div>
    );
  }
}


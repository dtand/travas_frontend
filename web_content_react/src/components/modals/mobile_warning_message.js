import React from "react";
import ModalController from "../../js/ModalController"

const INPUT_STYLE={
  width: "100%",
  height: "42px"
}

export default class MobileWarningMessage extends React.Component {

  constructor(props){
    super(props);
    this.state={
      data: undefined,
    }
  }

  render() {

    return (
        <div class="modal-body">
          <div className="row text-center">
            <div className="col-md-12">
              <br/>
              <h5 className="text-secondary">
                It looks like you are browsing Travas on your mobile device.  The Travas Platform
                is currently in the alpha phase and we do not yet have a mobile friendly version
                of our platform.  We appreciate your service and patience as we work to make 
                Travas portable to all device.  In the meantime, we suggest using the platform
                on a laptop or computer.  Click below to return to our home page: 
                <br/><br/>
                <a href="../"> RETURN </a>
                <br/><br/>
              </h5>
            </div>
            <br/><br/>
          </div><br/>
        </div>
    );
  }
}


import React from "react";
import ModalController from "../../js/ModalController"

const INPUT_STYLE={
  width: "100%",
  height: "42px"
}

export default class DemoLimitsBody extends React.Component {

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
                It looks like you're enjoying our backtesting demo.  The demo currently allows
                only 20 strategies and backtests.  To continue uninterrupted and save all your
                created strategies <a onClick={ () => {
                    const data = ModalController.getData("demoLimitsModal");
                    window.localStorage.setItem("signupData", JSON.stringify({
                      strategies: data.userStrategies,
                      archivedTests: data.archivedTests
                    }));
                    window.location = "../signup"; 
                  }
                } href="#"> sign up now for free </a>.
              </h5>
            </div>
            <br/><br/>
          </div><br/>
        </div>
    );
  }
}


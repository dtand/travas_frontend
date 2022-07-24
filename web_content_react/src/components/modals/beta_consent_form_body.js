import React from "react";
import BetaConsent from "../../js/BetaConsent";
import SimpleToggle from "../generic/simple_toggle";
import ModalController from "../../js/ModalController";

const INPUT_STYLE={
  width: "100%",
  height: "42px",
  fontSize: "12px"
}

export default class BetaConsentFormBody extends React.Component {

  constructor(props){
    super(props);
  }


  state={
    accepted: false
  }


  render() {

    const self = this;

    return (
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <div className="container beta-consent border">
                <div className="margins-10">
                  { BetaConsent }
                  </div>
                </div>
                <div className="row info-banner margin-top-5 margin-right-5 margin-left-5">
                    <p className="margins-5 text-center ">
                      <i className="fa fa-exclamation"/> Terms must be accepted to enable live trading
                    </p>
                </div>
                <div className="text-center row">
                  <div className="text-center margin-top-10 margin-left-100 ">
                    <a target="_blank" href="/Beta_Disclaimer.pdf"> 
                      <i className="fa fa-file-pdf-o"/> View PDF Version 
                    </a>
                  </div>
                  <div className="text-center margin-top-10 margin-left-10">
                      <SimpleToggle onChange={ () => { 
                                      const accepted = !self.state.accepted;
                                      self.setState({
                                        accepted: accepted
                                      });
                                      ModalController.setData("betaConsentModal",{
                                        accepted: accepted
                                      });
                                    } }
                                    active={ this.state.accepted } 
                                    label={ "Accept" }/>
                  </div>
                </div>
            </div>
            <br/>
          </div>
        </div>
    );
  }
}


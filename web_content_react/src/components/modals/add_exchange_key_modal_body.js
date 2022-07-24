import React from "react";
import IconHeader from "../generic/icon_header";
import Dropdown from "../generic/dropdown";
import ModalController from "../../js/ModalController";

const INPUT_STYLE={
  width: "100%",
  height: "42px",
  fontSize: "12px"
}

export default class AddExchangeKeyModalBody extends React.Component {

  constructor(props){
    super(props);
    this.state={
      data: undefined,
      selectedExchange: "Binance",
      publicKey: undefined,
      privateKey: undefined
    }
    this.selectExchange = this.selectExchange.bind(this);
    this.setPublicKey = this.setPublicKey.bind(this);
    this.setPrivateKey = this.setPrivateKey.bind(this);
  }

  selectExchange(exchange){
    this.setState({
      selectedExchange: exchange
    });
  }

  setPublicKey(event){
    this.setState({
      publicKey: event.target.value
    });
  }

  setPrivateKey(event){
    this.setState({
      privateKey: event.target.value
    });
  }

  componentDidUpdate(){
    ModalController.setData(
      "addExchangeKeysModal", 
      {
        privateKey: this.state.privateKey,
        publicKey: this.state.publicKey,
        exchange: this.state.selectedExchange.toLowerCase()
      }
    );
  }
  render() {

    return (
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <Dropdown id="exchangeDropdown"
                    dropdownList={ ["Binance"] }
                    mappedData={ this.props.botTemplates }
                    header={ <IconHeader iconClass="fa fa-building" textClass="text-center" header="EXCHANGES" /> }
                    onClickRow={ this.selectExchange }
                    buttonText={ this.state.selectedExchange }/>
                    <br/><br/>
              <p className="text-center">
                Please insert you private and public keys below.  When submitted your keys will
                be encrypted and stored in our database to be used for live bot activation.
              </p>
              <br/><br/>
              <input id="publicKey"
                     placeholder="Insert public key..."
                     style={ INPUT_STYLE }
                     onChange={ this.setPublicKey }/>
              <br/><br/>
              <input id="publicKey"
                    placeholder="Insert private key..."
                    style={ INPUT_STYLE }
                    onChange={ this.setPrivateKey }/>
            </div>
            <br/><br/>
          </div><br/>
        </div>
    );
  }
}


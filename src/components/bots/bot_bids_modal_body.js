
import React from "react";
import ModalController from "../../js/ModalController"
let MarketsCache = new Map();

export default class ExchangeModalBody extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
        <div class="modal-body">
          <div class="row text-center">
            <div class="col-md-8">
              <QuoteButtonGroup quotes={ this.state.quotes }
                                addQuote={ this.addQuote }
                                removeQuote={ this.removeQuote }/>
            </div>
            <br/><br/>
            <div class="col-md-4">
              <h3 id="selectedMarket" 
                  class="float-left">
                  { this.state.selectedMarket ? this.state.selectedMarket : "" }
              </h3>
            </div>
          </div>
          <FilterTable data={ data } 
                       placeholder={ "Search Markets..." }
                       onClick={ this.selectMarket }/>
          </div>
    );
  }
}


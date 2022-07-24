import React from "react";
import CryptoIcon from "../generic/crypto_coin";
import Constants from "../../js/Constants";


export default class DonateBody extends React.Component {

    constructor(props){
        super(props);

        this.btc = "3JgxnuwLS7xNxvTm257KVdi5j8kygfkfAg";
        this.eth = "0xF151E762d84250373dc78304cB57EE1c9675612e";
        this.bch = "1CaFrfyf94118aYJ4XdWqzyeRw3Z5DXicP";
        this.etc = "0xAB83E7ece139af51c7504cA7137816987fA8ed0C";
    }

    render() {
      return (
        <div>
            <div className="row text-center text-secondary">
                <div className="col-md-12">
                <br/><br/><br/>
                    <div className="col-md-12">
                        <h1>
                            Donations
                        </h1>
                    </div>
                    <div className="col-md-12 text-center">
                    <div className="container">
                        <p className="text-left margin-top-10 about body-text">
                            Travas takes donations in some of the most popular 
                            cryptocurrencies or using fiat via paypal.  If making donations
                            via cryptocurrency, please email one of our founders 
                            directly with the wallet address the donation was made from.
                            We greatly appreciate all donations, and keep track of
                            all donors in our database if desired.  Find below our cryptocurrency
                            wallet addresses and a link to our company paypal.
                        </p>
                    </div>
                    </div>
                    <br/>
                    { <div className="container col-md-12 text-left">
                            <div className="container">
                                <div className="row margin-top-10">
                                    <div className="col-md-1">
                                        <h5><CryptoIcon coinName="btc"/></h5>
                                    </div>
                                    <div className="col-md-11">
                                        <h5 className={ Constants.IS_MOBILE ? "text-md margin-top-5" : ""}> BTC: { this.btc } </h5>
                                    </div>
                                </div>
                                <br/><br/>
                                <div className="row margin-top-10">
                                    <div className="col-md-1">
                                        <h5><CryptoIcon coinName="eth"/></h5>
                                    </div>
                                    <div className="col-md-11">
                                        <h5 className={ Constants.IS_MOBILE ? "text-md margin-top-5" : ""}> ETH: { this.eth } </h5>
                                    </div>
                                </div>
                                <br/><br/>
                                <div className="row margin-top-10">
                                    <div className="col-md-1">
                                        <h5><CryptoIcon coinName="bch"/></h5>
                                    </div>
                                    <div className="col-md-11">
                                        <h5 className={ Constants.IS_MOBILE ? "text-md margin-top-5" : ""}> BCH: { this.bch } </h5>
                                    </div>
                                </div>
                                <br/><br/>
                                <div className="row margin-top-10">
                                    <div className="col-md-1">
                                        <h5><CryptoIcon coinName="etc"/></h5>
                                    </div>
                                    <div className="col-md-11">
                                        <h5 className={ Constants.IS_MOBILE ? "text-md margin-top-5" : ""}> ETC: { this.etc } </h5>
                                    </div>
                                </div>
                                <br/><br/>
                                <div className="row margin-top-10">
                                    <div className="col-md-1">
                                        <h5><CryptoIcon coinName="usd"/></h5>
                                    </div>
                                    <div className="col-md-11">
                                        <h5 className={ Constants.IS_MOBILE ? "text-md margin-top-5" : ""}> USD: <a href="https://www.paypal.me/travasresearch">PAYPAL</a> </h5>
                                    </div>
                                </div>
                                <br/><br/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
  }
}
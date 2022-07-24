import React from "react";
import NVD3Chart from "react-nvd3";
import ApiController from "../../js/ApiController";
import CSVDownloader from "../../js/CSVDownloader";
import NotificationController from "../../js/NotificationController";
import CryptoIcon from "../generic/crypto_coin";

export default class ExchangeSummary extends React.Component {


    render(){

        return <div className="container clickable exchange-summary">
            <div className="row margins-10 clickable">
                <div className="col-md-1 margin-top-25">
                    <span>
                        <CryptoIcon coinName="bnb"/>
                    </span>
                </div>
                <div className="col-md-4 margin-bottom-10 margin-top-25">
                    <h1 className="text-black">
                        { this.props.exchangeName.toUpperCase() }
                    </h1>
                </div>
            </div>
        </div> 
    }
}
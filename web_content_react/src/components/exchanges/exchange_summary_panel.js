import React from "react";
import NVD3Chart from "react-nvd3";
import ApiController from "../../js/ApiController";
import CSVDownloader from "../../js/CSVDownloader";
import NotificationController from "../../js/NotificationController";
import CryptoIcon from "../generic/crypto_coin";
import ExchangeSummary from "./exchange_summary";
import ExchangeSummaryPage from "./exchange_summary_page";

export default class ExchangeSummaryPanel extends React.Component {

    state = {
        selectedExchange: this.props.linkedExchanges.length === 1 ? this.props.linkedExchanges[0].name : undefined
    }

    /**
     * Select an exchange and update description
     */
    selectExchange = (exchange) => {
        this.setState({
            selectedExchange: exchange
        });
    }

    render(){

        //No selected exchange
        if(!this.state.selectedExchange){
            return this.props.linkedExchanges.map((exchange) => 
                <div>
                    <ExchangeSummary selectExchange={ this.selectExchange }
                                     exchangeName={ exchange.name }/>
                </div>
            );
        }

        //Selected exchange or single exchange (default)
        else{
            return <ExchangeSummaryPage wallet={ this.props.wallets.get(this.state.selectedExchange.toLowerCase()) }
                                        exchangeName={ this.state.selectedExchange }
                                        userBots={ this.props.userBots }
                                        refreshInfo={ this.props.refreshInfo }/>
        }
    }
}
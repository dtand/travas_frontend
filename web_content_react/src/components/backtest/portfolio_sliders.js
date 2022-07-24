
import React from "react";
import InputRange from 'react-input-range';
import CryptoIcon from "../generic/crypto_coin";

export default class PortfolioSiders extends React.Component {


    render(){

        const sliders = this.props.markets.map((market,i) => 
            <div className="col-md-12 text-center margins-25">
                <div className="row">
                    <div className="col-md-1 margin-left-25">
                        <CryptoIcon coinName={ market.toLowerCase() }/>
                    </div>
                    <div className="col-md-10">
                        <InputRange maxValue={ (100/this.props.markets.length) }
                                    minValue={ 0 }
                                    value={ this.props.weights[i] }
                                    onChange={ value => this.props.rebalance(Number(value),i) } />
                    </div>
                </div>
            </div>
        );

        return (<div className="container" >
            <div className="row margin-bottom-10">
                <div className="col-md-1"/>
                { sliders }
                <div className="col-md-1"/>
            </div>
        </div>);
    }
}
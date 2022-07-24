import React from "react";
import CryptoIcon from "../generic/crypto_coin";
import Constants from "../../js/Constants";

export default class BotCarouselItem extends React.Component {
    render(){

        const self = this;

        return(	
        <div className="item bot-carousel-item border margin-bottom-25">
            <div className="main-wrapper text-center">
                <br/>

                <div className="border-bottom margin-left-25 margin-right-25">
                    <strong>
                        <h5 className="margin-bottom-10">{ this.props.bot.botName.toUpperCase() }</h5>
                    </strong>
                </div>

                <br/>

                <h2 className="text-center">{
                                this.props.bot.roi < 0 ?
                                    <span className="text-danger">
                                        ↓{ (this.props.bot.roi*100).toFixed(2) + "%" }
                                    </span> :
                                    <span className="text-success">
                                        ↑{ (this.props.bot.roi*100).toFixed(2) + "%" }
                                    </span> 
                            }
                </h2>

                <br/>

                { !Constants.IS_MOBILE &&
                    <div className="row text-right">
                        <div className="col-md-1"/>
                        <div className="col-md-3 text-left margin-top-10">
                            <CryptoIcon width={ 36 } height={ 36 } coinName={ this.props.bot.market.split("-")[0].toLowerCase() }/>
                        </div>
                        <div className="col-md-7 text-left ">
                            <h4>{ this.props.bot.exchange.toUpperCase() }</h4>
                            <h5 className="margin-left-5">{ this.props.bot.market.toUpperCase() }</h5>
                            <div>
                            </div>
                        </div>
                    </div>
                }
                { Constants.IS_MOBILE &&
                    <div className="row text-center">
                        <div className="col-sm-12">
                            <h4>{ this.props.bot.exchange.toUpperCase() }</h4>
                            <h5>{ this.props.bot.market.toUpperCase() }</h5>
                        </div>
                    </div>
                }

            </div>
            
        </div>
    )}
}
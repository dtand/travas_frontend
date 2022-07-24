import React from "react";
import OwlCarousel from 'react-owl-carousel';
import Constants from "../../js/Constants";

export default class ImgCarousel extends React.Component {

    render(){
        return(	
            <div className="margin-top-50">
                <OwlCarousel className="owl-theme"
                                loop={ true }
                                margin={ Constants.IS_MOBILE ? 100: 50 }
                                stagePadding={ Constants.IS_MOBILE ? 50 : 25 }
                                items={ 1 }
                                autoplay
                                navigation={ false }
                                nav={ false }
                                pagination={ false }
                                dots={ false }>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/dashboard.png") }/>
                            <h5 className="text-white text-center">
                                Dashboard
                            </h5>
                            <p className="text-center text-white">
                                Add commonly tracked markets and follow price in real-time
                            </p>
                        </div>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/strategies.png") }/>
                            <h5 className="text-white text-center">
                                Strategy Design
                            </h5>
                            <p className="text-center text-white">
                                Create and save unique strategies by combining popular trading indicators
                            </p>
                        </div>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/bots_1.png") }/>
                            <h5 className="text-white text-center">
                                Bot Manager
                            </h5>
                            <p className="text-center text-white">
                                Manage trading bots and track performance and analytics
                            </p>
                        </div>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/bots_2.png") }/>
                            <h5 className="text-white text-center">
                                Bot Factory
                            </h5>
                            <p className="text-center text-white">
                                Create bots by combining different markets, strategies, intervals and exchanges 
                            </p>
                        </div>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/bots_3.png") }/>
                            <h5 className="text-white text-center">
                                Bot Market
                            </h5>
                            <p className="text-center text-white">
                                See the top performing bots and place bids on those you are interested in
                            </p>
                        </div>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/backtest_1.png") }/>
                            <h5 className="text-white text-center">
                                Backtest Settings
                            </h5>
                            <p className="text-center text-white">
                                Run up to five unique backtests simultaneously with different parameter settings
                            </p>
                        </div>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/backtest_2.png") }/>
                            <h5 className="text-white text-center">
                                Backtest Analysis
                            </h5>
                            <p className="text-center text-white">
                                Analyze and compare different backtest results using popular metrics
                            </p>
                        </div>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/groups.png") }/>
                            <h5 className="text-white text-center">
                                Groups
                            </h5>
                            <p className="text-center text-white">
                                Create and join groups to unlock strategy and bot sharing features
                            </p>
                        </div>
                        <div>
                            <img className="img-carousel-item margin-bottom-50" src={ require("../../img/account.png") }/>
                            <h5 className="text-white text-center">
                                Account Management
                            </h5>
                            <p className="text-center text-white">
                                Manage account settings and exchange API keys
                            </p>
                        </div>
                </OwlCarousel>
            </div>
    )}
}
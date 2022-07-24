import React from "react";

export default class HowsItWorkPanel extends React.Component {

    render(){
        return(	
            <div>
            <div className="theme-title text-center">
                <h2>How it Works</h2>
            </div>
            <div className="our-feature-two" id="services">
                <div className="container">

                    <div className="row single-block">
                        <div className="col-lg-6">
                            <div className="text">
                                <div className="number">01</div>
                                <h2 className="title"><span>Design</span> your own strategy.</h2>
                                <p>Combine different indicators to create unique strategies for different market 
                                    conditions.  Travas currently supports ten different indicators and we will be adding 
                                    new ones every month.
                                </p>
                                <a href="demo" className="learn-more">Try it now (DEMO) <i className="flaticon-right-thin"></i></a>
                            </div> 
                        </div> 
                        <div className="col-lg-6 img-box"><div className="pad-top-100"><img src={ require("../../images/responsive.png") } alt=""/></div></div>
                    </div> 

                    <div className="row single-block">
                        <div className="col-lg-6 order-lg-last">
                            <div className="text">
                                <div className="number">02</div>
                                <h2 className="title"><span>Backtest</span> your strategy.</h2>
                                <p>Compare your strategy using historical data against other strategies or different 
                                    cryptocurrency markets.  Travas currently supports four different exchanges and over 
                                    a thousand unique cryptocurrency pairs.
                                </p>
                            </div> 
                        </div> 
                        <div className="col-lg-6 order-lg-first img-box"><div><img src={ require("../../images/analytics.png") } alt=""/></div></div>
                    </div> 

                    <div className="row single-block">
                        <div className="col-lg-6">
                            <div className="text">
                                <div className="number">03</div>
                                <h2 className="title"><span>Forward</span> test your strategy.</h2>
                                <p>Build and deploy a crypto trading bot using fake money in real-time to test your strategy in live market conditions.</p>
                                <a href="signup" className="learn-more">Sign up to make your first bot <i className="flaticon-right-thin"></i></a>
                            </div> 
                        </div> 
                        <div className="col-lg-6 img-box"><div><img src={ require("../../images/bar-chart.png") } alt=""/></div></div>
                    </div> 


                    <div className="row single-block">
                        <div className="col-lg-6 order-lg-last">
                            <div className="text">
                                <div className="number">04</div>
                                <h2 className="title"><span>Deploy</span> your bot in realtime</h2>
                                <p>Link your trading bot to one of many supported exchanges, and begin trading with real money.
                                </p>
                                <a href="bots" className="learn-more">Check out some of our bots here <i className="flaticon-right-thin"></i></a>
                            </div> 
                        </div> 
                        <div className="col-lg-6 img-box">
                            <div className="pad-top-100"><img src={ require("../../images/tech-support.png") } alt=""/></div>
                        </div>
                    </div> 
                    
                </div> 
            </div> 
        </div>
 
    )}
}
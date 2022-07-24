import React from "react";

export default class WhyAutomatePanel extends React.Component {

    render(){
        return(	
            <div className="our-features-one" id="features">
            <div className="container">
                <div className="theme-title">
                    <h2>The All-In-One Automated Approach <br/> to <span>Cryptocurrency Trading</span></h2>
                </div>
                <div className="row">
                    <div className="col-md-4 col-xs-12">
                        <div className="single-feature">
                            <i className="feature-icon fa fa-globe"/>
                            <h3>24/7 Market Monitoring</h3>
                            <p>Crypto markets trade 24/7.  Automating your strategy can give you a huge
                                advantage in this environment.
                            </p>
                        </div> 
                    </div> 
                    <div className="col-md-4 col-xs-12">
                        <div className="single-feature border-fix">
                            <i className="feature-icon fa fa-tv"/>
                            <h3>Consistency</h3>
                            <p>Our trading bots execute their strategies exactly as designed with prestine accuracy.  As 
                               long as the exchange is trading, our bots are running. </p>
                        </div> 
                    </div> 
                    <div className="col-md-4 col-xs-12">
                        <div className="single-feature">
                            <i className="feature-icon fa fa-cubes"/>
                            <h3>Advanced Functions</h3>
                            <p>Add advanced functions on top of your current trading strategies, such as trailing stop
                               losses and complex indicators.
                            </p>
                        </div> 
                    </div> 
                </div> 
                <div className="row">
                    <div className="col-md-2"/>
                    <div className="col-md-4 col-xs-12">
                        <div className="single-feature">
                            <i className="feature-icon fa fa-sliders"/>
                            <h3>Unique Customization</h3>
                            <p> We are constantly expanding our arsenal of trading signals.
                                Travas provides you with a toolbox full of different indicators to build
                                and deploy unique trading strategies. 
                            </p>
                        </div> 
                    </div> 
                    <div className="col-md-4 col-xs-12">
                        <div className="single-feature">
                            <i className="feature-icon fa fa-sitemap"/>
                            <h3>Network</h3>
                            <p>
                                Tap into our network and bot marketplace to gain key insights into
                                profitable trading strategies each day.
                            </p>
                        </div> 
                    </div> 
                    <div className="col-md-2"/>
                </div> 
            </div> 
        </div> 
    )}
}
import React from "react";
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';
import Constants from "../../js/Constants";

export default class BetaStatisticsPanel extends React.Component {

    state={
        playAnimation: false,
        animationCount: 0
    }

    calculateDuration(start,finish,speed){
        return (finish/start) / speed;
    }

    render(){
        const self = this;
        return(	
            <div className="our-features-one theme-counter">
                    <div className="container">
                        <div className="bg-image">
                            <div className="row theme-title">
                                <div className="col-lg-6 order-lg-last">
                                    <h2><span>Platform</span> Beta Statistics.</h2>
                                </div>
                                <div className="col-lg-6 order-lg-first">
                                    { Constants.IS_MOBILE && 
                                        <p style={ { 
                                            padding: 0,
                                            textAlign: "center"
                                        } }>
                                            We're growing quickly - see below how many people are using our services
                                        </p>
                                    }
                                    { !Constants.IS_MOBILE && 
                                        <p>
                                            We're growing quickly - see below how many people are using our services
                                        </p>
                                    }
                                </div>
                            </div>

                            { !Constants.IS_MOBILE &&
                                <ScrollTrigger onEnter={ () => {
                                        self.setState({
                                        playAnimation: true,
                                        animationCount: 1
                                    });
                                } }>
                                <div className="counter-wrapper">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <h1 className="number">
                                            { this.state.playAnimation &&
                                                <CountUp start={ 0 } 
                                                    className="number"
                                                    end={ this.props.alphaUsers }
                                                    duration={ this.calculateDuration(1,this.props.alphaUsers,) }
                                                    decimal=","
                                                    >
                                                </CountUp>
                                            }{ this.state.animationCount === 0 &&
                                                0
                                            }
                                            </h1>

                                            <p>Total Users</p>
                                        </div>
                                        <div className="col-sm-4">
                                        <h1 className="number">
                                            { this.state.playAnimation &&
                                                <CountUp start={ 0 } 
                                                    className="number"
                                                    end={ this.props.activeBots }
                                                    duration={ this.calculateDuration(1,this.props.activeBots,) }
                                                    decimal=","
                                                    >
                                                </CountUp>
                                            }{ this.state.animationCount === 0 &&
                                                0
                                            }
                                            </h1>
                                            <p>Active Bots</p>
                                        </div>
                                        <div className="col-sm-4">
                                        <h1 className="number">
                                            { this.state.playAnimation &&
                                                <CountUp start={ 0 } 
                                                    className="number"
                                                    end={ this.props.tradesCount }
                                                    duration={ this.calculateDuration(1,this.props.tradesCount,) }
                                                    decimal=","
                                                    >
                                                </CountUp>
                                            }{ this.state.animationCount === 0 &&
                                                0
                                            }
                                        </h1>
                                            <p>Total Trades</p>
                                        </div>
                                    </div>
                                </div> 
                            </ScrollTrigger>
                        }{ Constants.IS_MOBILE &&
                            <div className="counter-wrapper">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <h1 className="number">
                                             { this.props.alphaUsers }
                                            </h1>
                                            <p>Total Users</p>
                                        </div>
                                        <div className="col-sm-4">
                                            <h1 className="number">
                                             { this.props.activeBots }
                                            </h1>
                                            <p>Active Bots</p>
                                        </div>
                                        <div className="col-sm-4">
                                            <h1 className="number">
                                             { this.props.tradesCount }
                                            </h1>
                                            <p>Total Trades</p>
                                        </div>
                                    </div>
                                </div> 
                        }
                        </div> 
                    </div> 
                </div> 
    )}
}
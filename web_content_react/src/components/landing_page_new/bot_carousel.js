import React from "react";
import OwlCarousel from 'react-owl-carousel';
import BotCarouselItem from "./bot_carousel_item";
import Constants from "../../js/Constants";

export default class dBotCarousel extends React.Component {

    render(){

        return(	
            <div className="margin-top-50 margin-bottom-50 margin-left-10 margin-right-10">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h2>Top Performing Bots Trading Now</h2>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="container col-md-12 text-center">
                    <p className="text-secondary">
                        <i>
                            All trading bots shown here are created by our users.
                            As such, <br/>
                            no strategies will be disclosed. <a href="/bots">For more information on our trading bots and strategies click here </a>.
                            Results are hypothetical and trading is risky.
                        </i>
                    </p>
                    </div>
                </div>
                { this.props.bots.length != 0 && 
                    <div className="margin-top-100 margin-bottom-100">
                        <OwlCarousel className="owl-theme"
                                        loop={ true }
                                        margin={ 50 }
                                        stagePadding={ 25 }
                                        items={ Constants.IS_MOBILE ? 1 : 4 }
                                        autoplay
                                        navigation={ false }
                                        nav={ false }
                                        pagination={ false }
                                        dots={ false }>
                                { this.props.bots[0] && <BotCarouselItem bot={ this.props.bots[0] }/> }
                                { this.props.bots[1] && <BotCarouselItem bot={ this.props.bots[1] }/> }
                                { this.props.bots[2] && <BotCarouselItem bot={ this.props.bots[2] }/> }
                                { this.props.bots[3] && <BotCarouselItem bot={ this.props.bots[3] }/> }
                                { this.props.bots[4] && <BotCarouselItem bot={ this.props.bots[4] }/> }
                                { this.props.bots[5] && <BotCarouselItem bot={ this.props.bots[5] }/> }
                                { this.props.bots[6] && <BotCarouselItem bot={ this.props.bots[6] }/> }
                                { this.props.bots[7] && <BotCarouselItem bot={ this.props.bots[7] }/> }
                                { this.props.bots[8] && <BotCarouselItem bot={ this.props.bots[8] }/> }
                                { this.props.bots[9] && <BotCarouselItem bot={ this.props.bots[9] }/> }
                        </OwlCarousel>
                    </div>
                }
            </div>
    )}
}
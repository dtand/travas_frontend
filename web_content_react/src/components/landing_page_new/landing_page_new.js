import React from "react";
import Header from "./header";
import DisplayPanel from "./display_panel";
import BotCarousel from "./bot_carousel";
import WhyAutomatePanel from "./why_automate_panel";
import HowsItWorkPanel from "./hows_it_work_panel";
import BetaPanel from "./beta_panel";
import BetaStatisticsPanel from "./beta_statistics_panel";
import ContactUsPanel from "./contact_us_panel";
import Footer from "./footer";
import RoadmapCarousel from "./roadmap_carousel";
import ApiController from "../../js/ApiController";
import Constants from "../../js/Constants";
import HeaderMobile from "./header_mobile";

const INTERVAL = 60000;

export default class LandingPageNew extends React.Component {

    constructor(props){

        super(props);

        this.state = {
            alpha_users: 0,
            active_bots: 0,
            trades_count: 0,
            bot_leaderboard: []
        }

        this.updateAlphaSummary = this.updateAlphaSummary.bind(this);
    }

    /**
     * Takes in alpha_summary response and updates component state
     * @param {object} fields 
     */
    async updateAlphaSummary(fields) {
        if(fields.botLeaderboard.length != 0){
            this.setState({
                alpha_users: fields.alphaUsersCount,
                active_bots: fields.activeBotsCount,
                trades_count: fields.tradesCount,
                bot_leaderboard: Constants.IS_MOBILE ? fields.botLeaderboard.slice(0,10) : fields.botLeaderboard.slice(0,10)
            }
            )
        }
        else{
            this.setState({
                alpha_users: fields.alphaUsersCount,
                active_bots: fields.activeBotsCount,
                trades_count: fields.tradesCount
            }
            )
        }

    }

    componentDidMount() {
        const self = this;
        ApiController.doGet("alpha_summary", self.updateAlphaSummary);
        setInterval(function(){
            ApiController.doGet("alpha_summary", self.updateAlphaSummary);
        }, INTERVAL
        );
    }

    render(){
        return(	
        <div>

            <div className="html-top-content landing-page-styles">
                <div className="theme-top-section">
                { Constants.IS_MOBILE ? <HeaderMobile/> : <Header/> }
                    <div>
                        <DisplayPanel/>
                        <div className={ Constants.IS_MOBILE ? "" : "margin-left-100 margin-right-100" }>
                            <BotCarousel bots={ this.state.bot_leaderboard }/>
                        </div>
                    </div> 
                </div> 

                <WhyAutomatePanel/>

                <br/><br/><br/><br/><br/>

                <HowsItWorkPanel/>

                <BetaPanel/>

                <BetaStatisticsPanel alphaUsers={ this.state.alpha_users }
                                     tradesCount={ this.state.trades_count }
                                     activeBots={ this.state.active_bots }/>

                <ContactUsPanel id="contact"/>

                <Footer/>

                <button className="scroll-top tran3s color-one-bg">
                    <i className="fa fa-long-arrow-up" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    )}

}
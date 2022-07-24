import React from "react";
import SocialMedia from "../generic/social_media";
import AlphaSummary from "./alpha_summary";
import Banner from "../generic/banner";
import ApiController from "../../js/ApiController";
import JoinAlphaButton from "./join_alpha_button";
import AnchorLink from 'react-anchor-link-smooth-scroll'
import PlatformLandingBotsDisplay from "./platform_landing_bots_display";
import Constants from "../../js/Constants";

const INTERVAL = 60000;

const BODY_BACKGROUND = {
    backgroundColor: "white"
}

const BODY_MARGINS = {
    marginTop: "4px",
    marginLeft: "40px",
    marginRight: "40px"
}

const BANNER_LINK = {
    color: "white"
}

const INNER_MARGINS = {
    marginTop: "50px"
}

const MARGINS_ALPHA = {
    marginTop: "50px"
}

const MARGINS_BANNER = {
    marginTop: "50px",
    marginBottom: "25px"
}

const MARGINS_BANNER_MOBILE = {
    marginTop: "25px",
    marginBottom: "25px"
}

export default class PlatformLandingBody extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            alpha_users: '',
            active_bots: '',
            trades_count: '',
            botLeaderboard: undefined
          };
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
            botLeaderboard: Constants.IS_MOBILE ? fields.botLeaderboard.slice(0,50) : fields.botLeaderboard.slice(0,50)
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

  /**
   * Called on mount to update state
   */
  componentDidMount() {
    const self = this;
    ApiController.doGet("alpha_summary", self.updateAlphaSummary);
    setInterval(function(){
        ApiController.doGet("alpha_summary", self.updateAlphaSummary);
      }, INTERVAL
    );
  }

  render() {
      return (
        <div style={ BODY_BACKGROUND }>
            <div className="row text-center text-secondary" style={ BODY_MARGINS }>
                <br/><br/><br/>
                    <div className="col-md-12 border-bottom" style={ INNER_MARGINS }>
                        <h1>
                            UNLOCK THE POWER OF <br/>
                            <span className="text-primary">
                                ALGORITHMIC CRYPTO TRADING
                            </span> TODAY.
                        </h1>
                    </div>
                    <div className="col-md-12 margin-top-15 text-center">
                        <SocialMedia/>
                    </div>
                    <div style={ Constants.IS_MOBILE ? {} : MARGINS_ALPHA }>
                        <AlphaSummary users={ this.state.alpha_users }
                                      bots={ this.state.active_bots }
                                      trades={ this.state.trades_count }/>
                    </div>
                    <br/>
                    <br/>
            </div>
            { !Constants.IS_MOBILE &&
                <div className="text-center center">
                    <strong className="text-secondary"
                            style={ {
                                fontSize: "24px",
                                marginRight: "10px",
                                marginBottom: "10px"
                            } }>
                        JOIN FREE TODAY
                    </strong> 
                    <br/><br/>
                    <JoinAlphaButton text="SIGNUP (ALPHA)"/>
                </div>
            }
            <div className="text-center overflow-x-hidden" style={ Constants.IS_MOBILE ? MARGINS_BANNER_MOBILE : MARGINS_BANNER }>
                { !Constants.IS_MOBILE && <Banner backgroundColor="#1579f6" 
                        textColor="white" 
                        message={ 
                            <div>
                              <a href="demo" style={ BANNER_LINK }>TRY IT NOW - test our historical cryptocurrency backtesting service for free GO >></a>
                            </div>
                        }/>
                }
                 { Constants.IS_MOBILE && <Banner backgroundColor="#1579f6" 
                        textColor="white" 
                        message={ 
                            <div>
                              <a href="signup" style={ BANNER_LINK }>SIGN UP FOR OUR OPEN ALPHA TODAY (FREE) GO >></a>
                            </div>
                        }/>
                }
            </div>
            <div id="lower" className="col-md-12 text-center margin-25-left text-secondary">
                <i>
                    See the top performing bots other users are running <a className="smooth-scroll" href='#lower'><i className="fa fa-hand-o-down"/></a>
                </i>
                <br/><br/><br/>

            </div>
            <PlatformLandingBotsDisplay botLeaderboard={ this.state.botLeaderboard }/>
        </div>
    );
  }
}
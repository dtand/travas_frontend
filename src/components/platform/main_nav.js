import React from "react";
import SideNav from "./side_nav";
import NavTicker from "./nav_ticker";
import PlatformBanner from "../generic/platform_banner";
import SessionManager from "../../js/SessionManager";
import Constants from "../../js/Constants";
import ApiController from "../../js/ApiController";
import NotificationController from "../../js/NotificationController";

export default class MainNav extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
      const self = this;
      return (
        <div className={ Constants.IS_NIGHTMODE ? "night-theme" : "" }>
 
        <header className={ Constants.IS_NIGHTMODE ? "theme-main-menu fixed night-theme" : "theme-main-menu fixed" }>
          <div className="menu-wrapper clearfix">
              <div className="logo">
                <div className="row margin-left-50">
                  <a className="prop-up-big" href="./"><img src={ require("../../img/travas_logo.png") }/></a>
                <div className="pad-top-10 margin-right-100">
                  <nav className="margin-left-25 navbar navbar-expand-lg" id="mega-menu-holder">
                              <div className="container">
                  { this.props.tickers && 

                      <ul className="navbar-nav">
                      <NavTicker updateTicker={ this.props.updateTicker && 
                                                this.props.updateTicker-1 === 0 }
                                ticker={ this.props.tickers[0] }/>

                      <NavTicker updateTicker={ this.props.updateTicker && 
                                                this.props.updateTicker-1 === 1 }
                                ticker={ this.props.tickers[1] }/>

                      <NavTicker updateTicker={ this.props.updateTicker && 
                                                this.props.updateTicker-1 === 2 }
                                ticker={ this.props.tickers[2] }/>

                      <NavTicker updateTicker={ this.props.updateTicker && 
                                                this.props.updateTicker-1 === 3 }
                                ticker={ this.props.tickers[3] }/>

                      <NavTicker updateTicker={ this.props.updateTicker && 
                                                this.props.updateTicker-1 === 4 }
                                ticker={ this.props.tickers[4] }/>
                                
                    </ul>

                  }
                  </div>
                  </nav>
                  <div className="text-secondary margin-right-25 float-right right-widget celarfix clickable">
                    <div className="login-button"><a href="./" onClick={ 
                        SessionManager.endSession
                    }>Logout <i className="flaticon-right-thin"></i></a></div>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </header>
        <header className={ Constants.IS_NIGHTMODE ? "navbar navbar-expand-lg navbar-dark night-theme bg-dark fixed-top" : 
          "navbar navbar-expand-lg navbar-dark bg-dark fixed-top" 
        }
              id="mainNav">
        <SideNav username={ this.props.username }
                 selectedService={ this.props.selectedService }
                 selectService={ this.props.selectService }
                 toggleNav={ this.props.toggleNav }
                 toggled={ this.props.toggled }
                 updateAfterProfile={ this.props.updateAfterProfile }/>
        </header>
         { this.props.email &&
            <PlatformBanner message={
              <a className="text-white" target="_blank" href="https://www.travas.io/blog/guide-to-live-trading/">
                Live trading is now available! Click here to learn how to get started.
              </a> }
            bannerType="banner-info" 
            email={ this.props.email }/>
          }
          { this.props.verified !== undefined && 
            this.props.email &&
            !this.props.verified && 
            <PlatformBanner message={
                <a className="text-white" href="#" onClick={ () => { 
                  self.setState({
                    hide: true
                  });
                  ApiController.doPostWithToken(
                      "resend_verification",
                      {
                        email: self.props.email
                      },
                      function(response){
                        NotificationController.displayNotification(
                            "EMAIL SENT",
                            response.message,
                            "info"
                        );
                      }
                  );
              } }>
            Your account has not been verified yet, click here to resend verification email.
          </a> }bannerType="banner-warning" email={ this.props.email }/>
          }
        </div>
      );
    }
  }
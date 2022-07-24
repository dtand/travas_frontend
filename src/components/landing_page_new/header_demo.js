import React from "react";
import NavTicker from "../platform/nav_ticker";
import Constants from "../../js/Constants";

export default class HeaderDemo extends React.Component {

    state = {
        selectedNav: 0,
        navbarToggler: false,
    }

    render(){
        const self = this;
        return(	
        
        <header className={ "theme-main-menu fixed" }>
            <div className="menu-wrapper clearfix">
              <div className="logo">
                <div className={ "row margin-left-50" }>
                    <a className="prop-up-big" href="./"><img src={ require("../../img/travas_logo.png") }/></a>
                <div className="pad-top-10 margin-right-100">
                  <nav className="margin-left-50 navbar navbar-expand-lg" id="mega-menu-holder">
                    <div className="container">
                  { this.props.tickers && !Constants.IS_MOBILE &&

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
                                                        { Constants.IS_MOBILE && 
                                            <li className="nav-item">
                                                <a className="nav-link" href="demo">Demo</a>
                                            </li>
                                    }
                    </ul>
                  }
                  </div>
                  </nav>
                  <div className="text-secondary margin-right-25 float-right right-widget celarfix clickable prop-up">
                    <div className="login-button"><a href="login">Login <i className="flaticon-right-thin"></i></a></div>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </header>
    )}
}
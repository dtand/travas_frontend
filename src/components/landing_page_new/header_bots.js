import React from "react";
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Constants from "../../js/Constants";

export default class HeaderBots extends React.Component {

    state = {
        selectedNav: 0,
        navbarToggler: false,
    }

    render(){
        const self = this;
        return(	
        
        <header className="theme-main-menu fixed">
                <div className="menu-wrapper clearfix">
                    <div className="logo-bots">
                        <div className={ Constants.IS_MOBILE ? "row" : "row margin-left-100" }>
                            <a href="./"><img src={ require("../../img/travas_logo.png") }/></a>
                        </div>
                    </div>
                    
                    <div className="pad-top-10 margin-right-100">
                        <ul className="right-widget celarfix">
                            <li className="login-button"><a href="login">Login <i className="flaticon-right-thin"></i></a></li>
                        </ul> 
                        
                        <nav className="navbar navbar-expand-lg" id="mega-menu-holder">
                            <div className="container">
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation" 
                                onClick={ () => { 
                                    self.setState({
                                        navbarToggler: !self.state.navbarToggler
                                    });
                                } }>
                                <i className="fa fa-bars" aria-hidden="true"></i>
                                </button>
                                <div  className={ Constants.IS_MOBILE && self.state.navbarToggler ? 
                                                    "collapse navbar-collapse show" : 
                                                    "collapse navbar-collapse"
                                               }  id="navbarResponsive">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <a href="#" 
                                           className={ this.props.period === "All Time" ?"nav-link  js-scroll-trigger active" : "nav-link" } 
                                            onClick={ () => { 
                                            self.setState({
                                                selectedNav: 0
                                            });
                                            this.props.selectLeaderboard("All Time") 
                                        } }>All Time</a>
                                    </li>
                                    <li className="nav-item">
                                    <a href="#" 
                                        className={ this.props.period === "Monthly" ? "nav-link  js-scroll-trigger active" : "nav-link" } 
                                        onClick={ () => { 
                                        self.setState({
                                            selectedNav: 1
                                        });                                        
                                        this.props.selectLeaderboard("Monthly") 
                                    } }>Monthly</a>
                                    </li>
                                    <li className="nav-link"  className="nav-item">
                                    <a href="#" 
                                        className={ this.props.period === "Weekly" ? "nav-link  js-scroll-trigger active" : "nav-link" } 
                                        onClick={ () => { 
                                        self.setState({
                                            selectedNav: 2
                                        });     
                                        this.props.selectLeaderboard("Weekly") 
                                    } }>Weekly</a>
                                    </li>
                                    <li  className="nav-link" className="nav-item">
                                    <a href="#" 
                                        className={ this.props.period === "Daily" ? "nav-link  js-scroll-trigger active" : "nav-link" } 
                                        onClick={ () => { 
                                        self.setState({
                                            selectedNav: 3
                                        });     
                                        this.props.selectLeaderboard("Daily") 
                                    } }>Daily</a>
                                    </li>
                                    { !Constants.IS_MOBILE &&
                                    <li className="nav-item" onMouseLeave={ () => { 
                                                        self.setState({
                                                            showMenu: false
                                                        });
                                                    } }>
                                        <a className="nav-link" href="#" onMouseEnter={ () => { 
                                            self.setState({
                                                showMenu: true
                                            });
                                        } }>
                                            Company <i className="fa fa-caret-down"/>
                                        </a>
                                        { self.state.showMenu &&
                                            <div className="float-right">
                                                <div width="64" className="nav-dropdown">
                                                    <a className="dropdown-item" href="demo">Demo</a>
                                                    <a className="dropdown-item" href="team">Team</a>
                                                    <a className="dropdown-item" href="https://travas.io/blog">Blog</a>
                                                    <a className="dropdown-item" href="donate">Donate</a>
                                                    <a className="dropdown-item" href="faq">Faq</a>
                                                </div>
                                            </div>
                                        }
                                    </li> }
                                    { Constants.IS_MOBILE && 
                                            <li className="nav-item">
                                                <a className="nav-link" href="demo">Demo</a>
                                            </li>
                                    }
                                    { Constants.IS_MOBILE && 
                                            <li className="nav-item">
                                                <a className="nav-link" href="team">Team</a>
                                            </li>
                                    }
                                    { Constants.IS_MOBILE && 
                                            <li className="nav-item">
                                                <a className="nav-link" href="https://travas.io/blog">Blog</a>
                                            </li>
                                    }
                                    { Constants.IS_MOBILE && 
                                            <li className="nav-item">
                                                <a className="nav-link" href="donate">Donate</a>
                                            </li>
                                    }
                                    { Constants.IS_MOBILE && 
                                            <li className="nav-item">
                                                <a className="nav-link" href="faq">Faq</a>
                                            </li>
                                    }
                                </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
            </div> 
        </header>
    )}
}
import React from "react";
import Constants from "../../js/Constants";

export default class HeaderMobile extends React.Component {
    state = {
        isTop: true && !Constants.IS_MOBILE,
        selectedNav: -1,
        navbarToggler: false,
    };
    
    render(){

        const self = this;
        return(	
        
        <header className="theme-main-menu fixed">
                <div className="menu-wrapper clearfix">
                    <div className="logo">
                        <div className="row">
                            <a href="./"><img src={ require("../../img/travas_logo.png") }/></a>
                        </div>
                    </div>
                    
                    <div className="pad-top-10 margin-right-100">
                        <ul className="right-widget celarfix">
                            <li className="login-button"><a href="login">Login <i className="flaticon-right-thin"></i></a></li>
                        </ul> 
                        
                        <nav className="navbar navbar-expand-lg" id="mega-menu-holder">
                            <div className="container">
                                <button className="navbar-toggler"
                                        onClick={ () => { 
                                            self.setState({
                                                navbarToggler: !self.state.navbarToggler
                                            });
                                        } }>
                                    <i className="fa fa-bars" aria-hidden="true"></i>
                                </button>
                                <div className={ self.state.navbarToggler ? 
                                                    "collapse navbar-collapse show" : 
                                                    "collapse navbar-collapse"
                                               } 
                                     id="navbarResponsive">
                                <ul className="navbar-nav">

                                        <li className="nav-item">
                                            <a className="nav-link" href="login">Login</a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" href="signup">Signup</a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" href="bots">Bots</a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" href="demo">Demo</a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" href="team">Team</a>
                                        </li>
    
                                        <li className="nav-item">
                                            <a className="nav-link" href="https://travas.io/blog">Blog</a>
                                        </li>
                
                                        <li className="nav-item">
                                            <a className="nav-link" href="donate">Donate</a>
                                        </li>
        
                                        <li className="nav-item">
                                            <a className="nav-link" href="faq">Faq</a>
                                        </li>
                                </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
            </div> 
        </header>
    )}
}
import React from "react";
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SignupMailList from "../signup/signup_mail_list";
export default class Footer extends React.Component {

    render(){
        return(	
            <footer className="theme-footer">
            <div className="margin-left-100 margin-right-100">
                <div className="inner-wrapper">
                    <div className="top-footer-data-wrapper">
                        <div className="row">
                            <div className="col-sm-4 footer-logo">
                                { /** <div className="logo"><a href="./" className="logo-link">TRAVAS</a></div> **/ }
                                <img src={ require("../../img/travas_no_logo.png") }/>
                                <br/><br/>
                                <h6>support@travas.io</h6>
                                <br/>
                                <p>
                                    2131 W Republic RD <br/>
                                    Suite 230 <br/>
                                    Springfield, MO 65807 <br/>
                                </p>
                            </div> 
                            <div className="col-sm-3 footer-list">
                                <h4 className="title">Quick Links</h4>
                                { window.location.pathname === "/" &&
                                    <ul>
                                        <li><AnchorLink href="#features">How it Works</AnchorLink></li>
                                        <li><AnchorLink href="#services">Services</AnchorLink></li>
                                        <li><AnchorLink href="#beta">Beta</AnchorLink></li>
                                        <li><AnchorLink href="#roadmap">Roadmap</AnchorLink></li>
                                        <li><AnchorLink href="#contact">Contact</AnchorLink></li>
                                    </ul>
                                }{ window.location.pathname !== "/" &&
                                <ul>
                                    <li><a href="./#features">How it Works</a></li>
                                    <li><a href="./#services">Services</a></li>
                                    <li><a href="./#beta">Beta</a></li>
                                    <li><a href="./#roadmap">Roadmap</a></li>
                                    <li><a href="./#contact">Contact</a></li>
                                </ul>
                                }
                            </div> 
                            <div className="col-sm-3 footer-list">
                                <h4 className="title">Company</h4>
                                <ul>
                                    <li><a href="demo">Demo</a></li>
                                    <li><a href="team">Team</a></li>
                                    <li><a href="https://travas.io/blog">Blog</a></li>
                                    <li><a href="donate">Donate</a></li>
                                    <li><a href="faq">FAQ</a></li>
                                </ul>
                            </div> 
                        </div> 
                        <br/><br/>
                        <span>*Some data provided by <a className="nav-item" href="https://p.nomics.com/cryptocurrency-bitcoin-api">Nomics.com Cryptocurrency Market Data API.</a></span>
                    </div> 

                    <div className="bottom-footer clearfix">
                        <p className="text-left"> © 2018-2019 Travas™ All Rights Reserved | { " " }
                        <a className="dark-link" href="tos.pdf">Terms</a> 
                        { " & " } 
                        <a className="dark-link" href="privacy.pdf">Privacy</a> </p>
                    </div> 
                </div>
            </div> 
        </footer>
    )}
}
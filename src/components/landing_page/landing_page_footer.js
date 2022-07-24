import React from "react";
import SocialMediaFooter from "./social_media_footer";
import SignupMailList from "../signup/signup_mail_list";

export default class LandingPageFooter extends React.Component {

    constructor(props){
      super(props);
    }

    render() {
        return(
        <footer className="page-footer font-small bg-footer pt-4 text-white">
          <div className="container-fluid text-center text-md-left">
            <div className="row margin-top-15 margin-bottom-15">
              <div className="col-md-6">
                <h3 className="text-uppercase">Travas, Inc</h3>
                <SocialMediaFooter/>
                <SignupMailList/>
                <span class="margin-top-15">Some or all data provided by <br/> <a className="footer-item" href="https://p.nomics.com/cryptocurrency-bitcoin-api">Nomics.com Cryptocurrency Market Data API.</a></span>
                <br/><br/>
              </div>
              <hr class="clearfix w-100 d-md-none pb-3"/>
              <div class="col-md-3 mb-md-0 mb-3">
                  <h5 class="text-uppercase">Company</h5>
                  <ul class="list-unstyled">
                    <li>
                      <a className="footer-item" href="about">About</a>
                    </li>
                    <li>
                      <a className="footer-item" href="roadmap">Roadmap</a>
                    </li>
                    <li>
                      <a className="footer-item" href="demo">Backtest Demo</a>
                    </li>
                    <li>
                      <a className="footer-item" href="https://travas.io/blog">Blog</a>
                    </li>
                    <li>
                      <a className="footer-item" href="donate">Donate</a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-3 mb-md-0 mb-3">
                  <h5 className="text-uppercase">Contact</h5>
                  <ul className="list-unstyled">
                    <li className="border-bottom">
                      <p>
                        2131 W Republic RD <br/>
                        Suite 230 <br/>
                        Springfield, MO 65807
                      </p>
                    </li>
                    <div className="margin-top-5">
                      <li>
                        <span>Support@travas.io</span>
                      </li>
                      <li>
                        <a className="footer-item" href="https://travas.io/blog/contact">Direct Form</a>
                      </li>
                    </div>
                  </ul>
                </div>
            </div>
          </div>
    </footer>);
    }
}
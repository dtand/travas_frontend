import React from "react";
import SessionManager from "../../js/SessionManager";
import TeamBody from "../landing_pages/team_body";
import RoadmapBody from "../landing_pages/roadmap_body";
import DonateBody from "../landing_pages/donate_body";
import FAQBody from "../landing_pages/faq_body";

const NAV_STYLE = {
    marginTop: "5px",
    marginRight: "5px",
    display: "inline"
}

export default class PlatformLandingNavMobile extends React.Component {

    constructor(props){
        super(props);
        this.state={
            menu: false
        }
        this.toggleMenu = this.toggleMenu.bind(this);
        this.selectAboutUs = this.selectAboutUs.bind(this);
        this.selectRoadmap = this.selectRoadmap.bind(this);
        this.selectDonate  = this.selectDonate.bind(this);
        this.selectFAQ     = this.selectFAQ.bind(this);
        this.selectBots    = this.selectBots.bind(this);
    }

    toggleMenu(){
        this.setState({
            menu: !this.state.menu
        });
    }
    

    selectPlatform(){
        if(SessionManager.getSessionToken()){
            window.location = "dashboard";
        }
        else{
            window.location = "login";
        }
        this.setState( { menu: false } );
    }

    selectAboutUs(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "about";
        }
        else{
            this.props.updateBody(
                <TeamBody/>
            );
        }
        this.setState( { menu: false } );
    }

    selectRoadmap(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "roadmap";
        }
        else{
            this.props.updateBody(
                <RoadmapBody/>
            );
        }
        this.setState( { menu: false } );
    }

    selectDonate(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "donate";
        }
        else{
            this.props.updateBody(
                <DonateBody/>
            );
        }
        this.setState( { menu: false } );
    }

    selectBots(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "../#lower";
        }
        else{
            window.location = "#lower";
        }
        this.setState( { menu: false } );
    }

    selectFAQ(){
        if(window.location.href.indexOf("demo") >= 0){
            window.location = "faq";
        }
        else{
            this.props.updateBody(
                <FAQBody/>
            );
        }
        this.setState( { menu: false } );
    }

    
    render() {
        const self = this;
        const lower = document.getElementById("lower");
      return (
        <div className="margin-top-10">
            <ul className="list-group list-group-horizontal" 
                style={ NAV_STYLE }>
                <span onClick={ this.toggleMenu }
                   className="text-white clickable">
                    <i className="fa fa-users"/> MENU { this.state.menu ? 
                        <i className="fa fa-angle-up"/> : 
                        <i className="fa fa-angle-down"/> 
                    }
                </span>
                { this.state.menu && 
                        <div className="float-right border rounded" 
                             style={ 
                                 { width: (window.innerWidth+5),
                                   maxHeight: window.innerHeight/1.1,
                                   overflowY: "auto",
                                   backgroundColor: "white", 
                                   position: "absolute", 
                                   marginRight:"-5px",
                                   transition: "opacity 2s",
                                   opacity: 1,
                                   marginTop: "15px" } }>
                          <table className="table text-left text-secondary">
                            <tbody>
                                <tr>
                                    <td onClick={ () => { window.location = "login"; self.setState( { menu: false } ); } }
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-sign-in"/> LOGIN
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ () => { window.location = "signup"; self.setState( { menu: false } ); } }
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-user-plus"/> SIGNUP
                                    </td>
                                </tr>
                                { lower && <tr>
                                 <td onClick={ this.selectBots }
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-cogs"/> BOTS
                                    </td>
                                </tr> }
                                <tr>
                                    <td onClick={ () => { window.location = "alpha"; self.setState( { menu: false } ); } }
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-dashboard"/> PLATFORM
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ () => { window.location = "demo"; self.setState( { menu: false } ); } }
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-area-chart"/> DEMO
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ this.selectAboutUs }
                                        className="nav-item-dropdown-item clickable">
                                      <i className="fa fa-building-o"/> ABOUT US
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ this.selectRoadmap }
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-map"/>  ROADMAP
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ this.selectDonate }
                                        className="nav-item-dropdown-item clickable">
                                    <i className="fa fa-thumbs-up"/>    DONATE
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ this.selectFAQ } 
                                        className="nav-item-dropdown-item clickable">
                                        <i className="fa fa-info"/>  FAQ
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ () => { window.location = "https://travas.io/blog" } }
                                        className="nav-item-dropdown-item clickable">
                                      <i className="fa fa-book"/>    BLOG
                                    </td>
                                </tr>
                                <tr>
                                    <td onClick={ () => { window.location = "https://travas.io/blog/contact" } } 
                                        className="nav-item-dropdown-item clickable"
                                        onClick={ () => { window.location = "https://travas.io/blog/contact" } }>
                                        <i className="fa fa-envelope"/>  CONTACT
                                    </td>
                                </tr>
                            </tbody>
                          </table>
                        </div>
                }
            </ul>
        </div>
    );
  }
}
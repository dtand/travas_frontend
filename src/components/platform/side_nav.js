import React from "react";
import NavItemCollapse from "./nav_item_collapse";
import UserDescription from "./user_description";
import NavItem from "./nav_item";
import SessionManager from "../../js/SessionManager"

export default class SideNav extends React.Component {

    constructor(props){
        super(props);

        this.dashboard_props = {
            selected: this.props.selectedService === "Dashboard",
            selectService: this.props.selectService,
            href: "dashboard",
            iconClass: "fa fa-fw fa-dashboard",
            serviceName: "Dashboard",
            /**selected: window.location.href.includes("dashboard")**/
        }

        this.strategies_props = {
            selected: this.props.selectedService === "Strategies",
            selectService: this.props.selectService,
            href: "strategies",
            iconClass: "fa fa-fw fa-sliders",
            serviceName: "Strategies",
            /**selected: window.location.href.includes("strategies")**/
        }

        this.bots_props = {
            selected: this.props.selectedService === "Bots",
            selectService: this.props.selectService,
            href: "bots",
            iconClass: "fa fa-fw fa-gears",
            serviceName: "Bots",
            /**selected: window.location.href.includes("bot")**/
        }

        this.analytics_props = {
            selected: this.props.selectedService === "Backtest",
            selectService: this.props.selectService,
            href: "backtest",
            iconClass: "fa fa-fw fa-area-chart",
            serviceName: "Backtest",
            /**selected: window.location.href.includes("backtest")**/
        }

        this.exchanges_props = {
            selected: this.props.selectedService === "Exchanges",
            selectService: this.props.selectService,
            href: "exchanges",
            iconClass: "fa fa-fw fa-university",
            serviceName: "Exchanges",
            /**selected: window.location.href.includes("backtest")**/
        }

        this.collaboration_props = {
            selected: this.props.selectedService === "Groups",
            selectService: this.props.selectService,
            href: "groups",
            iconClass: "fa fa-fw fa-users",
            serviceName: "Groups",
            /**selected: window.location.href.includes("groups")**/
        }

        this.settings_props = {
            selected: this.props.selectService === "Settings",
            selectService: this.props.selectService,
            href: "settings",
            iconClass: "fa fa-fw fa-wrench",
            serviceName: "Settings",
            /**selected: window.location.href.includes("settings")**/
        }
    }

    render() {
      return (
        <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav navbar-sidenav" id="exampleAccordian">
                { !this.props.toggled && 
                <UserDescription username={ this.props.username }
                                 updateAfterProfile={ this.props.updateAfterProfile }/> }
                { this.props.toggled && <div><br/><br/></div> }
                <NavItem serviceProps={this.dashboard_props} 
                         selected={ this.props.selectedService === "Dashboard" }/>
                <NavItem serviceProps={this.strategies_props} 
                         selected={ this.props.selectedService === "Strategies" }/>
                <NavItem serviceProps={this.bots_props} 
                         selected={ this.props.selectedService === "Bots" }/>
                <NavItem serviceProps={this.analytics_props} 
                         selected={ this.props.selectedService === "Backtest" }/>
                <NavItem serviceProps={ this.exchanges_props } 
                         selected={ this.props.selectedService === "Exchanges" }/>
                <NavItem serviceProps={ this.collaboration_props } 
                         selected={ this.props.selectedService === "Groups" }/>
                <NavItem serviceProps={ this.settings_props } 
                         selected={ this.props.selectedService === "Settings" }/>
            </ul> 
            <ul className="navbar-nav sidenav-toggler">
              <li className="nav-item">
                <a className="nav-link text-center" 
                   id="sidenavToggler"
                   onClick={ this.props.toggleNav }>
                  <i className="fa fa-fw fa-angle-left"></i>
                </a>
              </li>
            </ul>
        </div>
    );
  }
}
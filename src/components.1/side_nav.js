import React from "react";
import NavItemCollapse from "./nav_item_collapse";
import UserDescription from "./user_description";
import NavItem from "./nav_item";

export default class SideNav extends React.Component {

    constructor(props){
        super(props);

        this.dashboard_props = {
            href: "dashboard",
            iconClass: "fa fa-fw fa-dashboard",
            serviceName: "Dashboard"
        }

        this.strategies_props = {
            parentHref: "#collapseComponentsStrategy",
            iconClass: "fa fa-fw fa-sliders",
            serviceName: "Strategies",
            pages: [ 
                {
                    href: "strategy_manager",
                    name: "Strategy Manager"
                }
            ]
        }

        this.bots_props = {
            parentHref: "#collapseComponentsBots",
            iconClass: "fa fa-fw fa-gears",
            serviceName: "Bots",
            pages: [ 
                {
                    href: "bot_manager",
                    name: "Bot Manager"
                },
                {
                    href: "bot_leaderboards",
                    name: "Bot Leaderboards"
                }
            ]
        }

        this.analytics_props = {
            parentHref: "#collapseComponentsAnalytics",
            iconClass: "fa fa-fw fa-area-chart",
            serviceName: "Analytics",
            pages: [ 
                {
                    href: "backtest",
                    name: "Backtest"
                },
                {
                    href: "cross_exchange",
                    name: "Cross Exchange Analysis"
                }
            ]
        }


        this.settings_props = {
            parentHref: "#collapseComponentsSettings",
            iconClass: "fa fa-fw fa-wrench",
            serviceName: "Settings",
            pages: [ 
                {
                    href: "settings",
                    name: "Account/Security"
                }
            ]
        }
    }
    render() {
      return (
        <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav navbar-sidenav" id="exampleAccordian">
                <UserDescription/>
                <NavItem { ... this.dashboard_props }/>
                <NavItemCollapse { ... this.strategies_props }/>
                <NavItemCollapse { ... this.bots_props }/>
                <NavItemCollapse { ... this.analytics_props }/>
                <NavItemCollapse { ... this.settings_props }/>
            </ul> 
            <ul className="navbar-nav sidenav-toggler">
              <li className="nav-item">
                <a className="nav-link text-center" id="sidenavToggler">
                  <i className="fa fa-fw fa-angle-left"></i>
                </a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                <a className="nav-link" data-toggle="modal" data-target="#logoutModal">
                <i className="fa fa-fw fa-sign-out"></i>Logout</a>
                </li>
            </ul>
        </div>
    );
  }
}
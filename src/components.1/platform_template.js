import React from "react"
import MainNav from "./main_nav"
import PageBreadcrumb from "./page_breadcrumb";
import StickyFooter from "./sticky_footer";
import ExchangeMarketsGrid from "./exchange_markets_grid"

/**
 * Main login component - renders login page
 */
export default class PlatformTemplate extends React.Component {
  render() {
    return (
      <div className="fixed-nav sticky-footer bg-dark" 
           id="page-top">
        <br/>
        <br/>
        <MainNav dashboardTitle="TRAVAS ALPHA v1.0.0"/>
        <div id="mainContentWrapper" 
             className="content-wrapper">
            <div className="container-fluid">
            <PageBreadcrumb crumbTitle={ this.props.title } 
                            crumbSubTitle={ this.props.subtitle }/>
            { this.props.serviceComponent }
            <StickyFooter footerMessage="Copyright © 2018 - Powered By the "
                          href="https://nomics.com"
                          linkText="Nomics API"/>
            </div>
        </div>
      </div>
    );
  }
}

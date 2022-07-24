import React from "react"
import MainNav from "./main_nav"
import PageBreadcrumb from "./page_breadcrumb";
import StickyFooter from "./sticky_footer";
import ExchangeMarketsGrid from "./exchange_markets_grid"

/**
 * Main login component - renders login page
 */
export default class DashboardMain extends React.Component {
  render() {
    return (
      <ExchangeMarketsGrid/>
    );
  }
}

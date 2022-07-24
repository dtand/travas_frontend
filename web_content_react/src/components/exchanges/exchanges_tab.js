import React from "react"
import TabMenu from "../platform/tab_menu"
import ExchangeSummaryPanel from "./exchange_summary_panel";

export default class ExchangesTab extends React.Component {

  render() {

    return (
      <div className="margins-15">
          <ExchangeSummaryPanel  wallets={ this.props.wallets }
                                 linkedExchanges={ this.props.linkedExchanges }
                                 userBots={ this.props.userBots }
                                 refreshInfo={ this.props.refreshInfo }/>
     </div>
    );
  }
}
import React from "react"
import BotSummaryTable from "./bot_summary_table";
import ApiController from "../../js/ApiController"
import NotificationController from "../../js/NotificationController";

const MARGIN_TOP={
  marginTop: "10px"
}

const MARGIN_SUBTITLE={
  marginLeft: "5px",
  marginRight: "5px"
}

export default class BotMetrics extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
      <div>
        <BotSummaryTable bot={ this.props.bot }
                         fields={[
                           "score", "avg roi", "wins", "losses", "trades", "win/loss",
                           "trading lim", "expectancy", "profit factor", 
                           "best trade", "worst trade", "max drawdown"
                         ]}
                         index={ this.props.index }/>
      </div>
    );
  }
}


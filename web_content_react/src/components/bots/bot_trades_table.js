import React from "react";
import FilterTable from "../generic/filter_table";
import IconHeader from "../generic/icon_header";
import Loader from "../generic/loader";

export default class BotTradesTable extends React.Component {

  constructor(props){
    super(props);
  }

  buildTableData(){

    let lastBuy = undefined;
    let table   = [];
    for(let l=0;l<this.props.botLogs.length;l++){
      const log = this.props.botLogs[l];
      if(log.action === "BUY"){
        lastBuy = log.networth;
      }
      if(log.action === "BUY" || log.action === "SELL"){
        table.push([
          log.timestamp,
          log.closePrice,
          log.networth,
          log.quotes,
          log.assets,
          log.action,
          log.action === "SELL" && lastBuy != undefined ? 
            (log.networth - lastBuy) / log.networth : 
            0.00
        ]);
      }
    }

    return table;
  }

  render(){  
    return(
      <div>
        { this.props.botLogs &&
        <FilterTable header={[
          "TIMESTAMP",
          "CLOSE PRICE",
          <IconHeader header="NETWORTH" iconClass="fa fa-sort" anchor="right"/>,
          <IconHeader header="QUOTE HOLDINGS" iconClass="fa fa-sort" anchor="right"/>,
          <IconHeader header="BASE HOLDINGS" iconClass="fa fa-sort" anchor="right"/>,
          "ACTION",
          <IconHeader header="GAIN" iconClass="fa fa-sort" anchor="right"/>
        ]}
        classOverride={ "row" }
        sortable={[
          false,
          false,
          true,
          true,
          true,
          false,
          true
        ]}
        data={ this.buildTableData() }
        align="left"
        searchText="Search trades..."
        disableClick={ true }
        columnCallbacks={{
          "6": function(value){
            const text = (value*100).toFixed(2) + "%";
            if(value>0){
              return <span className="text-success">{ "↑" + text }</span>
            }
            else if(value<0){
              return <span className="text-danger">{ "↓" + text }</span>
            }
            return <span className="text-secondary">{ text }</span>
          }
        }}/>
      }{
        !this.props.botLogs &&
        <div style={ { marginBottom: "400px" } }>
          <Loader loadingMessage="Loading Bot Trades..."/>
        </div>
      }
    </div>
    
    )
  }
}
import React from "react"
import DashboardTicker from "./dashboard_ticker"

const ROW_STYLE = {
    paddingLeft: "15px",
    paddingRight: "0px"
}

const SCROLL_LEFT_STYLE = {
    paddingTop: "50px",
    right: "30px"
}

const SCROLL_RIGHT_STYLE = {
    paddingTop: "50px",
    left: "30px"
}

export default class DashboardTickerRow extends React.Component {

  constructor(props){
      super(props);

  }
  scrollLeft(){
      return;
  }

  scrollRight(){
      return;
  }

  render() {
    
    const tickerList = this.props.tickers.map((ticker,index) =>
            <DashboardTicker key={ "ticker-" + index }
                             graphId={ index + 1 }
                             index={ index }
                             ticker={ ticker }
                             onClickCallbackSelect={ this.props.onClickCallbackSelect }
                             onClickCallbackDeselect={ this.props.onClickCallbackDeselect }
                             />
        );

    return (
      <div className="container-fluid align-items-center">
        <div className={ this.props.className } 
             style={ ROW_STYLE }>
          { tickerList }
        </div>
      </div>
    );
  }
}
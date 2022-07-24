import React from "react";
import MarketBox from "./market_box";
import Constants from "../../js/Constants";
import MarketBoxMobile from "./market_box_mobile";

const EVEN_COLOR = "#daecff";
const ODD_COLOR = "#eff0f1";

export default class MarketStack extends React.Component {

  constructor(props){
   super(props);
  }
    
  render(){  
    const marketStack = !Constants.IS_MOBILE ? 
    
    (this.props.data.map((data,index) => 
      <MarketBox backgroundColor={ index % 2 == 0 ? EVEN_COLOR : ODD_COLOR}
                 data={ data }
                 removeMarket={ this.props.removeMarket }/>
    )) :

    (this.props.data.map((data,index) => 
      <MarketBoxMobile backgroundColor={ index % 2 == 0 ? EVEN_COLOR : ODD_COLOR}
                data={ data }
                removeMarket={ this.props.removeMarket }/>
    ));

    return marketStack;
  }
}
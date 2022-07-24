import React from "react";
import CryptocoinLookup from "../../js/Cryptocoins";

const FA_STYLE = {
  fontSize: "20px"
}

export default class CryptoIcon extends React.Component {

  constructor(props){
    super(props);
  }
  
  render() {
    return (
      <span onMouseEnter={ this.onHover }
            onMouseLeave={ this.offHover }> 
        { CryptocoinLookup.getCoin(this.props.coinName) &&
          <img width={ this.props.width ? this.props.width : "32px" } 
               height={ this.props.height? this.props.height : "32px" }
               src={ CryptocoinLookup.getCoin(this.props.coinName) }
               style={ { display: "inline-table" } }>
          </img>
        }
        { !CryptocoinLookup.getCoin(this.props.coinName) &&
          <span style={ FA_STYLE }>
              <strong>{ this.props.coinName.toUpperCase() }</strong>
          </span>
        }
      </span>
    );
  }
}


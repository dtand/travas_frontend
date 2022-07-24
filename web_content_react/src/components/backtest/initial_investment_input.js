import React from "react";

const STYLE = {
  marginTop: "10px",
  width: "100%",
}

const HEIGHT = {
  height: "64px",
  fontSize: "32px"
}

export default class InitialInvestmentInput extends React.Component {

  constructor(props){
    super(props);
  }
  
  render() {

    return (
      <div class="input-group input-group-md mb-3"
           style={ STYLE }>
        <input  type="text" 
                id="initialInvestmentInput" 
                name="investment" 
                class="form-control text-secondary font-weight-bold" 
                placeholder="Initial Investment Amount..."
                style={ HEIGHT }/>
        <div class="input-group-append">
            <span class="input-group-text">
              .00
            </span>
        </div>
      </div>
    );
  }
}


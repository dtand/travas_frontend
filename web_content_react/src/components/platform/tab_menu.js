import React from "react";


const STYLE = {
  marginLeft: "5px"
}

const TAB_STYLE = {
  marginTop: "5px",
  width: "124px"
}

export default class TabMenu extends React.Component {

  constructor(props){
    super(props);
    this.state={
      active:[]
    }
  }
  
  render() {
    const tabs = this.props.tabs.map((tab,index) =>
      <li class="nav-item text-left clickable" 
          style={ TAB_STYLE }
          onClick={ () => this.props.updateTab(index) }
          >
          <a class={ index === this.props.currentTab ? "nav-link active show text-black" : "nav-link text-secondary" } 
             data-toggle="tab" 
             >
             { tab.name }
          </a>
      </li>
    );

    return (
      <div className="margin-top-25">
        <ul class="nav nav-tabs" style={ STYLE }>
          { tabs }
        </ul>
      </div>
    );
  }
}



import React from "react"

const GRAPH_BUTTON_STYLE = {
  paddingRight: "40px"
}

export default class DashboardGraphButton extends React.Component {

  constructor(props){
      super(props);
  }
  render() {

    return (
      <div>
        { 
          !this.props.isActive &&

            <a className ={ this.props.class }
                  onClick={ this.props.onClick }
                  style={ GRAPH_BUTTON_STYLE }>
              <i class="fa fa-fw fa-area-chart clickable">↓</i>
            </a>
        
        }{
          this.props.isActive &&

            <a className={ this.props.class + " js-scroll-trigger" }
               href={ this.props.href }
               style={ GRAPH_BUTTON_STYLE }>
              <i className="fa fa-fw fa-area-chart clickcable">↓</i>
            </a>
        }
        </div>
    );
  }
}


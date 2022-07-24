import React from "react";
import Constants from "../../js/Constants";

export default class RoadmapQuarter extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
      return (
        <div className="row">
            <div className="col-md-12">
                <div id={ this.props.quarter } 
                    className={ "half-circle-" + this.props.side }>
                    <div className={ "line-" + this.props.side }>
                    </div>
                    <div className={ "quarter-inside-" + this.props.side }>
                        <i className={ this.props.icon }/>
                        <br/>
                        <br/>
                        <h1 className={ "text-uppercase quarter-type-" + this.props.side }>
                            { this.props.quarter } - {this.props.year }
                        </h1>
                    </div>
                    <div className={ "line-" + this.props.side + "-purple" }>
                    </div>
                    <div className={ "content-circle-" + this.props.side + ( Constants.IS_MOBILE ? "-mobile" : "" ) }>
                        <div className="circle-text">{ this.props.header }<br/><br/>
                            <p className="info">
                            { this.props.goals }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}
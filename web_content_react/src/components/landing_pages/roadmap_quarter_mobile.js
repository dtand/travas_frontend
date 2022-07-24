import React from "react";
import Constants from "../../js/Constants";

export default class RoadmapQuarterMobile extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
      return (
        <div className={ "row margin-top-10 margin-bottom-10 quarter-mobile-" + this.props.side }>
            <div className="col-md-12">
                <div className="row margins-10">
                    <div className="col-md-6">
                        <i className={ this.props.icon }/>
                        <br/>
                        <br/>
                        <h1 className={ "text-uppercase" }>
                            { this.props.quarter } - {this.props.year }
                        </h1>
                    </div>
                    <div className="col-md-6">
                        <div>{ this.props.header }<br/><br/>
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
import React from "react";
import d3 from 'd3';
import NVD3Chart from "react-nvd3";
import Utils from "../../js/Utils"

export default class LineWithFocusChart extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidUpdate(){
        Utils.clearTooltips();
    }

    render(){
        
        const data = this.props.datum;
        const precision = this.props.precision ? this.props.precision : 8;
        const self = this;
        return(
            <div>
            {
              <NVD3Chart 
                xAxis={{
                  showMaxMin: false,
                  tickFormat: function(d) { return d3.time.format('%d/%m/%y')(new Date(d)); },
                  axisLabel: 'Time'
                }}
                x2Axis={{
                    showMaxMin: false,
                    tickFormat: function(d) { return d3.time.format('%d/%m/%y')(new Date(d)); },
                    //axisLabel: 'Time'
                }}
                yAxis={{
                  showMaxMin: false,
                  tickFormat: function(d) {
                      if(self.props.percents){
                          return (d*100).toFixed(2) + "%";
                      }
                      return parseFloat(d).toFixed(precision).toString(); 
                    }
                }}
                y2Axis={{
                    showMaxMin: false,
                    tickFormat: function(d) {
                        if(self.props.percents){
                            return (d*100).toFixed(2) + "%";
                        }
                        return parseFloat(d).toFixed(precision).toString(); 
                    }
                }}
                focusHeight={ this.props.focusHeight ? this.props.focusHeight : 100 }
                yScale={ this.props.yScale ? this.props.yScale : d3.scale.linear() }
                xScale={ d3.time.scale() }
                x2Scale={ d3.time.scale() }
                tooltip={ this.props.tooltip ? this.props.tooltip : {} }
                forceY={ this.props.forceY ? this.props.forceY : {} }
                yDomain={ this.props.yDomain ? this.props.yDomain : {} }
                type={ this.props.type ? this.props.type : 'lineWithFocusChart' }
                datum={ data }
                x='Time'
                y='Close'
                duration={ 1 }
                margin={ this.props.margins }
                height={ this.props.height }
                showLegend={ this.props.showLegend }
                interactive={ true }
                userInteractiveGuidelines={ true }
              />
            }
            </div>
        )
    }
}
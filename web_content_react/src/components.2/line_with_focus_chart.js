import React from "react";
import d3 from 'd3';
import NVD3Chart from "react-nvd3";

export default class LineWithFocusChart extends React.Component {

    constructor(props){
        super(props);
    }

    buildDatum(params){

        let values = []

        for( let i = 0; i < this.props.candles.length; i++ ){
            values.push({
                x: new Date(this.props.candles[i].timestamp),
                y: this.props.candles[i].close,
            })
        }

        return [{
            key: params.key,
            values: values,
            color: "#007bff",
			area: true
        }]
    }

    render(){
        
        const data = this.buildDatum(this.props.graphParams);

        return(
            <div>
            {
              <NVD3Chart 
                xAxis={{
                  tickFormat: function(d) { return d3.time.format('%d/%m/%y')(new Date(d)); },
                  axisLabel: 'Time'
                }}
                x2Axis={{
                    tickFormat: function(d) { return d3.time.format('%d/%m/%y')(new Date(d)); },
                    axisLabel: 'Time'
                }}
                yAxis={{
                  tickFormat: function(d) {return parseFloat(d).toFixed(8).toString(); }
                }}
                type='lineWithFocusChart'
                datum={ data }
                x='Time'
                y='Close'
                duration={ 2 }
                margin={ this.props.margins }
                height={ this.props.height }
                showLegend={ false }
              />
            }
            </div>
        )
    }
}
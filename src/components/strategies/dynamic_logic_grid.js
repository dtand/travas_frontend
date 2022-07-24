import React from "react";
import { DropTarget } from 'react-dnd';
import BooleanStatement from "./boolean_statement";

const Types = {
    ITEM: 'indicator'
}

const indicatorTarget = {
    drop(targetProps, monitor, component) {
      component.addIndicator(monitor.getItem().indicator);
    },
  };

class DesignArea extends React.Component {

    constructor(props){
        super(props);
        this.state={
            indicators: []
        }
    }

    addIndicator(indicator){
        let indicators = this.state.indicators;
        indicators.push(indicator);
        this.setState({
            indicators: indicators
        });
    }

    buildBooleanStatements()

    render() {

        const { connectDropTarget } = this.props

        return( connectDropTarget(
            <div className="container design-area margin-left-10"> 
                <br/><br/>
                { this.state.indicators.length === 0 && 
                  <div>
                      <br/><br/><br/><br/><br/><br/>
                    <h1 className="text-secondary text-center">
                        Drag and drop indicators <br/> here to begin designing.
                    </h1>
                  </div>
                }
                { this.state.indicators.length > 0 &&
                <div>
                    <BooleanStatement lhs={ this.state.indicators[0] }
                                      operator={ "IS LESS THAN" }
                                      rhs={ "50" }/>
                                      <BooleanStatement lhs={ this.state.indicators[0] }
                                      operator={ "IS LESS THAN" }
                                      rhs={ "50" }/>
                                      </div>
                }
            </div>));
    }
}

export default DropTarget(
    Types.ITEM, 
    indicatorTarget, 
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }))
    (DesignArea);
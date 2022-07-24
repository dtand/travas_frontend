import React from "react";
import { DragSource } from 'react-dnd';
import Constants from "../../js/Constants";
const Types = {
    ITEM: 'indicator'
}

const indicatorSource = {
    beginDrag(props) {
      let indicator    = props.indicator;
      let values = Constants.INDICATOR_METADATA[indicator.name].defaultValue;
      if(values.constructor === Array){
          indicator.values = values;
      }
      else{
          indicator.values = [values]
      }
      return {
        indicator: indicator,
      };
    },
};

class DraggableIndicator extends React.Component {
    render() {
    const { isDragging, connectDragSource, src } = this.props
    return connectDragSource(
        <div className="clickable indicator-box text-center"> 
            <br/>
            <h5 className="text-black">
                { this.props.indicator.name.toUpperCase() }
            </h5>
            <p className="margins-5 text-secondary">
                { Constants.INDICATOR_METADATA[ this.props.indicator.name ] ? 
                    Constants.INDICATOR_METADATA[ this.props.indicator.name ].name  :
                    "none"
                }
            </p>
        </div>
    )
    }
}
   
export default DragSource(
    Types.ITEM, 
    indicatorSource, 
    connect => ({
        connectDragSource: connect.dragSource(),
    }))
(DraggableIndicator);
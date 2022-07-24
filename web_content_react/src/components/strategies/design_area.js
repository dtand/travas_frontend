import React from "react";
import { DropTarget } from 'react-dnd';
import BooleanStatement from "./boolean_statement";
import AdvancedIndicators from "../../js/AdvancedIndicators";
import Dropdown from "../generic/dropdown"
import IconHeader from "../generic/icon_header"
import DesignAreaInner from "./design_area_inner";

const Types = {
    ITEM: 'indicator'
}

const indicatorTarget = {
    hover(props,monitor,component){
        component.setState({
            areaClass: "design-area-hovered"
        });
        return;
    },
    drop(targetProps, monitor, component) {
      component.addIndicator(monitor.getItem().indicator);
      component.setState( 
          { areaClass: "design-area" }
      );
    },
};

export default (DropTarget(
    Types.ITEM, 
    indicatorTarget, 
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    })) (DesignAreaInner));
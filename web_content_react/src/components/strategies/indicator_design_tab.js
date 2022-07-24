import React from "react"
import IndicatorPanel from "./indicator_panel";
import DesignArea from "./design_area";
export default class IndicatorDesignTab extends React.Component {

  constructor(props){
    super(props);
  }
  render() {
    return( 
      <div>
        <div className="row margin-top-10 margin-right-10">
          <div className="col-md-2"> 
            <IndicatorPanel/>
          </div>
          <div className="col-md-10">
            <DesignArea/>
          </div>
      </div>
     </div>
    )
  }
}

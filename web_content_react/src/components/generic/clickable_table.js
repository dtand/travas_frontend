import React from "react";

const STYLE = {
  display: "table-row"
};

const STYLE_SELECTED = {
  display: "table-row",
  backgroundColor: "rgb(215, 231, 249)"
};

export default class ClickableTable extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      selectedRow: -1,
      sortBy: -1,
      descending: true
    }
    this.handleClick  = this.handleClick.bind(this);
    this.sortByColumn = this.sortByColumn.bind(this);
  }
  
  sortByColumn(index) {
    const flip = index === this.state.sortBy;
    this.setState({
      sortBy: index,
      descending: flip ? !this.state.descending : true,
      selectedRow: -1
    });
  }

  handleClick(market,index,offset){
    if(this.props.disableClick){
      return;
    }
    if(this.props.mappedData){
      const actualIndex = offset ? offset: index;
      this.props.onClick(this.props.mappedData[actualIndex],actualIndex);
    }
    else{
      this.props.onClick(market,index);
    }
    this.setState({
      selectedRow: index
    });
  }

  setHeight(height){
    return({
      maxHeight: "340px"
    });
  }

  getValue(col,header){
    if(this.props.columnCallbacks && this.props.columnCallbacks[header]){
      const func = this.props.columnCallbacks[header];
      if(!isNaN(col)){
        return func(parseFloat(col),header);
      }
      else{
        return func(col,header);
      }
    }
    return col;
  }

  sortByHeader(){
    const col = this.state.sortBy;
    let valueObjects = [];
    for(let r=0;r<this.props.rows.length;r++){
      let valueObject = {
        index: r,
        value:parseFloat(this.props.rows[r][col])
      };
      valueObjects.push(valueObject);
    }

    valueObjects.sort(function(a,b){
      if (a.value < b.value)
        return -1;
      if (a.value > b.value)
        return 1;
      return 0;
    });

    if(this.props.onSortBy && this.props.onSortBy[col]){
      this.props.onSortBy(valueObjects);
    }

    if(this.state.descending){
      valueObjects.reverse();
    }

    return ( valueObjects.map((obj,index) =>
      <tr align={ this.props.align ? this.props.align : "center" }
          style={ index === this.state.selectedRow ? STYLE_SELECTED : STYLE }
          onClick={ () => this.handleClick(this.props.rows[obj.index],index,obj.index) }>
          { this.props.rows[obj.index].map((col,colIndex) => 
              <td class={ this.props.colClasses ? this.props.colClasses[obj.index][colIndex] : "" }>
                { index === this.state.selectedRow ? <strong className="text-primary">
                 { this.getValue(col, colIndex) } 
                </strong> : this.getValue(col,colIndex) }
              </td>
          )}  
      </tr>
    ));
  }

  createHeader(){
    if(!this.props.sortable){
      return (
        <thead>
          <tr align={ this.props.align ? this.props.align : "center" }>{ this.props.header.map((col,index) => 
                  <th>
                    <strong>
                      { col } 
                    </strong>
                  </th>
              )}
          </tr>
        </thead>
      );
    }
    else{
      return (
        <thead>
          <tr align={ this.props.align ? this.props.align : "center" }>{ this.props.header.map((col,index) => 
                  <th>
                    <strong>
                      <a className={ this.props.sortable[index] ? "clickable" : "" }
                         onClick= { this.props.sortable[index] ? ( () => this.sortByColumn(index) ) : function(){} }>
                        { col } 
                      </a>
                    </strong>
                  </th>
              )}
          </tr>
        </thead>
      );  
    }
  }
  render() {

    let marketList = []
    
    if(this.state.sortBy != -1){
      marketList = this.sortByHeader();
    }
    else {
      marketList = this.props.rows.map((row,index) =>
        <tr className={ !this.props.disableClick ? "clickable" : "" }
            align={ this.props.align ? this.props.align : "center" }
            style={ index === this.state.selectedRow && !this.props.ignoreStyle ? STYLE_SELECTED : STYLE }
            onClick={ () => this.handleClick(row,index) }>  
            { row.map((col,colIndex) => 
                <td class={ this.props.colClasses ? this.props.colClasses[index][colIndex] : "" }>
                  { index === this.state.selectedRow && !this.props.ignoreStyle ? 
                    <strong className="text-primary">
                  { this.getValue(col,colIndex) }
                   </strong> : this.getValue(col,colIndex) }
                </td>
            )}  
        </tr>);
    }

    if(this.props.clearTableSelect){
      this.state.selectedRow = undefined 
    }

    if(!this.state.selectedRow && this.props.defaultSelectedRow){
      this.state.selectedRow = this.props.defaultSelectedRow;
    }

    return (
      <div class={ this.props.classOverride ? this.props.classOverride : "row pre-scrollable" } style={ this.props.style ? "" : this.props.height }>
        <table id="marketTable" 
               class="table table-hover order-table table">
          { this.props.header && this.createHeader() }
          <tbody id="marketTableBody" 
                 class={ this.props.tbodyClass ? this.props.tbodyClass : "text-center" }>
          { marketList }
          </tbody>
        </table>
			</div>
    );
  }
}


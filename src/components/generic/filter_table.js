import React from "react";
import ClickableTable from "../generic/clickable_table";

export default class FilterTable extends React.Component {
    
    constructor(props){
        super(props);
    }

    handleChange(event) {
      this.setState({
          input: event.target.value
        }
      )
    }

    render() {

        let filtered   = [];
        let mappedData = [];

        if( this.state && this.state.input ) {
            for(let i = 0; i < this.props.data.length; i++) {
            for(let col = 0; col < this.props.data[i].length; col++){
                let value = this.props.data[i][col];
                if ((typeof value) === "string" && value.toLowerCase().includes(this.state.input.toLowerCase())){
                    filtered.push(this.props.data[i]);
                    if(this.props.mappedData){
                        mappedData.push(this.props.mappedData[i]);
                    }
                    break;
                }
            }
          }
        }
        else {
            filtered = this.props.data;
        }
      
      return (
        <div>
            <div class="row">
            <input type="search" 
                   class="light-table-filter" 
                   data-table="order-table" 
                   placeholder={ this.props.searchText }
                   onChange={ this.handleChange.bind(this) }/>
            </div>
            { !this.props.mappedData &&
                <ClickableTable {...this.props}
                                rows={filtered}/>
            }
            { this.props.mappedData &&
                <ClickableTable {...this.props}
                                rows={ filtered }
                                mappedData={ mappedData.length != 0 ? mappedData : this.props.mappedData }/>
            }
        </div>
    )}
}
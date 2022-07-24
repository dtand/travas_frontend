import React from "react";

const STYLE = {
  textAlign: "center"
};

const BUTTON_STYLE = {
  marginBottom: "10px"
}

export default class ExchangePanelList extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      clicked: {}
    }
  }

  toggle(event,index){
    const quote = event.target.value;

    if(event.target.checked){
      this.props.addQuote(quote);
      this.state.clicked[quote] = true;
    }
    else{
      this.props.removeQuote(quote);
      this.state.clicked[quote] = false;
    }

    this.setState({
      clicked: this.state.clicked
    });

  }

  initClickedState(){
    if(this.props.quotes && Object.keys(this.state.clicked).length === 0){
      this.state.clicked = {};
      for(let q=0;q<this.props.quotes.length;q++){
        this.state.clicked[this.props.quotes[q]] = true;
      }
    }
  }

  render() {

    this.initClickedState();

    const quoteList = this.props.quotes.map((quote,index) =>
      <div>
        <label for={ quote+"-check" }>
          { quote }&nbsp;
        </label>
        <input key={ quote+"-check" }
               id={ quote+"-check" }
               type="checkbox" 
               checked={ this.state.clicked[quote] }
               value={ quote }
               onChange={ this.toggle.bind(this) }
               style={ BUTTON_STYLE }/>&nbsp;
      </div>
    );

    return (
      <div id="quoteFilter">
			<h5 class="text-center text-black"> 
        Filter By Quote 
      </h5>
        <div id="quoteButtonGroup" 
             class="btn-group text-center" 
             style={ STYLE } 
             role="group" 
             aria-label="Basic example">
            { quoteList }
				</div>
      </div>
    );
  }
}


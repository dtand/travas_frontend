import React from "react";
import Constants from "../../js/Constants";
import FAQItem from "./faq_item";

export default class FAQBody extends React.Component {

    constructor(props){
        super(props);

        this.btc = "3JgxnuwLS7xNxvTm257KVdi5j8kygfkfAg";
        this.eth = "0xF151E762d84250373dc78304cB57EE1c9675612e";
        this.bch = "1CaFrfyf94118aYJ4XdWqzyeRw3Z5DXicP";
        this.etc = "0xAB83E7ece139af51c7504cA7137816987fA8ed0C";
    }

    render() {

      const faqs = Constants.FAQS.map((value,i) => 
        <FAQItem question={ (i+1) + ". " + value.question }
                 answer={ value.answer }/>
      );

      return (
        <div className={ Constants.IS_MOBILE ? "" : "container" }>
            <div className="row text-center text-secondary">
                <div className="col-md-12">
                <br/><br/><br/>
                    <div className="col-md-12">
                        <h1>
                            Frequently Asked Questions
                        </h1>
                    </div>
                    <br/>
                    <div className="container margin-top-25 col-md-12 text-left">
                        { faqs }
                    </div>
                    <br/><br/>
                </div>
            </div>
        </div>
    );
  }
}
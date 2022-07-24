const AdvancedIndicators = {

    /**
     * Returns an operated by associated key
     * @param {keya associated with operand} key 
     */
    getOperand(key){
        
        //Check all indicators
        for(let o=0;o<this.indicators.length;o++){
            if (this.indicators[o].name === key){
                return this.indicators[o];
            }
        }

        //Check all variables
        for(let o=0;o<this.variables.length;o++){
            if (this.variables[o].name === key){
                return this.variables[o];
            }
        }
    },

    /**
     * Returns true if operand is a variable
     * @param {Key of operand} key 
     */
    isVariable(key){
        //Check all variables
        for(let v=0;v<this.variables.length;v++){
            if (this.variables[v].name === key){
                return true
            }
        }
        return false;
    },

    indicators: [
        { 
            name: "SMA",
            indicators: ["SMA"],
            comparables: ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        { 
            name: "EMA",
            indicators: ["EMA"],
            comparables: ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        {
            name: "RSI",
            indicators: ["PERIOD"],
            comparables: ["RSI-INDEX","RSI"]
        },
        {
            name: "LMIN",
            indicators: ["WINDOW-SIZE"],
            comparables: ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        {
            name: "LMAX",
            indicators: ["WINDOW-SIZE"],
            comparables:  ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        {
            name: "LB",
            indicators: ["SMA","STD"],
            comparables:  ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        {
            name: "UB",
            indicators: ["SMA","STD"],
            comparables: ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
    ],

    variables: [
        {
            name: "OPEN",
            indicators: [],
            comparables:  ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        {
            name: "CLOSE",
            indicators: [],
            comparables:  ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        {
            name: "HIGH",
            indicators: [],
            comparables:  ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        {
            name: "LOW",
            indicators: [],
            comparables:  ["SMA","EMA","LMIN","LMAX","OPEN","CLOSE","HIGH","LOW","LB","UB"]
        },
        {
            name: "RSI-INDEX",
            indicators: ["RSI-INDEX"],
            comparables: ["RSI"]
        }
        
    ],

    operators: [
        "IS LESS THAN",
        "IS GREATER THAN"
    ],

    conjunctions: [
        "AND",
        "OR"
    ]

}
export default AdvancedIndicators;

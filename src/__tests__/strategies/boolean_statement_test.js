// Link.react.test.js
import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';
import {configure} from 'enzyme';
import BooleanStatement from '../../components/strategies/boolean_statement';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import AdvancedIndicators from '../../js/AdvancedIndicators';

configure({ adapter: new Adapter() });


test('Single statement (1 param) tokenizes correctly w/ default values', () => {
  
  //Create boolean statement component
  let component = shallow(<BooleanStatement lhs={AdvancedIndicators.indicators[0]}
                                    operator="IS LESS THAN"
                                    rhs={AdvancedIndicators.variables[1]}
                                    updateIndicator={ () => {} }
                                    updateOperand={ () => {} }
                                    updateOperator={ () => {} }
                                    remove={ () => {} }
                                    index={ 0 }
                                    dropdownData={ [] }/>).instance();

  //Assert that statement was generated as expected
  expect(component.getBooleanStatement()).toBe("sma(21) < close");

});

test('Single statement (2 params) tokenizes correctly w/ default values', () => {
  
  //Create boolean statement component
  let component = shallow(<BooleanStatement lhs={{ 
                                      name: "LB",
                                      indicators: ["SMA","STD"]
                                    }}
                                    operator="IS LESS THAN"
                                    rhs={{ 
                                      name: "UB",
                                      indicators: ["SMA","STD"]
                                    }}
                                    updateIndicator={ () => {} }
                                    updateOperand={ () => {} }
                                    updateOperator={ () => {} }
                                    remove={ () => {} }
                                    index={ 0 }
                                    dropdownData={ [] }/>).instance();

  //Assert that statement was generated as expected
  expect(component.getBooleanStatement()).toBe("lower-bollinger(21,2.00) < upper-bollinger(21,2.00)");

});


test('Single parameter pairs tokenize correctly', () => {
  
  //List of props
  const testData = [
    {
      //SMA
      lhs: AdvancedIndicators.indicators[0],
      operator:"IS GREATER THAN",
      rhs: AdvancedIndicators.indicators[0],
      result:"sma(21) > sma(21)"
    },

    //EMA
    {
      lhs: AdvancedIndicators.indicators[1],
      operator:"IS GREATER THAN",
      rhs: AdvancedIndicators.indicators[1],
      result:"ema(21) > ema(21)"
    },

    //RSI
    {
      lhs:AdvancedIndicators.indicators[2],
      operator:"IS GREATER THAN",
      rhs:AdvancedIndicators.indicators[2],
      result:"rsi(21) > rsi(21)"
    },

    //LMIN-LMAX
    {
      lhs:AdvancedIndicators.indicators[3],
      operator:"IS GREATER THAN",
      rhs:AdvancedIndicators.indicators[4],
      result:"local-minima(21) > local-maxima(21)"
    }
    
  ]

  for(let d=0;d<testData.length;d++){
    //Create boolean statement component
    let component = shallow(<BooleanStatement lhs={ testData[d].lhs }
                                              operator={ testData[d].operator }
                                              rhs={ testData[d].rhs }
                                              updateIndicator={ () => {} }
                                              updateOperand={ () => {} }
                                              updateOperator={ () => {} }
                                              remove={ () => {} }
                                              index={ d }
                                              dropdownData={ [] }/>).instance();

    //Assert that statement was generated as expected
    expect(component.getBooleanStatement()).toBe(testData[d].result);
  }

});

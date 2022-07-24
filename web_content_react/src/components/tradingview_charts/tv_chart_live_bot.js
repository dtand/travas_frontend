import * as React from 'react';
import TVChartContainer from "./tv_chart_container";
import ApiController from '../../js/ApiController';
import NotificationController from '../../js/NotificationController';
import WebSocket from "../../js/WebSocket";
import SessionManager from "../../js/SessionManager";

export default class TVChartLiveBot extends React.PureComponent {

    constructor(props){

        super(props);

        /**
         * Component state
         */
        this.state={
            currentBotState: undefined,
            historicalCandles: [],
            newStopLoss: false,
            newPositionOpen: false,
            newPositionClose: false,
            updateKline: false
        }

        //Initialize websocket
        this.websocket = WebSocket;
    }

    /**
     * Call to grab current bot's trading state 
     */
    getBotInfo = async () => {
        ApiController.doPostWithToken(
			"get_bot_info", {
				"botId": this.props.bot.id,
				"serverId": this.props.bot.serverId,
				"quote": this.props.bot.quote
            },
            this.onBotInfoSuccess
        );
    }

    /**
     * Called with response from exchange_candles
     */
    onBotInfoSuccess = async (response) => {
        if(this.currentBotState){
            this.updatePositionFlags(this.state.currentBotState,response);
        }
        this.setState({
            currentBotState: response
        });

    }

    /**
     * Call to reset all position flags
     */
    resetPositionFlags = () => {
        this.setState({
            newStopLoss: false,
            newPositionOpen: false,
            newPositionClose: false
        })
    }

    /**
     * Called in bot info success to see if any bot state has changed
     */
    updatePositionFlags = (currentState,newState) => {
        
        //Grab stop loss values - compare for updated stop loss
        const currentStopLoss = currentState.bot.bot.indicators.stopLoss.stopLoss;
        const newStopLoss     = newState.bot.bot.indicators.stopLoss.stopLoss;

        //Grab position sizes - compare for updated position
        const currentPositionSize = currentState.bot.bot.currentPosition;
        const newPositionSize     = newState.bot.bot.currentPosition;
        const positionInfo        = this.getPositionData();

        if(currentStopLoss !== newStopLoss ||
           currentPositionSize !== newPositionSize){
            this.setState({
                newStopLoss: currentStopLoss !== newStopLoss,                                         /** Stop loss value has changed */
                newPositionOpen: !positionInfo.inPosition && currentPositionSize !== newPositionSize, /** Wasn't in position and position size has changed */
                newPositionClose: positionInfo.inPosition && currentPositionSize !== newPositionSize, /** Was in a position and position size has changed */
            });

            /**
             * Send notification to user the stop loss has been moved up
             */
            if(currentStopLoss !== newStopLoss && 
                newStopLoss > currentStopLoss){
                NotificationController.displayNotification(
                    "New Stop Loss",
                    "Your bot has moved it's stop loss up to price: " + newStopLoss.toString(),
                    "info"
                );
            }
    
            /**
             * Send notification to user that new position has opened
             */
            if(!positionInfo.inPosition && currentPositionSize !== newPositionSize){
                NotificationController.displayNotification(
                    "Position Opened",
                    "Your bot has opened a position at price: " + newState.candle.last_price.toString(),
                    "info"
                );
            }

            
            /**
             * Send notification to user that position has closed
             */
            if(positionInfo.inPosition && currentPositionSize !== newPositionSize){
                NotificationController.displayNotification(
                    "Position Closed",
                    "Your bot has closed it's position at price " + newState.candle.last_price.toString(),
                    "info"
                );
            }
        }
    }

    /**
     * Call to grab historical data
     */
    getExchangeCandles = async () => {

        const base  = this.props.bot.market.split("-")[0];
        const quote = this.props.bot.market.split("-")[1];

        ApiController.doPostWithToken(
			"exchange_candles", {
				"exchange": this.props.bot.exchange,
				"base": base,
				"quote": quote,
				"interval": this.props.bot.interval
            },
            this.onExchangeCandlesSuccess
        );
    }

    /**
     * Called with response from exchange_candles
     */
    onExchangeCandlesSuccess = async (response) => {
       
       //Update state with exchange candles
        this.setState({
            historicalCandles: response.priceData
        });

        //Grab bot info
        this.getBotInfo();
    }

    /**
     * Returns list of marks where buys and sells have occurred
     */
    buildBuySellMarks = () => {

        let marks = [];
        return [];
    }

    
    /**
     * Returns line for position open
     */
    getPositionLine = () => {

        for(let l=this.props.botLogs.length-1; l>0; l--){

            const log = this.props.botLogs[l];

            if(log.action === "SELL"){
                return undefined;
            }

            if(log.action === "BUY"){

                return {
                    point: {
                        time: log.timestamp,
                        price: log.closePrice
                    },
                    options: {
                        shape: "horizontal_line",
                        lock: false,
                        disableSelection: false,
                        disableSave: false,
                        overrides: {
                            "linecolor": "#00c949"
                        },
                        zOrder: "top",
                        showInObjectsTree: true
                    }
                };
            }
        }

        return undefined;
    }

    /**
     * Returns line for current stop loss
     */
    getStopLossLine = () => {

        const lastActionTime = this.state.currentBotState.bot.lastActionTime;
        const bot            = this.state.currentBotState.bot.bot;
        const stopLoss       = bot.indicators.stopLoss.stopLoss;

        return {
            point: {
                time: lastActionTime,
                price: stopLoss
            },
            options: {
                shape: "horizontal_line",
                lock: false,
                disableSelection: false,
                disableSave: false,
                overrides: {
                    "linecolor": "#ff0000"
                },
                zOrder: "top",
                showInObjectsTree: true
            }
        };
    }

    /**
     * Called to update candles and bot info 
     */
    updateBot = () => {

        if(this.props.bot.running){

            //Grab historical candles
            this.getExchangeCandles();

            //Disconnect websocket
            if(this.websocket.isConnected()){
                this.websocket.disconnect();
            }

            //Connect to websocket
            this.websocket.connectBotEngine({
                    sessionToken: SessionManager.getSessionToken()
                },
                this.subscribeToChannels,
                this.props.bot.serverId
            );

            //Resets update flag in parent
            this.props.afterUpdateBot();
        }
    }

    /**
     * Returns information about the current position
     */
    getPositionData = () => {
        
        /**
         * Information relevant to current position
         */
        let buyPrice      = undefined;
        let positionLine  = undefined;
        let currentPrice  = this.state.currentBotState.candle.last_price;
        let currentAssets = this.state.currentBotState.bot.bot.currentPosition;

        /**
         * Iterate logs and find current position
         */
        for(let l=this.props.botLogs.length-1; l>0; l--){

            const log = this.props.botLogs[l];

            //Bot is not in a position, return false
            if(log.action === "SELL"){
                return {
                    inPosition: false
                };
            }

            //Bot is currently in a position, grab position line and price
            if(log.action === "BUY"){
                positionLine =  {     
                    point: {
                        time: log.timestamp,
                        price: log.closePrice
                    },
                    options: {
                        shape: "horizontal_line",
                        lock: false,
                        disableSelection: false,
                        disableSave: false,
                        overrides: {
                            "linecolor": "#00c949"
                        },
                        zOrder: "top",
                        showInObjectsTree: true
                    }
                }
                buyPrice = log.closePrice;
                break;
            }
        }

        return{
            inPosition: true,
            buyPrice: buyPrice,
            currentPrice: currentPrice,
            currentRoi: (currentPrice/buyPrice) - 1.00,
            currentAssets: currentAssets,
            positionLine: positionLine,
            stopLossLine: this.getStopLossLine()
        }
    }

    /**
     * Callback for websocket message recieved 
     */
    onMessageRecievedBot = (message) => {
        console.log(message.body);
    }

    /**
     * Callback for websocket message recieved 
     */
    onMessageRecievedMarket = (message) => {

        const kline   = JSON.parse(message.body);

        //Tell component to send new kline
        this.setState({
            updateKline: true,
            newKline: {
                open: kline.open,
                close: kline.close,
                high: kline.high,
                low: kline.low,
                volume: kline.volume,
                time: kline.timestamp
            }
        });
    }

    /**
     * Returns the websocket channel for this bot
     */
    generateSocketChannelBot = () => {
        return  "/topic/bot/" + SessionManager.getSessionToken() + "/" + this.props.bot.id;
    }

    /**
     * Returns the websocket mapping for bot message channel (for bot authorization)
     */
    generateMessageChannelBot = () => {
        return  "/app/authenticate_bot/" + SessionManager.getSessionToken() + "/" + this.props.bot.id;
    }

    /**
     * Returns the websocket channel for this market
     */
    generateSocketChannelMarket = () => {
        const exchange = this.props.bot.exchange.toUpperCase();
        const base     = this.props.bot.market.split("-")[0].toUpperCase();
        const quote    = this.props.bot.market.split("-")[1].toUpperCase();
        const interval = this.props.bot.interval.toUpperCase();
        return "/topic/market_stream/" + exchange + "/" + base + quote + "/" + interval;
    }

    /**
     * Callback to subscribe to appropriate channels after connecting
     */
    subscribeToChannels = (stompClient) => {
        if(this.props.bot.running){
            stompClient.subscribe(this.generateSocketChannelBot(),this.onMessageRecievedBot);
            console.log("SUBSCRIBED => " + this.generateSocketChannelBot());
        }
        stompClient.subscribe(this.generateSocketChannelMarket(),this.onMessageRecievedMarket);
        stompClient.send(this.generateMessageChannelBot(),{});
        console.log("SUBSCRIBED => " + this.generateSocketChannelMarket());
    }

    /**
     * When component mounts grab historical candles for bot's market
     */
    componentDidMount(){

        //Connect websocket
        if(!this.websocket.isConnected()){

            //Connect to websocket
            this.websocket.connectBotEngine({
                sessionToken: SessionManager.getSessionToken()
                },
                this.subscribeToChannels,
                this.props.bot.serverId
            );
        }

        this.updateBot();
    }

    componentDidUpdate(){
        if(this.props.updateBot){
            this.updateBot();
        }
    }

    /**
     * Clear interval
     */
    componentWillUnmount(){
        clearInterval(this.currentInterval);
    }

    /**
     * Render chart once all data is available
     */
    render(){

        /**
        let currentPosition = {
            inPosition: false
        }

        //Checks for data and grabs current position information
        if( this.props.botLogs && 
            this.props.botLogs.length > 0 && 
            this.state.historicalCandles.length > 0 &&
            this.state.currentBotState){
                currentPosition = this.getPositionData();
        } */

        let currentPosition = {
            inPositino: false
        }

        return(
            <div className="margin-top-15">
                { currentPosition.inPosition && 
                    <div className="row margin-bottom-5 text-sm">
                        <div className="col-md-2 margin-left-50">
                            Buy Price: { currentPosition.buyPrice }
                        </div>
                        <div className="col-md-2">
                            Last Price: { currentPosition.currentPrice }
                        </div>
                        <div className="col-md-2">
                            Position Profit: <span>
                                { currentPosition.currentRoi > 0 ? <span className="text-success">
                                    ↑{ (currentPosition.currentRoi*100).toFixed(2) + "%" }
                                    </span> : <span className="text-danger"> 
                                    ↓{ (currentPosition.currentRoi*100).toFixed(2) + "%" }
                                    </span>
                                }
                            </span>
                        </div>
                        <div className="col-md-2">
                            Position Size: { currentPosition.currentAssets } { this.props.bot.market.split("-")[0].toUpperCase() }
                        </div>
                        <div className="col-md-2">
                            Stop Price: { currentPosition.stopLossLine.point.price }
                        </div>
                    </div>
                }{ !currentPosition.inPosition && this.state.currentBotState &&
                    <div className="row margin-bottom-5 text-sm">
                        <div className="col-md-12 margin-left-50">
                            *{ this.props.bot.name.toUpperCase() } is currently waiting to open a position
                        </div>
                    </div>
                }
                <div style={ { 
                    height: "700px"
                } }> 
                { this.props.botLogs && 
                this.props.botLogs.length > 0 && 
                this.state.historicalCandles.length > 0 &&
                this.state.currentBotState &&
                    <TVChartContainer containerId="tv_chart_container"
                                      newKline={ this.state.updateKline ? this.state.newKline : false }
                                      lastTimestamp={ this.state.currentBotState.candle.last_kline.timestamp }
                                      interval={ this.props.bot.interval }
                                      symbol={[ 
                                          this.props.bot.exchange.toUpperCase(),
                                          this.props.bot.market.split("-")[0].toUpperCase(),
                                          this.props.bot.market.split("-")[1].toUpperCase(),
                                      ]}
                                      candles={ this.state.historicalCandles }/>
                }{  ( !this.props.botLogs || 
                    this.state.historicalCandles.length === 0 ) &&
                    <h2 className="text-center margin-top-100">
                        Loading Datafeed...
                    </h2>
                }
                </div>
            </div>
        );
    }
}
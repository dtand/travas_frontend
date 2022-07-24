import * as React from 'react';
import { widget } from '../../charting_library/charting_library.min';
import ApiController from '../../js/ApiController';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const LIBRARY_PATH = '/charting_library/';

export default class TVChartContainer extends React.PureComponent {

	tvWidget = null;

	activeChart = null;

	lastTimestamp = null;

	config = {
		supported_resolutions: ["1", "5", "30", "60", "240", "D"],
		supports_timescale_marks: true,
		supports_marks: true
	}

	datafeed = {

		/* mandatory methods for realtime chart */
		onReady: cb => {
			setTimeout(() => cb(this.config), 0)
		},

		// only need searchSymbols when search is enabled
		searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {},
		resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
  
			const name = this.props.symbol[0] + ": " + this.props.symbol[1] + "-" + this.props.symbol[2];

			var symbol_stub = {
			 name: name,
			 description: '',
			 type: 'crypto',
			 session: '24x7',
			 timezone: 'America/New_York',
			 ticker: name,
			 minmov: 1,
			 pricescale: 100000000,
			 has_intraday: true,
			 intraday_multipliers: ['1', '60'],
			 supported_resolution:  ["1", "3", "5", "15", "30", "60", "120", "240", "D"],
			 volume_precision: 8,
			 data_status: 'streaming',
			}

		  	if (this.props.symbol[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
			 symbol_stub.pricescale = 100000000
			}
			
			setTimeout(function() {
			 onSymbolResolvedCallback(symbol_stub)
			}, 0)
		  
		},
		getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
			let bars = []
			const candles = this.props.candles;
			if (candles.length) {
				bars = candles.map(el => {
				 return {
				  time: new Date(el.timestamp).getTime(), 
				  low: Number(el.low),
				  high: Number(el.high),
				  open: Number(el.open),
				  close: Number(el.close),
				  volume: Number(el.volume)
				 }
				})
			}
			this.lastBar = bars[bars.length-1];
			onHistoryCallback(bars, {noData: false})
		},
		subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
			this.updateBar = onRealtimeCallback;
		},
		unsubscribeBars: subscriberUID => {},
		
		/* optional methods */
		getServerTime: cb => {},
		calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => { },
		getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => { 
			if(this.props.marks){
				onDataCallback(this.props.marks);
				this.setState({
					update: true
				});
			}
		},
		getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => { }
	}

	/**
	 * Maps interval string to trading view interval
	 */
	getInterval(){
		if(this.props.interval === "1d"){
			return "D";
		}
		else if(this.props.interval === "4h"){
			return "240";
		}
		else if(this.props.interval === "1h"){
			return "60";
		}
		else if(this.props.interval === "30m"){
			return "30";
		}
		else if(this.props.interval === "5m"){
			return "5";
		}
		else if(this.props.interval === "1m"){
			return "1";
		}
		return "D";
	}

	/**
	 * Aggregates information into widget object
	 */
	getWidgetOptions = () => {
		return {
			symbol: this.props.symbol,
			datafeed: this.datafeed,
			interval: this.getInterval(),
			container_id: this.props.containerId,
			library_path: LIBRARY_PATH,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings'],
			enabled_features: [],
			client_id: 'test',
			user_id: 'public_user_id',
			fullscreen: false,
			autosize: true,
			overrides: this.props.dark ? {
			 "paneProperties.background": "#131722",
			 "paneProperties.vertGridProperties.color": "#363c4e",
			 "paneProperties.horzGridProperties.color": "#363c4e",
			 "symbolWatermarkProperties.transparency": 90,
			 "scalesProperties.textColor" : "#AAA",
			 "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
			 "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
			} : {}
		};
	}

	/**
	 * Draws a position line
	 * @param {*} activeChart 
	 */
	drawPositionLine(activeChart,positionLine){

		activeChart.createShape(
			positionLine.point,
			positionLine.options
		);
		
		this.setState({
			update: true
		});
	}

	/**
	 * Called on mount to draw shapes
	 */
	drawShapes(activeChart){

		for(let s=0;s<this.props.shapes.length;s++){
			const shape = this.props.shapes[s];
			activeChart.createShape(shape.point,shape.options);
		}

		this.setState({
			update: true
		});
	}

	/**
	 * Call to build chart
	 */
	buildChart(self){

		//Create TV widget
		const tvWidget = new widget(this.getWidgetOptions());

		//Set member to tv widget
		this.tvWidget = tvWidget;

		//Set on chart ready function
		tvWidget.onChartReady(() => {

			const activeChart = tvWidget.activeChart();

			//Draw any shapes
			if(self.props.shapes){
				self.drawShapes(activeChart);
			}

			//Draw any position lines
			// if(self.props.currentPosition){
			// 	self.drawPositionLine(activeChart,this.props.currentPosition.positionLine);	/** Where bot opened position */
			// 	self.drawPositionLine(activeChart,this.props.currentPosition.stopLossLine);	/** Where bot's stop loss is */
			// }

			const button = tvWidget.createButton()
				.attr('title', 'Click to show a notification popup')
				.addClass('apply-common-tooltip')
				.on('click', () => tvWidget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						console.log('Noticed!');
					},
				}));

			button[0].innerHTML = 'Check API';
		});
	}

	/**
	 * Completely destroys the chart
	 */
	destroyChart = () => {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	/**
	 * Call if a different dataset is flowing in
	 */
	resetChart = () => {
		this.destroyChart();
		this.buildChart(this);
		if(this.props.resetChartCallback){
			this.props.resetChartCallback()
		}
	}

	/**
	 * Setup widget object and render chart
	 */
	componentDidMount() {
		this.buildChart(this);
	}

	/**
	 * Called to update newest bar
	 */
	componentDidUpdate(){

		//Clear entire chart for new data feed
		if(this.props.resetChart){
			this.resetChart();
		}

		//Redraw all lines with new provided lines
		if(this.tvWidget && this.props.redrawLines){
			const activeChart = this.tvWidget.activeChart();
			activeChart.removeAllShapes();
			this.drawPositionLine(activeChart,this.props.currentPosition.positionLine);	/** Where bot opened position */
			this.drawPositionLine(activeChart,this.props.currentPosition.stopLossLine);	/** Where bot's stop loss is */
			this.props.redrawLinesCallback();
		}
		
		//Check if bar needs to be updated
		if (this.props.newKline && this.updateBar){
			this.lastBar = this.props.newKline;
			this.updateBar(this.lastBar);
		}
	}

	/**
	 * Remove the TV widget
	 */
	componentWillUnmount() {
		this.destroyChart()
	}

	render() {
		return (
			<div style={ { 
                height: "700px"
            } }  id={ this.props.containerId }
				 className={ 'TVChartContainer' }
			/>
		);
	}
}
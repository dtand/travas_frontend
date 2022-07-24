import React from "react";
import OwlCarousel from 'react-owl-carousel';

export default class RoadmapCarouselItem extends React.Component {

    render(){
        return (<div>
            <div className={ this.props.position }>
                <i className={ this.props.iconClass }/>
            </div>
            <br/>
            <div className="item roadmap-carousel-item margin-bottom-100">
                <br/>
                <h3> <div className="roadmap-item-title text-right"><strong>{ this.props.quarter }</strong></div></h3>
                <div className="roadmap-text-wrapper row">
                    <div className="col-md-12">
                        <p class="roadmap-text">
                            { this.props.goals }
                        </p>
                    </div>
                </div>
            </div>
        </div>)
    }
}
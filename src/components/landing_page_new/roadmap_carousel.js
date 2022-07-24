import React from "react";
import OwlCarousel from 'react-owl-carousel';
import RoadmapCarouselItem from "./roadmap_carousel_item";
import Constants from "../../js/Constants";

export default class RoadmapCarousel extends React.Component {

    render(){
        return(	
            <div className="text-white pad-top-50 pad-bottom-100 margins-5 roadmap-panel" id="roadmap">
                <div className="text-center">
                    <h2 >
                        Roadmap
                    </h2>
                    <p className="text-secondary">
                        See our goals and action items for 2018 and beyond
                    </p>
                </div>
                <br/><br/><br/><br/>
                <div className="roadmap-theme">
                    <div className="margin-top-10 margin-bottom-10">
                        <OwlCarousel className="owl-theme"
                                loop={ true }
                                margin={ 60 }
                                stagePadding={ 20 }
                                items={ Constants.IS_MOBILE ? 1 : 3 }
                                autoplay={ true }
                                navigation={ false }
                                nav={ false }
                                pagination={ false }
                                dots={ false }>

                                <RoadmapCarouselItem quarter={ <span>Q1 <br/> 2018</span> }
                                                    title={ "Development Phase I" }
                                                    iconClass={ "fa fa-lightbulb" }
                                                    position={ "roadmap-icon-top" }
                                                    goals={
                                            <div className="roadmap-goals-wrapper">      
                                                <p>      
                                                    I. Product Concept Completion <i className="fa fa-check"/> <br/>
                                                    II. Forge Backend Engine (APIs) <i className="fa fa-check"/> <br/>
                                                    III. Forge Bot Trading Engine <i className="fa fa-check"/> <br/>
                                                    IV. Initial Frontend Skeleton <i className="fa fa-check"/> <br/>
                                                </p>
                                            </div>
                                }/>

                                <RoadmapCarouselItem quarter={ <span>Q2 <br/> 2018</span> }
                                                    title={ "Development Phase II" }
                                                    iconClass={ "fa fa-server" }
                                                    position={ "roadmap-icon-top" }
                                                    goals={
                                            <div className="roadmap-goals-wrapper">      
                                                <p>      
                                                    I. Backend Unit Testing <i className="fa fa-check"/> <br/>
                                                    II. Bulk Signal Additions <i className="fa fa-check"/> <br/>
                                                    III. Initial UI <i className="fa fa-check"/> <br/>
                                                    IV. Internal Deployment <i className="fa fa-check"/> <br/>
                                                </p>
                                            </div>
                                }/>

                                <RoadmapCarouselItem quarter={ <span>Q3 <br/> 2018</span> }
                                                    title={ "Development Phase II" }
                                                    iconClass={ "fa fa-desktop" }
                                                    position={ "roadmap-icon-top" }
                                                    goals={
                                            <div className="roadmap-goals-wrapper">      
                                                <p>      
                                                    I. Complete Platform Alpha <i className="fa fa-check"/> <br/>
                                                    II. Deploy Private Alpha <i className="fa fa-check"/> <br/>
                                                    III. Newsletter Launch <i className="fa fa-check"/> <br/>
                                                    IV. Continuous UI Optimization <i className="fa fa-check"/> <br/>
                                                </p>
                                            </div>
                                }/>

                                <RoadmapCarouselItem quarter={ <span>Q4 <br/> 2018</span> }
                                                    title={ "Development Phase II" }
                                                    iconClass={ "fa fa-users" }
                                                    position={ "roadmap-icon-top" }
                                                    goals={
                                            <div className="roadmap-goals-wrapper">      
                                                <p>      
                                                    I. First Half - Open Alpha <i className="fa fa-check"/> <br/>
                                                    II. UI Refactoring & Optimization<i className="fa fa-check"/> <br/>
                                                    III. UX Upgrade <i className="fa fa-check"/> <br/>
                                                    IV. Continuous UI Optimization <i className="fa fa-check"/> <br/>
                                                    V. Launch Bot Marketplace <i className="fa fa-check"/> <br/>
                                                    VI. Launch Groups <i className="fa fa-check"/> <br/>
                                                    VII. Construct Marketing Plan <i className="fa fa-check"/> <br/>
                                                    VIII. Launch Live Trading (Binance) <i className="fa fa-check"/><br/>
                                                    IX. Transition to Open Beta <i className="fa fa-check"/><br/>
                                                </p>
                                            </div>
                                }/>
                                <RoadmapCarouselItem quarter={ <span>Q1 <br/> 2019 </span> }
                                                    title={ "Development Phase II" }
                                                    iconClass={ "fa fa-paper-plane-o" }
                                                    position={ "roadmap-icon-top" }
                                                    goals={
                                            <div className="roadmap-goals-wrapper">      
                                                <p>      
                                                    I. Rolling Open Beta <i className="fa fa-check"/> <br/>
                                                    II. Publish Membership Tiers <br/>
                                                    III. Launch Advanced Signal Design <br/>
                                                    IV. Lanch Bot Monitor Channels <br/>
                                                    V. Add 2-3 Exchanges <br/>
                                                    VI. Add 4-5 New Indicators <br/>
                                                </p>
                                            </div>
                                }/>
                                <RoadmapCarouselItem quarter={ <span>Q2 <br/> 2019 </span> }
                                                    title={ "Development Phase II" }
                                                    iconClass={ "fa fa-rocket" }
                                                    position={ "roadmap-icon-top" }
                                                    goals={
                                            <div className="roadmap-goals-wrapper">      
                                                <p>      
                                                    I. Launch Trading Competitions  <br/>
                                                    II. Launch Referral Program <br/>
                                                    III. Add 1-2 More exchanges <br/>
                                                    IV. Production Launch <br/>
                                                    V. Continued Marketing <br/>
                                                    VI. Additional Partnerships <br/>
                                                </p>
                                            </div>
                                }/>
                                <RoadmapCarouselItem quarter={ <span>Q3 <br/> 2019 </span> }
                                                    title={ "Development Phase II" }
                                                    iconClass={ "fa fa-mobile" }
                                                    position={ "roadmap-icon-top" }
                                                    goals={
                                            <div className="roadmap-goals-wrapper">      
                                                <p>      
                                                    I. Start IOS Application  <br/>
                                                    II. Publish Travas Platform APIs <br/>
                                                    III. Integrate 1-2 ML/AI Signals <br/>
                                                    IV. Begin Sponshorship Campaign <br/>
                                                </p>
                                            </div>
                                }/>
                                <RoadmapCarouselItem quarter={ <span>Q4 <br/> 2019 </span> }
                                                    title={ "Development Phase II" }
                                                    iconClass={ "fa fa-calendar" }
                                                    position={ "roadmap-icon-top" }
                                                    goals={
                                            <div className="roadmap-goals-wrapper">      
                                                <p>      
                                                    I. Launch Mobile App  <br/>
                                                    II. Add additional Signals/Indicators <br/>
                                                    III. Machine Learning API Development <br/>
                                                    IV. Construct 2020+ Roadmap <br/>
                                                </p>
                                            </div>
                                }/>
                        </OwlCarousel>
                    </div>
                </div>
                <br/><br/><br/><br/>
        </div>
    )}
}
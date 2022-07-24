import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginMain from '../components/login/login_main';
import SignupMain2 from '../components/signup/signup_main_2';
import VerifyMain from "../components/etc/verify_main";
import ChangePasswordMain from "../components/login/change_password_main";
import ErrorMain from "../components/etc/error_main";
import PlatformLandingMain from '../components/landing_page/platform_landing_main';
import PlatformMain from "../components/platform/platform_main";
import TermsBody from '../components/landing_pages/terms_body';
import AdminMain from "../components/admin/admin_main";
import LandingPageNew from "../components/landing_page_new/landing_page_new";
import LandingPageBots from "../components/landing_page_new/landing_page_bots";
import LandingPageDemo from '../components/landing_page_new/landing_page_demo';
import LandingPageTeam from '../components/landing_page_new/landing_page_team';
import LandingPageFaq from '../components/landing_page_new/landing_page_faq';
import LandingPageDonate from '../components/landing_page_new/landing_page_donate';

export default () => (
  <BrowserRouter>
    <Switch>

      <Route path="/" exact render={ () => <LandingPageNew/> } />

      <Route path="/bots" exact render={ () => <LandingPageBots/> } />

      <Route path="/login" exact render={ () => <LoginMain /> } />

      <Route path="/signup" exact render={ () => <SignupMain2 /> } />

      <Route path="/team" exact render={ () => <LandingPageTeam/> } />

      <Route path="/donate" exact render={ () => <LandingPageDonate/> } />

      <Route path="/faq" exact render={ () => <LandingPageFaq/> } />

      <Route path="/admin" exact render={ () => <PlatformLandingMain body={ <AdminMain /> } /> } />

      <Route path="/demo" exact render={ () => <LandingPageDemo/> } />

      <Route path="/verify" exact render={ () => <VerifyMain /> } />

      <Route path="/change_password" exact render={ () => <ChangePasswordMain /> } />

      <Route path="/error" exact render={ () => <ErrorMain /> } />

      <Route path="/alpha" exact render={ () => <PlatformMain /> } />

      <Route path="/beta" exact render={ () => <PlatformMain /> } />

      <Route path="/dashboard" exact render={ () => <PlatformMain /> } />

      <Route path="/terms" exact render={ () => <PlatformLandingMain body={ <TermsBody /> } /> } />


    </Switch>
  </BrowserRouter>
);
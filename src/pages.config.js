/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Home from './pages/Home';
import Start from './pages/Start';
import Pricing from './pages/Pricing';
import PublicHubs from './pages/PublicHubs';
import Docs from './pages/Docs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Compare from './pages/Compare';
import About from './pages/About';
import OpenSource from './pages/OpenSource';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Dashboard from './pages/Dashboard';
import CreateHub from './pages/CreateHub';
import HubDetail from './pages/HubDetail';
import AgentIdentities from './pages/AgentIdentities';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Start": Start,
    "Pricing": Pricing,
    "PublicHubs": PublicHubs,
    "Docs": Docs,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Compare": Compare,
    "About": About,
    "OpenSource": OpenSource,
    "Terms": Terms,
    "Privacy": Privacy,
    "Dashboard": Dashboard,
    "CreateHub": CreateHub,
    "HubDetail": HubDetail,
    "AgentIdentities": AgentIdentities,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
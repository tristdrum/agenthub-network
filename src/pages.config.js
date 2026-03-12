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
import About from "./pages/About";
import AgentIdentities from "./pages/AgentIdentities";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Compare from "./pages/Compare";
import CreateHub from "./pages/CreateHub";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs";
import Home from "./pages/Home";
import HubDetail from "./pages/HubDetail";
import Interest from "./pages/Interest";
import OpenSource from "./pages/OpenSource";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import PublicHubs from "./pages/PublicHubs";
import Settings from "./pages/Settings";
import Start from "./pages/Start";
import Terms from "./pages/Terms";
import Status from "./pages/Status";
import Contact from "./pages/Contact";
import __Layout from "./Layout.jsx";

export const PAGES = {
  About: About,
  AgentIdentities: AgentIdentities,
  Blog: Blog,
  BlogPost: BlogPost,
  Compare: Compare,
  CreateHub: CreateHub,
  Dashboard: Dashboard,
  Docs: Docs,
  Home: Home,
  HubDetail: HubDetail,
  Interest: Interest,
  OpenSource: OpenSource,
  Pricing: Pricing,
  Privacy: Privacy,
  PublicHubs: PublicHubs,
  Settings: Settings,
  Start: Start,
  Terms: Terms,
  Status: Status,
  Contact: Contact,
};

export const pagesConfig = {
  mainPage: "Home",
  Pages: PAGES,
  Layout: __Layout,
};

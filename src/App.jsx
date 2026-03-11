import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { pagesConfig } from "./pages.config";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { createPageUrl } from "@/utils";
import { isProtectedPage } from "@/lib/auth-utils";

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    <>{children}</>
  );

const FullScreenMessage = ({ title, body }) => (
  <div className="fixed inset-0 flex items-center justify-center px-4">
    <div className="max-w-md text-center">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {body}
      </p>
    </div>
  </div>
);

const PageGate = ({ pageName, children }) => {
  const location = useLocation();
  const { configError, isAuthenticated, isLoadingAuth } = useAuth();

  if (!isProtectedPage(pageName)) {
    return children;
  }

  if (configError) {
    return (
      <FullScreenMessage
        title="Supabase configuration missing"
        body={`${configError} Add the client auth variables before using the app routes.`}
      />
    );
  }

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`,
    );
    return <Navigate replace to={`${createPageUrl("Start")}?next=${next}`} />;
  }

  return children;
};

const AuthenticatedApp = () => (
  <Routes>
    <Route
      path="/"
      element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      }
    />
    {Object.entries(Pages).flatMap(([path, Page]) => {
      const routePath = createPageUrl(path);
      const legacyPath = `/${path}`;
      const routes = [];

      if (routePath !== "/") {
        routes.push(
          <Route
            key={routePath}
            path={routePath}
            element={
              <PageGate pageName={path}>
                <LayoutWrapper currentPageName={path}>
                  <Page />
                </LayoutWrapper>
              </PageGate>
            }
          />,
        );
      }

      if (legacyPath !== routePath) {
        routes.push(
          <Route
            key={legacyPath}
            path={legacyPath}
            element={<Navigate replace to={routePath} />}
          />,
        );
      }

      return routes;
    })}
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

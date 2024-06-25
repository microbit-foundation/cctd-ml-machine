/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ChakraProvider } from "@chakra-ui/react";
import React, { ReactNode, useMemo } from "react";
import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";
import { ConsentProvider } from "./compliance";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorHandlerErrorView from "./components/ErrorHandlerErrorView";
import NotFound from "./components/NotFound";
import TranslationProvider from "./messages/TranslationProvider";
import SettingsProvider from "./settings";
import theme from "./theme/theme";
import HomePage from "./pages/HomePage";
import { createHomePageUrl } from "./urls";

export interface ProviderLayoutProps {
  children: ReactNode;
}

const Providers = ({ children }: ProviderLayoutProps) => {
  return (
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <ConsentProvider>
          <SettingsProvider>
            <TranslationProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
            </TranslationProvider>
          </SettingsProvider>
        </ConsentProvider>
      </ChakraProvider>
    </React.StrictMode>
  );
};

const Layout = () => {
  return (
    // We use this even though we have errorElement as this does logging.
    <ErrorBoundary>
      <ScrollRestoration />
      <Outlet />
    </ErrorBoundary>
  );
};

const createRouter = () => {
  return createBrowserRouter([
    {
      id: "root",
      path: "",
      element: <Layout />,
      // This one gets used for loader errors (typically offline)
      // We set an error boundary inside the routes too that logs render-time errors.
      // ErrorBoundary doesn't work properly in the loader case at least.
      errorElement: <ErrorHandlerErrorView />,
      children: [
        {
          path: createHomePageUrl(),
          element: <HomePage />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);
};

const App = () => {
  const router = useMemo(createRouter, []);
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};

export default App;

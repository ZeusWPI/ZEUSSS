import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Footer } from "./components/Footer";
import { queryClient } from "./lib/query";
import { TeamContextProvider } from "./lib/stores/teamContext";
import { theme } from "./lib/theme";
import { router } from "./routes";
import * as Sentry from "@sentry/browser";

import "./styles/index.scss";

Sentry.init({ dsn: "https://979ee2ae77cd4906a5c50fb0bd6e36db@glitchtip.zeus.gent/9" });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
      <QueryClientProvider client={queryClient}>
        <TeamContextProvider>
          <ModalsProvider>
            <div className="content-wrapper">
              <Notifications />
              <RouterProvider router={router} />
            </div>
            <Footer />
          </ModalsProvider>
        </TeamContextProvider>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./lib/query";
import { TeamContextProvider } from "./lib/stores/teamContext";
import { theme } from "./lib/theme";
import { router } from "./routes";

const App = () => (
  <div>
    VEK X Zeus
  </div>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TeamContextProvider>
        <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
          <ModalsProvider>
            <Notifications />
            <RouterProvider router={router} />
          </ModalsProvider>
        </MantineProvider>
      </TeamContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

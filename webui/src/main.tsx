import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Bracket } from "./components/Bracket";
import { Footer } from "./components/Footer";
import { devBracketMatches, devBracketRounds } from "./lib/devData";
import { queryClient } from "./lib/query";
import { TeamContextProvider } from "./lib/stores/teamContext";
import { theme } from "./lib/theme";
import { router } from "./routes";

import "./styles/index.scss";

const App = () => {
  const bracket = useMemo(() => {
    const bracket: Brackets.Bracket = [];
    for(let i = 0; i < devBracketRounds.rounds; i++) {
      bracket[i] = devBracketMatches.filter(match => match.parentId === i);
    }
    return bracket;
  }, []);
  return (
    <div>
      <Bracket bracket={bracket} />
    </div>
  );
};

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

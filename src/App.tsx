import { BrowserRouter } from "react-router-dom";
// Router
import Router from "./Router";
// Custom Providers
import { HelmetProvider } from "react-helmet-async";
import { SidebarProvider } from "./components/contexts/SidebarContext";
// Themes
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "./theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <HelmetProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </SidebarProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;

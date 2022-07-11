import { BrowserRouter } from "react-router-dom";
// Router
import Router from "./Router";
// Custom Providers
import { HelmetProvider } from "react-helmet-async";
// Themes
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "./theme/ThemeProvider";
import AuthProvider from "./hocs/AuthProvider";

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <HelmetProvider>
        <AuthProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;

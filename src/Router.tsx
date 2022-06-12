import React from 'react';
import { Navigate, useRoutes } from "react-router-dom";
// Layouts
import DashboardLayout from "./layouts/Dashboard";
import LogoOnlyLayout from "./layouts/LogoOnly";
import SuspenseLoader from './components/SuspenseLoader';
// Pages
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));

function Router() {
  return useRoutes([
    { 
        path: '/app',
        element: <DashboardLayout />,
        children: [
            { path: 'sample', element: <SuspenseLoader children={<Home />} /> },
        ]
    },
    { 
        path: '/',
        element: <LogoOnlyLayout />,
        children: [
            { path: '/', element: <Navigate to="/app/sample" /> },
            { path: 'login', element: <SuspenseLoader children={<Login />} /> },
        ]
    }
  ]);
}

export default Router;
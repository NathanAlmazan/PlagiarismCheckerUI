import React from 'react';
import { Navigate, useRoutes } from "react-router-dom";
// Layouts
import DashboardLayout from "./layouts/Dashboard";
import LogoOnlyLayout from "./layouts/LogoOnly";
import SuspenseLoader from './components/SuspenseLoader';
// Pages
const SubmitPanel = React.lazy(() => import("./pages/students/SubmitPanel"));
const Login = React.lazy(() => import("./pages/Login"));
const TDashboard = React.lazy(() => import("./pages/teachers/Dashboard"));
const ClassroomPage = React.lazy(() => import("./pages/teachers/Classroom"));

function Router() {
  return useRoutes([
    { 
        path: '/teacher',
        element: <DashboardLayout />,
        children: [
            { path: 'app', element: <SuspenseLoader children={<TDashboard />} /> },
            { path: 'class/:classCode', element: <SuspenseLoader children={<ClassroomPage />} /> }
        ]
    },
    { 
      path: '/student',
      element: <DashboardLayout />,
      children: [
          { path: 'app', element: <SuspenseLoader children={<TDashboard />} /> },
          { path: 'submit', element: <SuspenseLoader children={<SubmitPanel />} /> }
      ]
    },
    { 
        path: '/',
        element: <LogoOnlyLayout />,
        children: [
            { path: '/', element: <Navigate to="/teacher/app" /> },
            { path: 'login', element: <SuspenseLoader children={<Login />} /> },
        ]
    }
  ]);
}

export default Router;
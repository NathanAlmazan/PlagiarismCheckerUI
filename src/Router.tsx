import React from 'react';
import { useRoutes } from "react-router-dom";
// Layouts
import DashboardLayout from "./layouts/Dashboard";
import LogoOnlyLayout from "./layouts/LogoOnly";
import SuspenseLoader from './components/SuspenseLoader';
// Pages
const Home = React.lazy(() => import("./pages/Home"));
const Status404 = React.lazy(() => import("./pages/Status404"))
const SubmitPanel = React.lazy(() => import("./pages/students/SubmitPanel"));
const Login = React.lazy(() => import("./pages/Login"));
const TDashboard = React.lazy(() => import("./pages/teachers/Dashboard"));
const SDashboard = React.lazy(() => import("./pages/students/Dashboard"));
const TClassroomPage = React.lazy(() => import("./pages/teachers/Classroom"));
const SClassroomPage = React.lazy(() => import("./pages/students/Classroom"));
const AssessDocument = React.lazy(() => import("./pages/teachers/AssessDocument"));

function Router() {
  return useRoutes([
    { 
        path: '/teacher',
        element: <DashboardLayout />,
        children: [
            { path: 'app', element: <SuspenseLoader children={<TDashboard />} /> },
            { path: 'class/:classCode', element: <SuspenseLoader children={<TClassroomPage />} /> },
            { path: 'assess/:fileUid/:assignId', element: <SuspenseLoader children={<AssessDocument />} /> },
            { path: 'upload/:classCode/:assignId', element: <SuspenseLoader children={<SubmitPanel />} /> }
        ]
    },
    { 
      path: '/student',
      element: <DashboardLayout />,
      children: [
          { path: 'app', element: <SuspenseLoader children={<SDashboard />} /> },
          { path: 'class/:classCode', element: <SuspenseLoader children={<SClassroomPage />} /> },
          { path: 'submit/:classCode/:assignId', element: <SuspenseLoader children={<SubmitPanel />} /> }
      ]
    },
    { 
        path: '',
        element: <LogoOnlyLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'account', element: <SuspenseLoader children={<Login />} /> },
            { path: '*', element: <SuspenseLoader children={<Status404 />} /> }
        ]
    }
  ]);
}

export default Router;
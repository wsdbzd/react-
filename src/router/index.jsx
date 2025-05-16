import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Main from "../pages/main";
import Mall from "../pages/mall";
import User from "../pages/user";
import PageOne from "../pages/other/pageOne";
import PageTwo from "../pages/other/pageTwo";
import Login from "../pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Navigate to="/home" />
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "mall",
        element: <Mall />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "other",
        children: [
          {
            path: "pageOne",
            element: <PageOne />,
          },
          {
            path: "pageTwo",
            element: <PageTwo />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />
  },
]);

export default router;

import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LOGIN, LANDING, SIGNUP, HOME } from "./routes";
import Layout from "../components/Layout";

const Landing = lazy(() => import("../pages/landing/Landing"));
const Login = lazy(() => import("../pages/login/Login"));
const Signup = lazy(() => import("../pages/signup/Signup"));
const Home = lazy(() => import("../pages/home/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));

const router = createBrowserRouter([
  {
    path: LANDING,
    element: <Layout />,
    errorElement: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotFound />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Landing />
          </Suspense>
        ),
      },
      {
        path: LOGIN,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: SIGNUP,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: HOME,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};

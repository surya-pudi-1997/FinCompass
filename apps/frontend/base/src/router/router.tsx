import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from "@/components/layouts/RootLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import CalculatorLayout from "@/components/layouts/CalculatorLayout";
import { routes } from "./routes";

const Landing = lazy(() => import("@/pages/landing"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const Home = lazy(() => import("@/pages/home"));
const NotFound = lazy(() => import("@/pages/notFound"));
const Accounts = lazy(() => import("@/pages/accounts"));
const Assets = lazy(() => import("@/pages/assets"));
const Transactions = lazy(() => import("@/pages/transactions"));
const Analyze = lazy(() => import("@/pages/analyze"));
const Profile = lazy(() => import("@/pages/profile"));
const Calculator = lazy(() => import("@/pages/calculator"));
const DepositCalculator = lazy(
  () => import("@/pages/calculator/depositCalculator")
);
const CarCalculator = lazy(() => import("@/pages/calculator/carCalculator"));
const LoanCalculator = lazy(() => import("@/pages/calculator/loanCalculator"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path={routes.LANDING} element={<Landing />} />
            <Route path={routes.LOGIN} element={<Login />} />
            <Route path={routes.REGISTER} element={<Register />} />
            <Route element={<AuthLayout />}>
              <Route path={routes.HOME} element={<Home />} />
              <Route path={routes.TRANSACTIONS} element={<Transactions />} />
              <Route path={routes.ANALYZE} element={<Analyze />} />
              <Route path={routes.ASSETS} element={<Assets />} />
              <Route path={routes.ACCOUNTS} element={<Accounts />} />
              <Route path={routes.PROFILE} element={<Profile />} />
              <Route path={routes.CALCULATOR} element={<CalculatorLayout />}>
                <Route index element={<Calculator />} />
                <Route path={routes.DEPOSIT} element={<DepositCalculator />} />
                <Route path={routes.CAR} element={<CarCalculator />} />
                <Route path={routes.LOAN} element={<LoanCalculator />} />
              </Route>
            </Route>
            <Route path={routes.NOT_FOUND} element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;

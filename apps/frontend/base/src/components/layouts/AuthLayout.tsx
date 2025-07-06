import Header from "../ui/compounds/Header";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <>
      <Header />
      <main className="flex w-screen flex-col h-[calc(100vh-40px)] overflow-y-auto">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;

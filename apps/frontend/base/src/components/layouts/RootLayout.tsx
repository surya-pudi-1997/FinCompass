import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="flex h-screen flex-col w-screen overflow-hidden">
      <Outlet />
    </div>
  );
};

export default RootLayout;

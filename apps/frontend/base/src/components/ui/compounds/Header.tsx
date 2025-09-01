import { useLocation, useNavigate } from "react-router";
import { routes } from "@/router/routes";
import { TrendingUp, LogOut } from "lucide-react";
import { useUserStore } from "@/shared/stores/userStore";

const Header = () => {
  const location = useLocation();
  const { logout } = useUserStore();

  const navigate = useNavigate();

  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-4 py-2  h-[52px] border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold">Fin Compass</h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a
              href={routes.HOME}
              className={`hover:underline ${isActiveRoute(routes.HOME) ? "font-bold" : ""}`}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href={routes.ACCOUNTS}
              className={`hover:underline ${isActiveRoute(routes.ACCOUNTS) ? "font-bold" : ""}`}
            >
              Accounts
            </a>
          </li>
          <li>
            <a
              href={routes.ASSETS}
              className={`hover:underline ${isActiveRoute(routes.ASSETS) ? "font-bold" : ""}`}
            >
              Assets
            </a>
          </li>
          <li>
            <a
              href={routes.TRANSACTIONS}
              className={`hover:underline ${isActiveRoute(routes.TRANSACTIONS) ? "font-bold" : ""}`}
            >
              Transactions
            </a>
          </li>
          <li>
            <a
              href={routes.CALCULATOR}
              className={`hover:underline ${isActiveRoute(routes.CALCULATOR) ? "font-bold" : ""}`}
            >
              Calculator
            </a>
          </li>
          <li>
            <a
              href={routes.ANALYZE}
              className={`hover:underline ${isActiveRoute(routes.ANALYZE) ? "font-bold" : ""}`}
            >
              Analyze
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

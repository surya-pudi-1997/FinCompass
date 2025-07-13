import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore, useUserSelectors } from "@/shared/stores";
import useGetProfileService from "./services/useGetProfile";

const HomePage = () => {
  const { user } = useUserStore();
  const networth = useUserSelectors.networth();
  const { apiLoading, getProfile } = useGetProfileService();
  const [isNetworthVisible, setIsNetworthVisible] = useState(false);

  const formatCurrency = (
    amount: number | undefined,
    currency: string = "USD"
  ) => {
    if (amount === undefined) return "N/A";
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    });
    const formatted = formatter.format(amount);

    // Convert to Indian format (lakhs/crores)
    const absAmount = Math.abs(amount);
    let indianFormat = "";
    if (absAmount >= 10000000) {
      indianFormat = ` (${(amount / 10000000).toFixed(2)} Cr)`;
    } else if (absAmount >= 100000) {
      indianFormat = ` (${(amount / 100000).toFixed(2)} L)`;
    }

    return formatted + indianFormat;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (apiLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}
          {user?.fullName ? `, ${user.fullName}!` : "!"}
        </h1>
        <p className="text-muted-foreground">
          Welcome back to your financial dashboard
        </p>
      </div>

      {/* Networth Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Net Worth
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNetworthVisible(!isNetworthVisible)}
              className="h-8 w-8"
            >
              {isNetworthVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isNetworthVisible
              ? formatCurrency(networth, user?.preferredCurrency)
              : "****"}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Currency: {user?.preferredCurrency || "USD"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;

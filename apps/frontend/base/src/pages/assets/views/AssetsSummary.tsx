import React from "react";
import { TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAssetsSelectors } from "@/shared/stores";
import { useCurrency } from "@/shared/hooks";

const AssetsSummary: React.FC = () => {
  const assets = useAssetsSelectors.assets();
  const { formatCurrency } = useCurrency();

  const calculateSummary = () => {
    if (!assets || assets.length === 0) {
      return {
        totalValue: 0,
        totalBoughtValue: 0,
        totalGainLoss: 0,
        activeAssets: 0,
        soldAssets: 0,
        totalIncome: 0,
        totalExpenses: 0,
      };
    }

    const activeAssets = assets.filter((asset) => asset.status === "Active");
    const soldAssets = assets.filter((asset) => asset.status === "Sold");

    const totalBoughtValue = assets.reduce(
      (sum = 0, asset) => sum + Number(asset.bought_value || 0),
      0
    );

    const totalCurrentValue = activeAssets.reduce(
      (sum = 0, asset) => sum + Number(asset.bought_value || 0),
      0
    );

    const totalSoldValue = soldAssets.reduce(
      (sum = 0, asset) => sum + Number(asset.sold_value || 0),
      0
    );

    const totalValue =
      Number(totalCurrentValue || 0) + Number(totalSoldValue || 0);
    console.log({ totalValue, totalCurrentValue, totalBoughtValue });

    const totalGainLoss = soldAssets.reduce((sum = 0, asset) => {
      const gain =
        Number(asset.sold_value || 0) - Number(asset.bought_value || 0);
      return sum + gain;
    }, 0);

    const totalIncome = assets.reduce(
      (sum = 0, asset) => sum + Number(asset.income || 0),
      0
    );

    const totalExpenses = assets.reduce(
      (sum = 0, asset) => sum + Number(asset.expense || 0),
      0
    );

    return {
      totalValue,
      totalBoughtValue,
      totalGainLoss,
      activeAssets: activeAssets.length,
      soldAssets: soldAssets.length,
      totalIncome,
      totalExpenses,
    };
  };

  const summary = calculateSummary();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Portfolio Value
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.activeAssets + summary.soldAssets} total assets
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {summary.activeAssets}
          </div>
          <p className="text-xs text-muted-foreground">
            Value:{" "}
            {formatCurrency(
              summary.totalValue -
                (summary.soldAssets > 0
                  ? assets
                      ?.filter((a) => a.status === "Sold")
                      .reduce(
                        (sum = 0, asset) => sum + (asset.sold_value || 0),
                        0
                      ) || 0
                  : 0)
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {summary.totalGainLoss >= 0 ? "Total Gains" : "Total Losses"}
          </CardTitle>
          {summary.totalGainLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              summary.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {summary.totalGainLoss >= 0 ? "+" : ""}
            {formatCurrency(summary.totalGainLoss)}
          </div>
          <p className="text-xs text-muted-foreground">
            From {summary.soldAssets} sold assets
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              summary.totalIncome - summary.totalExpenses >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {summary.totalIncome - summary.totalExpenses >= 0 ? "+" : ""}
            {formatCurrency(summary.totalIncome - summary.totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            Income: {formatCurrency(summary.totalIncome)} | Expenses:{" "}
            {formatCurrency(summary.totalExpenses)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetsSummary;

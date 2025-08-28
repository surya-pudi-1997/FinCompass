import React, { useState } from "react";
import {
  Trash2,
  Calendar,
  Home,
  Car,
  TrendingUp,
  Package,
  Edit,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Asset } from "@fin-compass/types";
import { useCurrency } from "@/shared/hooks";
import { formatDate as formatDateUtil } from "@/shared/utils";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface AssetCardProps {
  asset: Asset;
  onDelete: (assetId: string) => void;
  onEdit: (asset: Asset) => void;
  isDeleting?: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onDelete,
  onEdit,
  isDeleting = false,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { formatCurrency } = useCurrency();

  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString);
  };

  console.log({ asset });

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "Real Estate":
        return <Home className="h-4 w-4" />;
      case "Vehicle":
        return <Car className="h-4 w-4" />;
      case "Stock":
      case "Bond":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getAssetTypeDisplay = (type: string) => {
    return type;
  };

  const getCurrentValue = () => {
    if (asset.status === "Sold" && asset.sold_value) {
      return asset.sold_value;
    }
    return asset.bought_value;
  };

  const getValueColor = () => {
    if (asset.status === "Sold") {
      return asset.sold_value && asset.sold_value >= asset.bought_value
        ? "text-green-600"
        : "text-red-600";
    }
    return "text-blue-600";
  };

  const getStatusBadge = () => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          asset.status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {asset.status}
      </span>
    );
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{asset.name}</CardTitle>
            <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
              {getAssetTypeDisplay(asset.type)}
            </span>
          </div>
          <CardAction>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(asset)}
                disabled={isDeleting}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardAction>
        </div>
        <CardDescription className="flex items-center gap-2">
          {getAssetTypeIcon(asset.type)}
          {getStatusBadge()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {asset.status === "Sold" ? "Sold Value" : "Current Value"}
            </span>
            <span className={`text-2xl font-bold ${getValueColor()}`}>
              {formatCurrency(getCurrentValue())}
            </span>
          </div>

          {asset.status === "Active" && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Bought Value
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(asset.bought_value)}
              </span>
            </div>
          )}

          {asset.status === "Sold" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Bought Value
                </span>
                <span className="text-sm font-medium">
                  {formatCurrency(asset.bought_value)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gain/Loss</span>
                <span
                  className={`text-sm font-medium ${
                    asset.sold_value && asset.sold_value >= asset.bought_value
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {asset.sold_value
                    ? formatCurrency(asset.sold_value - asset.bought_value)
                    : "N/A"}
                </span>
              </div>
            </>
          )}

          {(asset.income || asset.expense) && (
            <div className="border-t pt-3 space-y-2">
              {asset.income && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Income</span>
                  <span className="text-sm font-medium text-green-600">
                    +{formatCurrency(asset.income)}
                  </span>
                </div>
              )}
              {asset.expense && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Expenses
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    -{formatCurrency(asset.expense)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(asset.createdAt.toString())}</span>
          </div>
        </div>
      </CardFooter>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(asset.id);
          setShowDeleteModal(false);
        }}
        assetName={asset.name}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default AssetCard;

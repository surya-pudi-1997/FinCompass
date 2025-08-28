import React from "react";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAssetsSelectors } from "@/shared/stores";
import { Asset } from "@fin-compass/types";
import AssetCard from "./AssetCard";
import { AssetsListSkeleton } from "./AssetsSkeleton";

interface AssetsListProps {
  onDeleteAsset: (assetId: string) => void;
  onEditAsset: (asset: Asset) => void;
  onAddAsset: () => void;
  onRefresh: () => void;
  deleteAssetLoading: boolean;
  refreshLoading?: boolean;
}

const AssetsList: React.FC<AssetsListProps> = ({
  onDeleteAsset,
  onEditAsset,
  onAddAsset,
  onRefresh,
  deleteAssetLoading,
  refreshLoading = false,
}) => {
  const assets = useAssetsSelectors.assets();
  const fetchAssetsLoading = useAssetsSelectors.fetchAssetsLoading();
  const fetchAssetsError = useAssetsSelectors.fetchAssetsError();

  if (fetchAssetsLoading) {
    return <AssetsListSkeleton />;
  }

  if (fetchAssetsError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error Loading Assets</h3>
          <p className="text-muted-foreground mt-2">{fetchAssetsError}</p>
        </div>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Assets Found</h3>
          <p className="text-muted-foreground mt-2">
            You haven't created any assets yet. Get started by creating your
            first asset.
          </p>
        </div>
        <Button className="mt-4" onClick={onAddAsset}>
          <Plus className="h-4 w-4 mr-2" />
          Create Asset
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Assets</h2>
          <p className="text-muted-foreground">
            {assets.length} asset{assets.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={refreshLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={onAddAsset}>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onDelete={onDeleteAsset}
            onEdit={onEditAsset}
            isDeleting={deleteAssetLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default AssetsList;

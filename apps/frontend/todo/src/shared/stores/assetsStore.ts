import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

import { Asset } from "@fin-compass/types";

interface AssetsState {
  assets: Asset[];
  selectedAsset: Asset | null;
  // Loading states
  fetchAssetsLoading: boolean;
  fetchAssetLoading: boolean;
  createAssetLoading: boolean;
  updateAssetLoading: boolean;
  deleteAssetLoading: boolean;
  // Error states
  fetchAssetsError: string | null;
  fetchAssetError: string | null;
  createAssetError: string | null;
  updateAssetError: string | null;
  deleteAssetError: string | null;
}

interface AssetsActions {
  // Asset data actions
  setAssets: (assets: Asset[]) => void;
  setSelectedAsset: (asset: Asset | null) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (assetId: string, updates: Partial<Asset>) => void;
  removeAsset: (assetId: string) => void;
  clearAssets: () => void;

  // Loading state actions
  setFetchAssetsLoading: (loading: boolean) => void;
  setFetchAssetLoading: (loading: boolean) => void;
  setCreateAssetLoading: (loading: boolean) => void;
  setUpdateAssetLoading: (loading: boolean) => void;
  setDeleteAssetLoading: (loading: boolean) => void;

  // Error state actions
  setFetchAssetsError: (error: string | null) => void;
  setFetchAssetError: (error: string | null) => void;
  setCreateAssetError: (error: string | null) => void;
  setUpdateAssetError: (error: string | null) => void;
  setDeleteAssetError: (error: string | null) => void;
  clearFetchAssetsError: () => void;
  clearFetchAssetError: () => void;
  clearCreateAssetError: () => void;
  clearUpdateAssetError: () => void;
  clearDeleteAssetError: () => void;
  clearAllErrors: () => void;

  // Utility actions
  getAssetById: (assetId: string) => Asset | undefined;
  getTotalValue: () => number;
  getAssetsByType: (type: string) => Asset[];
  getAssetsByStatus: (status: string) => Asset[];
  getActiveAssets: () => Asset[];
  getSoldAssets: () => Asset[];
}

interface AssetsStore extends AssetsState, AssetsActions {}

const initialState: AssetsState = {
  assets: [],
  selectedAsset: null,
  // Loading states
  fetchAssetsLoading: false,
  fetchAssetLoading: false,
  createAssetLoading: false,
  updateAssetLoading: false,
  deleteAssetLoading: false,
  // Error states
  fetchAssetsError: null,
  fetchAssetError: null,
  createAssetError: null,
  updateAssetError: null,
  deleteAssetError: null,
};

export const useAssetsStore = create<AssetsStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Asset data actions
      setAssets: (assets: Asset[]) => {
        set((state) => {
          state.assets = assets;
        });
      },

      setSelectedAsset: (asset: Asset | null) => {
        set((state) => {
          state.selectedAsset = asset;
        });
      },

      addAsset: (asset: Asset) => {
        set((state) => {
          state.assets.push(asset);
        });
      },

      updateAsset: (assetId: string, updates: Partial<Asset>) => {
        set((state) => {
          const assetIndex = state.assets.findIndex(
            (asset) => asset.id === assetId
          );
          if (assetIndex !== -1) {
            Object.assign(state.assets[assetIndex], updates);
          }
          // Update selected asset if it's the one being updated
          if (state.selectedAsset?.id === assetId) {
            Object.assign(state.selectedAsset, updates);
          }
        });
      },

      removeAsset: (assetId: string) => {
        set((state) => {
          state.assets = state.assets.filter((asset) => asset.id !== assetId);
          // Clear selected asset if it's the one being deleted
          if (state.selectedAsset?.id === assetId) {
            state.selectedAsset = null;
          }
        });
      },

      clearAssets: () => {
        set((state) => {
          state.assets = [];
          state.selectedAsset = null;
        });
      },

      // Loading state actions
      setFetchAssetsLoading: (loading: boolean) => {
        set((state) => {
          state.fetchAssetsLoading = loading;
        });
      },

      setFetchAssetLoading: (loading: boolean) => {
        set((state) => {
          state.fetchAssetLoading = loading;
        });
      },

      setCreateAssetLoading: (loading: boolean) => {
        set((state) => {
          state.createAssetLoading = loading;
        });
      },

      setUpdateAssetLoading: (loading: boolean) => {
        set((state) => {
          state.updateAssetLoading = loading;
        });
      },

      setDeleteAssetLoading: (loading: boolean) => {
        set((state) => {
          state.deleteAssetLoading = loading;
        });
      },

      // Error state actions
      setFetchAssetsError: (error: string | null) => {
        set((state) => {
          state.fetchAssetsError = error;
        });
      },

      setFetchAssetError: (error: string | null) => {
        set((state) => {
          state.fetchAssetError = error;
        });
      },

      setCreateAssetError: (error: string | null) => {
        set((state) => {
          state.createAssetError = error;
        });
      },

      setUpdateAssetError: (error: string | null) => {
        set((state) => {
          state.updateAssetError = error;
        });
      },

      setDeleteAssetError: (error: string | null) => {
        set((state) => {
          state.deleteAssetError = error;
        });
      },

      clearFetchAssetsError: () => {
        set((state) => {
          state.fetchAssetsError = null;
        });
      },

      clearFetchAssetError: () => {
        set((state) => {
          state.fetchAssetError = null;
        });
      },

      clearCreateAssetError: () => {
        set((state) => {
          state.createAssetError = null;
        });
      },

      clearUpdateAssetError: () => {
        set((state) => {
          state.updateAssetError = null;
        });
      },

      clearDeleteAssetError: () => {
        set((state) => {
          state.deleteAssetError = null;
        });
      },

      clearAllErrors: () => {
        set((state) => {
          state.fetchAssetsError = null;
          state.fetchAssetError = null;
          state.createAssetError = null;
          state.updateAssetError = null;
          state.deleteAssetError = null;
        });
      },

      // Utility actions
      getAssetById: (assetId: string) => {
        const { assets } = get();
        return assets.find((asset) => asset.id === assetId);
      },

      getTotalValue: () => {
        const { assets } = get();
        return assets.reduce((total, asset) => {
          if (asset.status === "Active") {
            return (
              total +
              asset.bought_value +
              (asset.income || 0) -
              (asset.expense || 0)
            );
          } else {
            return (
              total +
              (asset.sold_value || 0) +
              (asset.income || 0) -
              (asset.expense || 0)
            );
          }
        }, 0);
      },

      getAssetsByType: (type: string) => {
        const { assets } = get();
        return assets.filter((asset) => asset.type === type);
      },

      getAssetsByStatus: (status: string) => {
        const { assets } = get();
        return assets.filter((asset) => asset.status === status);
      },

      getActiveAssets: () => {
        const { assets } = get();
        return assets.filter((asset) => asset.status === "Active");
      },

      getSoldAssets: () => {
        const { assets } = get();
        return assets.filter((asset) => asset.status === "Sold");
      },
    })),
    {
      name: "assets-store",
    }
  )
);

// Selectors for better performance
export const useAssetsSelectors = {
  // Asset data selectors
  assets: () => useAssetsStore((state) => state.assets),
  selectedAsset: () => useAssetsStore((state) => state.selectedAsset),
  assetsCount: () => useAssetsStore((state) => state.assets.length),
  totalValue: () => useAssetsStore((state) => state.getTotalValue()),

  // Loading state selectors
  fetchAssetsLoading: () => useAssetsStore((state) => state.fetchAssetsLoading),
  fetchAssetLoading: () => useAssetsStore((state) => state.fetchAssetLoading),
  createAssetLoading: () => useAssetsStore((state) => state.createAssetLoading),
  updateAssetLoading: () => useAssetsStore((state) => state.updateAssetLoading),
  deleteAssetLoading: () => useAssetsStore((state) => state.deleteAssetLoading),

  // Error state selectors
  fetchAssetsError: () => useAssetsStore((state) => state.fetchAssetsError),
  fetchAssetError: () => useAssetsStore((state) => state.fetchAssetError),
  createAssetError: () => useAssetsStore((state) => state.createAssetError),
  updateAssetError: () => useAssetsStore((state) => state.updateAssetError),
  deleteAssetError: () => useAssetsStore((state) => state.deleteAssetError),

  // Combined selectors
  hasAnyError: () =>
    useAssetsStore(
      (state) =>
        !!(
          state.fetchAssetsError ||
          state.fetchAssetError ||
          state.createAssetError ||
          state.updateAssetError ||
          state.deleteAssetError
        )
    ),
  isAnyLoading: () =>
    useAssetsStore(
      (state) =>
        state.fetchAssetsLoading ||
        state.fetchAssetLoading ||
        state.createAssetLoading ||
        state.updateAssetLoading ||
        state.deleteAssetLoading
    ),

  // Utility selectors
  getAssetById: (assetId: string) =>
    useAssetsStore((state) => state.getAssetById(assetId)),
  getAssetsByType: (type: string) =>
    useAssetsStore((state) => state.getAssetsByType(type)),
  getAssetsByStatus: (status: string) =>
    useAssetsStore((state) => state.getAssetsByStatus(status)),
  activeAssets: () => useAssetsStore((state) => state.getActiveAssets()),
  soldAssets: () => useAssetsStore((state) => state.getSoldAssets()),
};

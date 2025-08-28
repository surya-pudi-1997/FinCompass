import React, { useEffect, useState, useCallback } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAssetsSelectors } from "@/shared/stores";
import {
  useGetAssetsService,
  useDeleteAssetService,
  useUpdateAssetService,
  useCreateAssetService,
} from "./services";
import { AssetsList, AssetsSummary, AssetForm } from "./views";
import { CreateAssetDto, Asset } from "@fin-compass/types";
import { Button } from "@/components/ui/button";
import FormDrawer from "@/components/layouts/FormDrawer";

const AssetsPage: React.FC = () => {
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formState, setFormState] = useState<{
    isSubmitting: boolean;
    submitForm: (() => void) | null;
    isEditing: boolean;
  }>({
    isSubmitting: false,
    submitForm: null,
    isEditing: false,
  });

  // Track previous loading states for success detection
  const [prevCreateLoading, setPrevCreateLoading] = useState(false);
  const [prevUpdateLoading, setPrevUpdateLoading] = useState(false);

  const { getAssets } = useGetAssetsService();
  const { deleteAsset } = useDeleteAssetService();
  const { updateAsset } = useUpdateAssetService();
  const { createAsset } = useCreateAssetService();

  const deleteAssetLoading = useAssetsSelectors.deleteAssetLoading();
  const deleteAssetError = useAssetsSelectors.deleteAssetError();
  const createAssetError = useAssetsSelectors.createAssetError();
  const updateAssetError = useAssetsSelectors.updateAssetError();
  const createAssetLoading = useAssetsSelectors.createAssetLoading();
  const updateAssetLoading = useAssetsSelectors.updateAssetLoading();
  const fetchAssetsLoading = useAssetsSelectors.fetchAssetsLoading();

  useEffect(() => {
    // Fetch assets when component mounts
    getAssets();
  }, []);

  // Show toast notifications for errors
  useEffect(() => {
    if (deleteAssetError) {
      toast.error("Delete Error", {
        description: deleteAssetError,
      });
    }
  }, [deleteAssetError]);

  useEffect(() => {
    if (createAssetError) {
      toast.error("Create Error", {
        description: createAssetError,
      });
    }
  }, [createAssetError]);

  useEffect(() => {
    if (updateAssetError) {
      toast.error("Update Error", {
        description: updateAssetError,
      });
    }
  }, [updateAssetError]);

  // Track loading states and show success toasts
  useEffect(() => {
    if (prevCreateLoading && !createAssetLoading && !createAssetError) {
      toast.success("Asset created successfully!");
    }
    setPrevCreateLoading(createAssetLoading);
  }, [createAssetLoading, prevCreateLoading, createAssetError]);

  useEffect(() => {
    if (prevUpdateLoading && !updateAssetLoading && !updateAssetError) {
      toast.success("Asset updated successfully!");
    }
    setPrevUpdateLoading(updateAssetLoading);
  }, [updateAssetLoading, prevUpdateLoading, updateAssetError]);

  const handleDeleteAsset = useCallback(
    (assetId: string) => {
      deleteAsset(assetId);
    },
    [deleteAsset]
  );

  const handleRefresh = useCallback(() => {
    getAssets();
  }, [getAssets]);

  const handleEditAsset = useCallback((asset: Asset) => {
    setEditingAsset(asset);
    setIsDrawerOpen(true);
  }, []);

  const handleAddAsset = useCallback(() => {
    setEditingAsset(null);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingAsset(null);
  }, []);

  const handleSubmitAsset = useCallback(
    async (data: CreateAssetDto) => {
      if (editingAsset) {
        await updateAsset(editingAsset.id, data);
      } else {
        console.log({ data });
        await createAsset(data);
      }
      handleCloseDrawer();
    },
    [editingAsset, updateAsset, createAsset, handleCloseDrawer]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AssetsSummary />

      <AssetsList
        onDeleteAsset={handleDeleteAsset}
        onEditAsset={handleEditAsset}
        onAddAsset={handleAddAsset}
        onRefresh={handleRefresh}
        deleteAssetLoading={deleteAssetLoading}
        refreshLoading={fetchAssetsLoading}
      />

      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        header={
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-lg font-semibold">
              {editingAsset ? "Edit Asset" : "Create Asset"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCloseDrawer}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        }
        body={
          <AssetForm
            asset={editingAsset || undefined}
            onSubmit={handleSubmitAsset}
            onGetFormState={setFormState}
          />
        }
        footer={
          <div className="p-4 flex gap-3">
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="flex-1"
              onClick={() => {
                if (formState.submitForm) {
                  formState.submitForm();
                }
              }}
            >
              {formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {formState.isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {formState.isEditing ? "Update Asset" : "Create Asset"}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDrawer}
              disabled={formState.isSubmitting}
            >
              Cancel
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default AssetsPage;

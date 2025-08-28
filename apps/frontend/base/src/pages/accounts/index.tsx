import React, { useEffect, useState, useCallback } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAccountsSelectors } from "@/shared/stores";
import {
  useGetAccountsService,
  useDeleteAccountService,
  useUpdateAccountService,
  useCreateAccountService,
} from "./services";
import { AccountsList, AccountsSummary, AccountForm } from "./views";
import { CreateAccountDto } from "@fin-compass/types";
import { Button } from "@/components/ui/button";
import FormDrawer from "@/components/layouts/FormDrawer";

interface Account extends CreateAccountDto {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const AccountsPage: React.FC = () => {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
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

  const { getAccounts } = useGetAccountsService();
  const { deleteAccount } = useDeleteAccountService();
  const { updateAccount } = useUpdateAccountService();
  const { createAccount } = useCreateAccountService();

  const deleteAccountLoading = useAccountsSelectors.deleteAccountLoading();
  const deleteAccountError = useAccountsSelectors.deleteAccountError();
  const createAccountError = useAccountsSelectors.createAccountError();
  const updateAccountError = useAccountsSelectors.updateAccountError();
  const createAccountLoading = useAccountsSelectors.createAccountLoading();
  const updateAccountLoading = useAccountsSelectors.updateAccountLoading();
  const fetchAccountsLoading = useAccountsSelectors.fetchAccountsLoading();

  useEffect(() => {
    // Fetch accounts when component mounts
    getAccounts();
  }, []);

  // Show toast notifications for errors
  useEffect(() => {
    if (deleteAccountError) {
      toast.error("Delete Error", {
        description: deleteAccountError,
      });
    }
  }, [deleteAccountError]);

  useEffect(() => {
    if (createAccountError) {
      toast.error("Create Error", {
        description: createAccountError,
      });
    }
  }, [createAccountError]);

  useEffect(() => {
    if (updateAccountError) {
      toast.error("Update Error", {
        description: updateAccountError,
      });
    }
  }, [updateAccountError]);

  // Track loading states and show success toasts
  useEffect(() => {
    if (prevCreateLoading && !createAccountLoading && !createAccountError) {
      toast.success("Account created successfully!");
    }
    setPrevCreateLoading(createAccountLoading);
  }, [createAccountLoading, prevCreateLoading, createAccountError]);

  useEffect(() => {
    if (prevUpdateLoading && !updateAccountLoading && !updateAccountError) {
      toast.success("Account updated successfully!");
    }
    setPrevUpdateLoading(updateAccountLoading);
  }, [updateAccountLoading, prevUpdateLoading, updateAccountError]);

  const handleDeleteAccount = useCallback(
    (accountId: string) => {
      deleteAccount(accountId);
    },
    [deleteAccount]
  );

  const handleRefresh = useCallback(() => {
    getAccounts();
  }, [getAccounts]);

  const handleEditAccount = useCallback((account: Account) => {
    setEditingAccount(account);
    setIsDrawerOpen(true);
  }, []);

  const handleAddAccount = useCallback(() => {
    setEditingAccount(null);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingAccount(null);
  }, []);

  const handleSubmitAccount = useCallback(
    async (data: CreateAccountDto) => {
      if (editingAccount) {
        await updateAccount(editingAccount.id, data);
      } else {
        await createAccount(data);
      }
      handleCloseDrawer();
    },
    [editingAccount, updateAccount, createAccount, handleCloseDrawer]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AccountsSummary />

      <AccountsList
        onDeleteAccount={handleDeleteAccount}
        onEditAccount={handleEditAccount}
        onAddAccount={handleAddAccount}
        onRefresh={handleRefresh}
        deleteAccountLoading={deleteAccountLoading}
        refreshLoading={fetchAccountsLoading}
      />

      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        header={
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-lg font-semibold">
              {editingAccount ? "Edit Account" : "Create Account"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCloseDrawer}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        }
        body={
          <AccountForm
            account={editingAccount || undefined}
            onSubmit={handleSubmitAccount}
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
                  {formState.isEditing ? "Update Account" : "Create Account"}
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

export default AccountsPage;

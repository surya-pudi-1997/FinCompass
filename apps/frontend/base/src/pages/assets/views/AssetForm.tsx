import React, { useEffect, useMemo, useState } from "react";
import useGetAccounts from "../../accounts/services/useGetAccounts";
import { FormField, useFormGenerator } from "@/shared/libs/formBuilder";
import { CreateAssetDto, AssetType, AssetStatus } from "@fin-compass/types";
import { useAccountsSelectors } from "@/shared/stores";

interface Asset extends CreateAssetDto {
  id: string;
  userId: string;
  createdAt: Date;
}

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: CreateAssetDto) => Promise<void>;
  onGetFormState?: (state: {
    isSubmitting: boolean;
    submitForm: () => void;
    isEditing: boolean;
  }) => void;
}

const ASSET_FORM_FIELDS = {
  formName: "asset_form",
  fields: [
    {
      name: "name",
      type: "text" as const,
      label: "Asset Name",
      placeholder: "Enter asset name",
      validation: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },
    },
    {
      name: "type",
      type: "select" as const,
      label: "Asset Type",
      placeholder: "Select asset type",
      options: [
        { value: "Real Estate", label: "Real Estate" },
        { value: "Vehicle", label: "Vehicle" },
        { value: "Stock", label: "Stock" },
        { value: "Bond", label: "Bond" },
        { value: "Other", label: "Other" },
      ],
      validation: {
        required: true,
      },
    },
    {
      name: "bought_value",
      type: "number" as const,
      label: "Purchase Value",
      placeholder: "Enter purchase value",
      validation: {
        required: true,
        min: 0,
      },
    },
    {
      name: "bought_from",
      type: "select" as const,
      label: "Purchased account",
      placeholder: "Select account",
      validation: {
        required: true,
        custom: (formData, error, errorList) => {
          // Custom validation logic
          let tempError = error,
            tempErrorList = errorList;
          if (formData.is_existing) {
            if (!formData.bought_from && errorList.length === 1) {
              tempError = undefined;
              tempErrorList = [];
            }
          }
          return { error: tempError, errorList: tempErrorList };
        },
      },
    },
    {
      name: "status",
      type: "select" as const,
      label: "Status",
      placeholder: "Select asset status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Sold", label: "Sold" },
      ],
      validation: {
        required: true,
      },
    },
    {
      name: "is_existing",
      label: "is existing",
      type: "checkbox",
    },
    {
      name: "sold_value",
      type: "number" as const,
      label: "Sold Value",
      placeholder: "Enter sold value",
      validation: {
        min: 0,
      },
    },
    {
      name: "sold_to",
      type: "select" as const,
      label: "Sold account",
      placeholder: "Select account",
      validation: {
        required: true,
        custom: (formData, error, errorList) => {
          // Custom validation logic
          let tempError = error,
            tempErrorList = errorList;
          if (formData.type === "Sold") {
            if (!formData.sold_to) {
              tempError = "required";
              tempErrorList = ["Sold account is required"];
            }
          } else {
            if (!formData.sold_to && errorList.length === 1) {
              tempError = undefined;
              tempErrorList = [];
            }
          }
          return { error: tempError, errorList: tempErrorList };
        },
      },
    },
    {
      name: "income",
      type: "number" as const,
      label: "Income Generated",
      placeholder: "Enter income from asset",
      validation: {
        min: 0,
      },
    },
    {
      name: "expense",
      type: "number" as const,
      label: "Expenses",
      placeholder: "Enter expenses (maintenance, etc.)",
      validation: {
        min: 0,
      },
    },
  ],
};

const AssetForm: React.FC<AssetFormProps> = ({
  asset,
  onSubmit,
  onGetFormState,
}) => {
  const isEditing = !!asset;
  const accounts = useAccountsSelectors.accounts();
  const [updatedAccounts, setUpdatedAccounts] = useState();

  const { getAccounts } = useGetAccounts();

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      const temp = accounts
        .sort((a, b) => {
          // Sort system accounts first, then alphabetically
          if (a.isSystem && !b.isSystem) return -1;
          if (!a.isSystem && b.isSystem) return 1;
          return a.name.localeCompare(b.name);
        })
        .map((account) => ({
          value: account.id,
          label: account.name,
        }));
      setUpdatedAccounts(temp);
    }
  }, [accounts]);

  const { formData, validateForm, getFieldProps } = useFormGenerator({
    ...ASSET_FORM_FIELDS,
    initialValues: asset,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log({ formData });
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const assetData: CreateAssetDto = {
      name: formData.name as string,
      type: formData.type as AssetType,
      bought_value: Number(formData.bought_value),
      sold_to: formData.sold_to,
      sold_value:
        formData.sold_value && formData.sold_value !== ""
          ? Number(formData.sold_value)
          : undefined,
      income:
        formData.income && formData.income !== ""
          ? Number(formData.income)
          : undefined,
      expense:
        formData.expense && formData.expense !== ""
          ? Number(formData.expense)
          : undefined,
      status: formData.status as AssetStatus,
      is_existing: formData?.is_existing || false,
      ...(!formData.is_existing ? { bought_from: formData.bought_from } : {}),
    };

    console.log({ assetData });

    await onSubmit(assetData);
  };

  // Pass form state to parent component if needed
  React.useEffect(() => {
    if (onGetFormState) {
      onGetFormState({
        isSubmitting: false, // We'll get this from the store in a real implementation
        submitForm: () => {
          const form = document.getElementById("asset-form") as HTMLFormElement;
          if (form) form.requestSubmit();
        },
        isEditing,
      });
    }
  }, [onGetFormState, isEditing]);

  return (
    <form id="asset-form" onSubmit={handleSubmit} className="space-y-6">
      <FormField {...getFieldProps("name")!} />
      <FormField {...getFieldProps("type")!} />
      <FormField {...getFieldProps("is_existing")!} />
      {formData.is_existing ? null : (
        <FormField
          {...getFieldProps("bought_from")!}
          options={updatedAccounts}
        />
      )}
      <FormField {...getFieldProps("bought_value")!} />
      <FormField
        {...getFieldProps("status")!}
        {...(!isEditing
          ? { options: [{ value: "Active", label: "Active" }] }
          : {})}
      />
      {formData.status === "Sold" ? (
        <>
          <FormField {...getFieldProps("sold_to")!} options={updatedAccounts} />
          <FormField {...getFieldProps("sold_value")!} />
        </>
      ) : (
        <>
          <FormField
            {...getFieldProps("sold_to")!}
            options={updatedAccounts}
            disabled={true}
          />
          <FormField {...getFieldProps("sold_value")!} disabled={true} />
        </>
      )}
      <FormField {...getFieldProps("income")!} />
      <FormField {...getFieldProps("expense")!} />
    </form>
  );
};

export default AssetForm;

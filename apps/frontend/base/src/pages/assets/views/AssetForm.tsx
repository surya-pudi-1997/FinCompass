import React, { useMemo } from "react";
import { FormField, useFormGenerator } from "@/shared/libs/formBuilder";
import { CreateAssetDto, AssetType, AssetStatus } from "@fin-compass/types";

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

const ASSET_FORM_FIELDS = [
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
    name: "sold_value",
    type: "number" as const,
    label: "Sold Value",
    placeholder: "Enter sold value (if sold)",
    validation: {
      min: 0,
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
];

const AssetForm: React.FC<AssetFormProps> = ({
  asset,
  onSubmit,
  onGetFormState,
}) => {
  const isEditing = !!asset;

  // Form configuration
  const ASSET_FORM_CONFIG = useMemo(
    () => ({
      formName: isEditing ? "editAsset" : "createAsset",
      fields: ASSET_FORM_FIELDS.map((field) => ({
        ...field,
        defaultValue: asset ? (asset[field.name as keyof Asset] ?? "") : "",
      })),
    }),
    [isEditing, asset]
  );

  const { formData, validateForm, getFieldProps } =
    useFormGenerator(ASSET_FORM_CONFIG);

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
      <FormField {...getFieldProps("bought_value")!} />
      <FormField {...getFieldProps("status")!} />
      <FormField {...getFieldProps("sold_value")!} />
      <FormField {...getFieldProps("income")!} />
      <FormField {...getFieldProps("expense")!} />
    </form>
  );
};

export default AssetForm;

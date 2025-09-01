import React from "react";
import { FormField, useFormGenerator } from "@/shared/libs/formBuilder";
import { CreateAccountDto } from "@fin-compass/types";

interface Account extends CreateAccountDto {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: CreateAccountDto) => Promise<void>;
  onGetFormState?: (state: {
    isSubmitting: boolean;
    submitForm: () => void;
    isEditing: boolean;
  }) => void;
}

const ACCOUNT_FORM_FIELDS = {
  formName: "account_form",
  fields: [
    {
      name: "name",
      type: "text" as const,
      label: "Account Name",
      placeholder: "Enter account name",
      validation: {
        required: true,
        minlength: 2,
        maxlength: 50,
      },
    },
    {
      name: "type",
      type: "select" as const,
      label: "Account Type",
      placeholder: "Select account type",
      options: [
        { value: "Savings", label: "Savings" },
        { value: "CreditCard", label: "Credit Card" },
        { value: "Investment", label: "Investment" },
        { value: "Other", label: "Other" },
      ],
      validation: {
        required: true,
      },
    },
    {
      name: "balance",
      type: "number" as const,
      label: "Initial Balance",
      placeholder: "Enter initial balance",
      validation: {
        required: true,
        min: 0,
      },
    },
  ],
};

const AccountForm: React.FC<AccountFormProps> = ({
  account,
  onSubmit,
  onGetFormState,
}) => {
  const isEditing = !!account;

  const { formData, validateForm, getFieldProps } = useFormGenerator({
    ...ACCOUNT_FORM_FIELDS,
    initialValues: account
      ? {
          name: account.name,
          type: account.type,
          balance: account.balance,
        }
      : undefined,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const accountData: CreateAccountDto = {
      name: formData.name as string,
      type: formData.type as "Savings" | "CreditCard" | "Investment" | "Other",
      balance: Number(formData.balance),
    };

    await onSubmit(accountData);
  };

  // Pass form state to parent component if needed
  React.useEffect(() => {
    if (onGetFormState) {
      onGetFormState({
        isSubmitting: false, // We'll get this from the store in a real implementation
        submitForm: () => {
          const form = document.getElementById(
            "account-form"
          ) as HTMLFormElement;
          if (form) form.requestSubmit();
        },
        isEditing,
      });
    }
  }, [onGetFormState, isEditing]);

  return (
    <form id="account-form" onSubmit={handleSubmit} className="space-y-6">
      <FormField {...getFieldProps("name")!} />
      <FormField {...getFieldProps("type")!} />
      <FormField {...getFieldProps("balance")!} />
    </form>
  );
};

export default AccountForm;

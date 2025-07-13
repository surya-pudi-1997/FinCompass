import React from "react";
import { Link } from "react-router";
import { FormField, useFormGenerator } from "@/shared/libs/formBuilder";
import { useUserSelectors } from "@/shared/stores";
import useRegisterService from "./services/useRegisterService";
import { routes } from "@/router/routes";
import type { CreateUserInput } from "@fin-compass/types";

const REGISTER_FORM_FIELDS = [
  {
    name: "fullName",
    type: "text" as const,
    label: "Full Name",
    placeholder: "Enter your full name",
    validation: {
      required: true,
      minlength: 2,
      maxlength: 100,
    },
  },
  {
    name: "email",
    type: "email" as const,
    label: "Email Address",
    placeholder: "Enter your email address",
    validation: {
      required: true,
      email: true,
    },
  },
  {
    name: "password",
    type: "password" as const,
    label: "Password",
    placeholder: "Create a password",
    validation: {
      required: true,
      minlength: 8,
      custom: (value: unknown) => {
        const password = value as string;
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
          return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        return null;
      },
    },
  },
  {
    name: "confirmPassword",
    type: "password" as const,
    label: "Confirm Password",
    placeholder: "Confirm your password",
    validation: {
      required: true,
      custom: (_value: unknown) => {
        // This will be handled differently in the form submission
        return null;
      },
    },
  },
  {
    name: "preferredCurrency",
    type: "select" as const,
    label: "Preferred Currency",
    placeholder: "Select your preferred currency",
    options: [
      { value: "USD", label: "US Dollar (USD)" },
      { value: "EUR", label: "Euro (EUR)" },
      { value: "GBP", label: "British Pound (GBP)" },
      { value: "JPY", label: "Japanese Yen (JPY)" },
      { value: "CAD", label: "Canadian Dollar (CAD)" },
      { value: "AUD", label: "Australian Dollar (AUD)" },
      { value: "CHF", label: "Swiss Franc (CHF)" },
      { value: "CNY", label: "Chinese Yuan (CNY)" },
      { value: "INR", label: "Indian Rupee (INR)" },
    ],
    validation: {
      required: true,
    },
  },
];

const REGISTER_FORM_CONFIG = {
  formName: "register",
  fields: REGISTER_FORM_FIELDS,
};

const RegisterPage = () => {
  const { register } = useRegisterService();
  const loginError = useUserSelectors.loginError();
  const loginLoading = useUserSelectors.loginLoading();

  const { formData, validateForm, getFieldProps } =
    useFormGenerator(REGISTER_FORM_CONFIG);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      // You might want to add a specific error state for this
      return;
    }

    // Create the user data matching CreateUserInput interface
    const userData: CreateUserInput = {
      email: formData.email as string,
      password: formData.password as string,
      fullName: formData.fullName as string,
      preferredCurrency: formData.preferredCurrency as string,
    };

    console.log("Register form submitted with data:", userData);
    register(userData);
  };

  // Use register loading state instead of form submitting state
  const isSubmitting = loginLoading;

  // Custom validation for password confirmation
  const validatePasswordMatch = () => {
    const password = formData.password as string;
    const confirmPassword = formData.confirmPassword as string;

    if (password && confirmPassword && password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const confirmPasswordError = validatePasswordMatch();

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join FinCompass to start managing your finances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          {/* Full Name Field */}
          <FormField {...getFieldProps("fullName")!} />

          {/* Email Field */}
          <FormField {...getFieldProps("email")!} />

          {/* Password Field */}
          <FormField {...getFieldProps("password")!} />

          {/* Confirm Password Field */}
          <FormField
            {...getFieldProps("confirmPassword")!}
            error={
              confirmPasswordError || getFieldProps("confirmPassword")!.error
            }
          />

          {/* Preferred Currency Field */}
          <FormField {...getFieldProps("preferredCurrency")!} />

          {/* Submit Button */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || !!confirmPasswordError}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to={routes.LOGIN}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

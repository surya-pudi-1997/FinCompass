import React from "react";
import { Link } from "react-router";
import { FormField, useFormGenerator } from "@/shared/libs/formBuilder";
import { useUserSelectors } from "@/shared/stores";
import useLoginService from "./services/useLoginService";
import type { LoginInput } from "@fin-compass/types";

const LOGIN_FORM_FIELDS = [
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
    placeholder: "Enter your password",
    validation: {
      required: true,
      minlength: 8,
    },
  },
];

const LOGIN_FORM_CONFIG = {
  formName: "login",
  fields: LOGIN_FORM_FIELDS,
};

const LoginPage = () => {
  const { login } = useLoginService();
  const loginError = useUserSelectors.loginError();
  const loginLoading = useUserSelectors.loginLoading();

  const { formData, validateForm, getFieldProps } =
    useFormGenerator(LOGIN_FORM_CONFIG);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Create the login data matching LoginInput interface
    const loginData: LoginInput = {
      email: formData.email as string,
      password: formData.password as string,
    };

    console.log("Login form submitted with data:", loginData);
    login(loginData.email, loginData.password);
  };

  // Use login loading state instead of form submitting state
  const isSubmitting = loginLoading;

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your FinCompass account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          {/* Email Field */}
          <FormField {...getFieldProps("email")!} />

          {/* Password Field */}
          <FormField {...getFieldProps("password")!} />

          {/* Submit Button */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Additional Options */}
        <div className="mt-6 space-y-4">
          {/* Forgot Password Link */}
          <div className="text-center">
            <Link to="/forgot-password" className="text-sm hover:underline">
              Forgot your password?
            </Link>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium hover:underline">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

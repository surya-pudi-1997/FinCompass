import React from "react";
import type { FieldProps } from "./useFormGenerator";

interface FormFieldProps extends FieldProps {
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  containerClassName?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  type,
  label,
  placeholder,
  value,
  checked,
  options,
  required,
  disabled,
  error,
  onChange,
  onBlur,
  className = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
  containerClassName = "",
}) => {
  const baseInputClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? "border-red-500 focus:ring-red-500" : ""}
    ${inputClassName}
  `.trim();

  const baseLabelClasses = `
    block text-sm font-medium text-gray-700 mb-1
    ${labelClassName}
  `.trim();

  const baseErrorClasses = `
    text-red-600 text-sm mt-1 block
    ${errorClassName}
  `.trim();

  const baseContainerClasses = `
    field-container
    ${containerClassName}
  `.trim();

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            value={value as string}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={4}
            className={baseInputClasses}
          />
        );

      case "select":
        return (
          <select
            id={name}
            name={name}
            value={value as string}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              id={name}
              name={name}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              onBlur={onBlur}
              required={required}
              disabled={disabled}
              className={`
                h-4 w-4 text-blue-600 border-gray-300 rounded 
                focus:ring-blue-500 focus:ring-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${inputClassName}
              `.trim()}
            />
            <span className={baseLabelClasses}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  required={required}
                  disabled={disabled}
                  className={`
                    h-4 w-4 text-blue-600 border-gray-300 
                    focus:ring-blue-500 focus:ring-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${inputClassName}
                  `.trim()}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            value={value as string}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className={`${baseContainerClasses} ${className}`}>
      {/* Render label for non-checkbox fields */}
      {type !== "checkbox" && type !== "radio" && (
        <label htmlFor={name} className={baseLabelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Render radio label */}
      {type === "radio" && (
        <div className={baseLabelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}

      {renderField()}

      {/* Error message */}
      {error && <span className={baseErrorClasses}>{error}</span>}
    </div>
  );
};

export default FormField;

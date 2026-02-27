export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationRules {
  [key: string]: ((value: any) => string | null)[];
}

export const validators = {
  required: (fieldName: string = "This field") => (value: any) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: () => (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },

  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Must not exceed ${max} characters`;
    }
    return null;
  },

  min: (min: number) => (value: number) => {
    if (value !== undefined && value !== null && value < min) {
      return `Must be at least ${min}`;
    }
    return null;
  },

  max: (max: number) => (value: number) => {
    if (value !== undefined && value !== null && value > max) {
      return `Must not exceed ${max}`;
    }
    return null;
  },

  phone: () => (value: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (value && value.length < 10) {
      return "Please enter a valid phone number";
    }
    if (value && !phoneRegex.test(value)) {
      return "Please enter a valid phone number";
    }
    return null;
  },

  url: () => (value: string) => {
    try {
      if (value) {
        new URL(value);
      }
    } catch {
      return "Please enter a valid URL";
    }
    return null;
  },

  match: (fieldName: string, otherValue: string) => (value: string) => {
    if (value !== otherValue) {
      return `${fieldName} does not match`;
    }
    return null;
  },
};

export function validateForm(
  formData: Record<string, any>,
  rules: FormValidationRules
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = formData[field];

    for (const validator of fieldRules) {
      const error = validator(value);
      if (error) {
        errors.push({ field, message: error });
        break; // Stop at first error for this field
      }
    }
  }

  return errors;
}

export function getFieldError(
  errors: ValidationError[],
  fieldName: string
): string | undefined {
  return errors.find((e) => e.field === fieldName)?.message;
}

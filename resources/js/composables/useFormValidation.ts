import { ref, reactive, computed, readonly } from 'vue';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  numeric?: boolean;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface FieldConfig {
  rules?: ValidationRule;
  message?: string;
}

export interface FormConfig {
  [key: string]: FieldConfig;
}

export interface ValidationError {
  field: string;
  message: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  config: FormConfig = {}
) => {
  const formData = reactive<T>({ ...initialData });
  const errors = ref<Record<string, string>>({});
  const touched = ref<Record<string, boolean>>({});
  const isSubmitting = ref(false);

  const validateField = (field: string, value: any): string | null => {
    const fieldConfig = config[field];
    if (!fieldConfig?.rules) return null;

    const rules = fieldConfig.rules;

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return fieldConfig.message || `${field} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Min length
      if (rules.minLength && value.length < rules.minLength) {
        return `${field} must be at least ${rules.minLength} characters`;
      }

      // Max length
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${field} must not exceed ${rules.maxLength} characters`;
      }

      // Email validation
      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return `${field} must be a valid email address`;
        }
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        return fieldConfig.message || `${field} format is invalid`;
      }
    }

    // Numeric validations
    if (rules.numeric) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return `${field} must be a number`;
      }

      // Min value
      if (rules.min !== undefined && numValue < rules.min) {
        return `${field} must be at least ${rules.min}`;
      }

      // Max value
      if (rules.max !== undefined && numValue > rules.max) {
        return `${field} must not exceed ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.keys(config).forEach(field => {
      const error = validateField(field, formData[field as keyof T]);
      if (error) {
        newErrors[field] = error;
      }
    });

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const validateSingleField = (field: string) => {
    const error = validateField(field, formData[field as keyof T]);
    if (error) {
      errors.value[field] = error;
    } else {
      delete errors.value[field];
    }
    touched.value[field] = true;
  };

  const clearErrors = () => {
    errors.value = {};
    touched.value = {};
  };

  const clearFieldError = (field: string) => {
    delete errors.value[field];
  };

  const setFieldError = (field: string, message: string) => {
    errors.value[field] = message;
  };

  const setErrors = (serverErrors: Record<string, string | string[]>) => {
    Object.entries(serverErrors).forEach(([field, message]) => {
      errors.value[field] = Array.isArray(message) ? message[0] : message;
    });
  };

  const resetForm = () => {
    Object.keys(formData).forEach(key => {
      formData[key as keyof T] = initialData[key as keyof T];
    });
    clearErrors();
  };

  const touchField = (field: string) => {
    touched.value[field] = true;
  };

  const touchAllFields = () => {
    Object.keys(config).forEach(field => {
      touched.value[field] = true;
    });
  };

  // Computed properties
  const isValid = computed(() => Object.keys(errors.value).length === 0);
  
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);
  
  const isDirty = computed(() => {
    return Object.keys(formData).some(key => 
      formData[key as keyof T] !== initialData[key as keyof T]
    );
  });

  const getFieldError = (field: string) => {
    return errors.value[field] || null;
  };

  const isFieldTouched = (field: string) => {
    return touched.value[field] || false;
  };

  const isFieldValid = (field: string) => {
    return !errors.value[field];
  };

  // Form submission helper
  const handleSubmit = async (
    submitFn: (data: T) => Promise<void>,
    options: { validateOnSubmit?: boolean } = {}
  ) => {
    const { validateOnSubmit = true } = options;

    if (validateOnSubmit) {
      touchAllFields();
      if (!validateForm()) {
        return false;
      }
    }

    isSubmitting.value = true;
    try {
      await submitFn({ ...formData } as T);
      return true;
    } catch (error: any) {
      // Handle server validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    // Form data
    formData,
    
    // Validation state
    errors: readonly(errors),
    touched: readonly(touched),
    isSubmitting: readonly(isSubmitting),
    
    // Computed properties
    isValid,
    hasErrors,
    isDirty,
    
    // Validation methods
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError,
    setFieldError,
    setErrors,
    resetForm,
    touchField,
    touchAllFields,
    
    // Helper methods
    getFieldError,
    isFieldTouched,
    isFieldValid,
    handleSubmit,
  };
};

// Common validation rules
export const validationRules = {
  required: { required: true },
  email: { required: true, email: true },
  password: { required: true, minLength: 8 },
  confirmPassword: (password: string) => ({
    required: true,
    custom: (value: string) => value !== password ? 'Passwords do not match' : null,
  }),
  numeric: { numeric: true },
  positiveNumber: { numeric: true, min: 0 },
  percentage: { numeric: true, min: 0, max: 100 },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Must be a valid URL starting with http:// or https://',
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    message: 'Must be a valid phone number',
  },
};

// Form field classes helper
export const getFieldClasses = (
  baseClasses: string,
  hasError: boolean,
  isTouched: boolean
) => {
  let classes = baseClasses;
  
  if (isTouched) {
    if (hasError) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    } else {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500';
    }
  }
  
  return classes;
};
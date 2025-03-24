import { useState, useEffect, useCallback } from "react";
import { z } from "zod";

/**
 * Custom hook for handling accessible form validation
 * - Validates on submit (client-side)
 * - Clears errors on blur (client-side) without revalidating
 * - Tracks form values for controlled inputs
 * - Integrates with server-side validation errors
 */
export function useAccessibleForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema?: z.ZodSchema,
  actionData?: { success?: boolean; errors?: Record<string, string> }
) {
  if (typeof window !== 'undefined') {
    window.console.log("🔍 FORM HOOK INITIALIZED OR RE-RENDERED");
    window.console.log("🔍 actionData:", actionData);
  }
  
  // Make a local copy of action data errors
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  
  // State to track form values
  const [formValues, setFormValues] = useState<T>(initialValues);
  
  // State to track if form has been submitted (for error display)
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Update local errors when actionData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.console.log("⚡ ACTION DATA CHANGED", actionData?.errors);
    }
    
    if (actionData?.errors) {
      setLocalErrors(actionData.errors);
      setIsSubmitted(true);
    }
  }, [actionData]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle blur events - directly remove the error
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    if (typeof window !== 'undefined') {
      window.console.log("👀 BLUR EVENT ON FIELD:", name);
      window.console.log("👀 Current errors:", localErrors);
    }
    
    // Remove the error for this field if it exists
    setLocalErrors(prev => {
      // Skip if no error exists for this field
      if (!prev[name]) return prev;
      
      // Create new error object without this field
      const newErrors = { ...prev };
      delete newErrors[name];
      
      if (typeof window !== 'undefined') {
        window.console.log("✨ REMOVED ERROR FOR:", name);
        window.console.log("✨ New errors:", newErrors);
      }
      
      return newErrors;
    });
  }, [localErrors]);
  
  // Client-side validation function
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    if (typeof window !== 'undefined') {
      window.console.log("🔍 VALIDATING FORM DATA:", formValues);
    }
    
    try {
      validationSchema.parse(formValues);
      if (typeof window !== 'undefined') {
        window.console.log("✅ VALIDATION SUCCESSFUL");
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        
        error.errors.forEach(err => {
          const fieldName = err.path[0] as string;
          newErrors[fieldName] = err.message;
        });
        
        if (typeof window !== 'undefined') {
          window.console.log("❌ VALIDATION FAILED:", newErrors);
        }
        
        setLocalErrors(newErrors);
        return false;
      }
      
      // Handle unexpected validation errors
      setLocalErrors({ _form: "An unexpected error occurred. Please try again." });
      return false;
    }
  }, [formValues, validationSchema]);
  
  // Handle form submission with client-side validation
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    if (typeof window !== 'undefined') {
      window.console.log("📝 FORM SUBMIT EVENT");
    }
    
    setIsSubmitted(true);
    
    if (validationSchema) {
      const isValid = validateForm();
      
      if (!isValid) {
        e.preventDefault();
        
        // Focus the first field with an error
        if (typeof window !== 'undefined') {
          const firstErrorField = Object.keys(localErrors)[0];
          if (firstErrorField && firstErrorField !== '_form') {
            const element = document.getElementById(firstErrorField);
            if (element) {
              element.focus();
            }
          }
        }
      }
    }
  }, [validateForm, localErrors, validationSchema]);
  
  // Expose filtered errors and form state
  return {
    formValues,
    formErrors: localErrors,
    isSubmitted,
    hasErrors: Object.keys(localErrors).length > 0,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm
  };
}

/**
 * Component for displaying error summary banner
 */
export function ErrorSummary({ 
  errors, 
  className = "error-summary" 
}: { 
  errors: Record<string, string>; 
  className?: string;
}) {
  if (typeof window !== 'undefined') {
    window.console.log("🔴 Rendering ErrorSummary with errors:", errors);
  }
  
  if (Object.keys(errors).length === 0) {
    if (typeof window !== 'undefined') {
      window.console.log("🔴 No errors to display in summary");
    }
    return null;
  }
  
  return (
    <div id="error-summary" className={className} aria-labelledby="error-summary-title" tabIndex={-1}>
      <h2 id="error-summary-title">There is a problem</h2>
      <ul className="error-summary__list">
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>
            {field === "_form" ? (
              <span>{message}</span>
            ) : (
              <a href={`#${field}`}>{message}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Component for displaying field-level error message
 */
export function ErrorMessage({ id, error }: { id: string; error?: string }) {
  if (typeof window !== 'undefined') {
    window.console.log(`🟠 Rendering ErrorMessage for ${id} with error:`, error);
  }
  
  if (!error) return null;
  
  return (
    <div id={id} className="error-message">
      {error}
    </div>
  );
} 
import { useNavigate } from 'react-router-dom';
import { submitNewItem } from "./googleSheets";
import { z } from "zod";
import { useState } from "react";

// Define the valid discipline values
const validDisciplines = ["Tech", "Design", "All", "Delivery", "Client", "QA", "Strategy", "Product"];

// Define validation schemas using Zod
export const ToolSchema = z.object({
  name: z.string().min(1, "Please enter a tool name"),
  description: z.string().min(1, "Please provide a description"),
  url: z.string()
    .min(1, "Please enter a URL")
    .url("Please enter a valid URL")
    .refine(
      (url) => url.startsWith('https://'),
      { message: "URL must start with https://" }
    ),
  discipline: z.array(z.enum(validDisciplines as [string, ...string[]])).min(1, "Please specify which disciplines this tool is for"),
  notes: z.string().optional(),
});

export const PatternSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  where: z.string().min(1, "Please specify where this pattern applies"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  links: z.string().optional(),
});

/**
 * Submit a tool form with validation
 */
export async function submitToolForm(formData: FormData): Promise<{success: boolean; errors?: Record<string, string>}> {
  try {
    // Extract form data
    const formValues = Object.fromEntries(formData);
    
    // Handle checkboxes for discipline which come as multiple values
    const disciplineValues = formData.getAll('discipline') as string[];
    
    // Prepare data for validation
    const dataToValidate = {
      ...formValues,
      discipline: disciplineValues,
    };
    
    // Validate with Zod
    const result = ToolSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      // Convert ZodError to a simple Record<string, string>
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        errors[path] = err.message;
      });
      
      return {
        success: false,
        errors,
      };
    }
    
    // Format data for submission
    const toolData = {
      name: result.data.name,
      description: result.data.description,
      url: result.data.url,
      discipline: result.data.discipline,
      notes: result.data.notes || '',
    };

    // Submit the data
    const submitSuccess = await submitNewItem('tool', toolData);
    
    if (submitSuccess) {
      return { success: true };
    } else {
      return {
        success: false,
        errors: {
          _form: "Failed to submit the tool. Please try again later."
        }
      };
    }
  } catch (error) {
    console.error('Error submitting tool form:', error);
    return {
      success: false,
      errors: {
        _form: "An unexpected error occurred. Please try again."
      }
    };
  }
}

/**
 * Submit a pattern form with validation
 */
export async function submitPatternForm(formData: FormData): Promise<{success: boolean; errors?: Record<string, string>}> {
  try {
    // Extract form data
    const formValues = Object.fromEntries(formData);
    
    // Validate with Zod
    const result = PatternSchema.safeParse(formValues);
    
    if (!result.success) {
      // Convert ZodError to a simple Record<string, string>
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        errors[path] = err.message;
      });
      
      return {
        success: false,
        errors,
      };
    }
    
    // Process links from the form data
    const linksText = result.data.links;
    const linkyDinks: Array<{title: string; url: string}> = [];
    
    if (linksText) {
      // Split by lines or semicolons
      const linkParts = linksText.split(/[;\n]/).filter(Boolean);
      
      for (const part of linkParts) {
        const [title, url] = part.split(':').map(s => s.trim());
        
        if (title && url) {
          // Ensure URL has https scheme
          let processedUrl = url;
          if (!processedUrl.startsWith('https://')) {
            if (processedUrl.startsWith('http://')) {
              processedUrl = 'https://' + processedUrl.substring(7);
            } else {
              processedUrl = 'https://' + processedUrl;
            }
          }
          
          linkyDinks.push({ title, url: processedUrl });
        } else if (part.trim()) {
          // If only one part, treat it as both title and URL
          linkyDinks.push({ 
            title: part.trim(), 
            url: `https://www.google.com/search?q=${encodeURIComponent(part.trim())}` 
          });
        }
      }
    }
    
    // Format data for submission
    const patternData = {
      name: result.data.name,
      category: result.data.category,
      where: result.data.where || 'all',
      description: result.data.description,
      linkyDinks,
    };

    // Submit the data
    const submitSuccess = await submitNewItem('pattern', patternData);
    
    if (submitSuccess) {
      return { success: true };
    } else {
      return {
        success: false,
        errors: {
          _form: "Failed to submit the pattern. Please try again later."
        }
      };
    }
  } catch (error) {
    console.error('Error submitting pattern form:', error);
    return {
      success: false,
      errors: {
        _form: "An unexpected error occurred. Please try again."
      }
    };
  }
}

/**
 * Custom hook for form submission with validation and navigation
 */
export function useFormSubmission() {
  const navigate = useNavigate();
  
  // State to hold validation errors
  const [toolErrors, setToolErrors] = useState<Record<string, string>>({});
  const [patternErrors, setPatternErrors] = useState<Record<string, string>>({});
  
  // Add loading states for each form type
  const [isSubmittingTool, setIsSubmittingTool] = useState<boolean>(false);
  const [isSubmittingPattern, setIsSubmittingPattern] = useState<boolean>(false);
  
  // Status message for screen readers (live region)
  const [statusMessage, setStatusMessage] = useState<string>("");
  
  const handleToolSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Start loading state and announce to screen readers
    setIsSubmittingTool(true);
    setStatusMessage("Submitting your tool. Please wait...");
    
    try {
      // Note: preventDefault is already called in the form component
      const form = event.currentTarget;
      const formData = new FormData(form);
      
      // Submit the form data
      const result = await submitToolForm(formData);
      
      if (result.success) {
        // Update status for screen readers
        setStatusMessage("Tool submitted successfully! Redirecting to success page.");
        
        // Navigate after a short delay to ensure screen readers announce success
        // Keep the loading state active until navigation
        setTimeout(() => {
          navigate('/tools/submit/success');
          // We don't set isSubmittingTool to false here because we're navigating away
        }, 500);
        
        // Don't set isSubmittingTool to false since we're navigating away
        return;
      } else if (result.errors) {
        // Update status for screen readers
        setStatusMessage("There were errors in your submission. Please correct them and try again.");
        
        // Set errors for the form to display
        setToolErrors(result.errors);
        
        // No scroll behavior, just focus the error summary
        setTimeout(() => {
          const errorSummary = document.getElementById('error-summary');
          if (errorSummary) {
            errorSummary.focus();
          }
          
          // Only disable the loading state after errors are displayed and focus is set
          setIsSubmittingTool(false);
        }, 100);
        
        // Don't set isSubmittingTool to false here, it's set in the timeout above
        return;
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setStatusMessage("An unexpected error occurred. Please try again.");
      
      setToolErrors({
        _form: "An unexpected error occurred. Please try again."
      });
      
      // For unexpected errors, we'll disable the loading state after a short delay
      setTimeout(() => {
        setIsSubmittingTool(false);
      }, 100);
      
      return;
    }
    
    // This will only run if none of the above return statements execute
    // (i.e., if there's some unhandled condition)
    setIsSubmittingTool(false);
  };
  
  const handlePatternSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Start loading state and announce to screen readers
    setIsSubmittingPattern(true);
    setStatusMessage("Submitting your pattern. Please wait...");
    
    try {
      // Note: preventDefault is already called in the form component
      const form = event.currentTarget;
      const formData = new FormData(form);
      
      // Submit the form data
      const result = await submitPatternForm(formData);
      
      if (result.success) {
        // Update status for screen readers
        setStatusMessage("Pattern submitted successfully! Redirecting to success page.");
        
        // Navigate after a short delay to ensure screen readers announce success
        // Keep the loading state active until navigation
        setTimeout(() => {
          navigate('/patterns/submit/success');
          // We don't set isSubmittingPattern to false here because we're navigating away
        }, 500);
        
        // Don't set isSubmittingPattern to false since we're navigating away
        return;
      } else if (result.errors) {
        // Update status for screen readers
        setStatusMessage("There were errors in your submission. Please correct them and try again.");
        
        // Set errors for the form to display
        setPatternErrors(result.errors);
        
        // No scroll behavior, just focus the error summary
        setTimeout(() => {
          const errorSummary = document.getElementById('error-summary');
          if (errorSummary) {
            errorSummary.focus();
          }
          
          // Only disable the loading state after errors are displayed and focus is set
          setIsSubmittingPattern(false);
        }, 100);
        
        // Don't set isSubmittingPattern to false here, it's set in the timeout above
        return;
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setStatusMessage("An unexpected error occurred. Please try again.");
      
      setPatternErrors({
        _form: "An unexpected error occurred. Please try again."
      });
      
      // For unexpected errors, we'll disable the loading state after a short delay
      setTimeout(() => {
        setIsSubmittingPattern(false);
      }, 100);
      
      return;
    }
    
    // This will only run if none of the above return statements execute
    // (i.e., if there's some unhandled condition)
    setIsSubmittingPattern(false);
  };
  
  return { 
    handleToolSubmit, 
    handlePatternSubmit,
    toolErrors,
    patternErrors,
    isSubmittingTool,
    isSubmittingPattern,
    statusMessage
  };
} 
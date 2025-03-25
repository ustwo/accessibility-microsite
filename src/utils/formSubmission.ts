import { useNavigate } from 'react-router-dom';
import { submitNewItem } from "./googleSheets";
import { z } from "zod";
import { useState } from "react";

// Define validation schemas using Zod
export const ToolSchema = z.object({
  name: z.string().min(1, "Please enter a tool name"),
  description: z.string().min(1, "Please provide a description"),
  url: z.string().min(1, "Please enter a URL"),
  discipline: z.array(z.string()).min(1, "Please specify which disciplines this tool is for"),
  source: z.string().min(1, "Please specify the source of the tool"),
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
      source: result.data.source,
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
          linkyDinks.push({ title, url });
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
  
  const handleToolSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Note: preventDefault is already called in the form component
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    // Clear any previous server errors only if explicitly needed
    // We're not clearing errors here, as they'll only clear on blur
    
    const result = await submitToolForm(formData);
    if (result.success) {
      navigate('/tools/submit/success');
    } else if (result.errors) {
      // Set errors for the form to display
      setToolErrors(result.errors);
      
      // Scroll to top for error summary
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Focus error summary after a short delay
      setTimeout(() => {
        const errorSummary = document.getElementById('error-summary');
        if (errorSummary) {
          errorSummary.focus();
        }
      }, 100);
    }
  };
  
  const handlePatternSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Note: preventDefault is already called in the form component
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    // Clear any previous server errors only if explicitly needed
    // We're not clearing errors here, as they'll only clear on blur
    
    const result = await submitPatternForm(formData);
    if (result.success) {
      navigate('/patterns/submit/success');
    } else if (result.errors) {
      // Set errors for the form to display
      setPatternErrors(result.errors);
      
      // Scroll to top for error summary
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Focus error summary after a short delay
      setTimeout(() => {
        const errorSummary = document.getElementById('error-summary');
        if (errorSummary) {
          errorSummary.focus();
        }
      }, 100);
    }
  };
  
  return { 
    handleToolSubmit, 
    handlePatternSubmit,
    toolErrors,
    patternErrors
  };
} 
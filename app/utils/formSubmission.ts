import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { submitNewItem } from "./edgeGoogleSheets";

interface FormSubmissionOptions {
  formData: FormData;
  schema: z.ZodSchema;
  type: "tool" | "pattern";
  successPath: string;
  formatData: (validatedData: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * Shared function for handling form submissions
 * Centralizes the logic for form validation, data formatting, submission, and redirect handling
 */
export async function handleFormSubmission({
  formData,
  schema,
  type,
  successPath,
  formatData,
}: FormSubmissionOptions) {
  console.log(`===== SERVER: ${type} submission action function called =====`);
  const rawFormData = Object.fromEntries(formData);
  
  console.log('===== SERVER: Form data received =====', rawFormData);
  
  try {
    // Validate the form data against the schema
    const validatedData = schema.parse(rawFormData);
    console.log('===== SERVER: Validation successful =====', validatedData);
    
    // Format the data for submission
    const submissionData = formatData(validatedData);
    console.log('===== SERVER: Submitting data to Google Sheets =====', submissionData);
    
    try {
      // Submit the data
      const success = await submitNewItem(type, submissionData);
      
      if (success) {
        console.log('===== SERVER: Submission successful, redirecting =====');
        console.log(`===== SERVER: Redirecting to ${successPath} =====`);
        
        // Return JSON with a flag that indicates success and where to redirect
        return json({
          success: true,
          redirect: successPath
        });
      } else {
        console.log('===== SERVER: Submission failed =====');
        return json({
          success: false,
          errors: { _form: `Failed to submit the ${type}. Please try again.` }
        });
      }
    } catch (submitError) {
      console.error('===== SERVER: Error during submission =====', submitError);
      return json({
        success: false,
        errors: { _form: `An error occurred during submission. Please try again.` }
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce((acc: Record<string, string>, curr) => {
        const fieldName = curr.path[0] as string;
        acc[fieldName] = curr.message;
        return acc;
      }, {});
      
      console.log("===== SERVER: Validation errors =====", fieldErrors);
      
      return json({
        success: false,
        errors: fieldErrors
      });
    }
    
    console.error("===== SERVER: Unexpected error =====", error);
    
    return json({
      success: false,
      errors: { _form: "An unexpected error occurred. Please try again." }
    });
  }
} 
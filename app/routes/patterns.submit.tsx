import { json, redirect, ActionFunctionArgs } from "@remix-run/node";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import Layout from "~/components/Layout";
import { submitNewItem } from "~/utils/googleSheets";
import { z } from "zod";
import { useAccessibleForm, ErrorSummary, ErrorMessage } from "~/utils/formUtils";

// Define validation schema using Zod
const PatternSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  example: z.string().min(10, "Example must be at least 10 characters"),
  wcagCriteria: z.string().min(1, "At least one WCAG criterion is required"),
  tags: z.string().min(1, "At least one tag is required"),
  code: z.string().min(10, "Code sample must be at least 10 characters"),
  codeLanguage: z.string().min(1, "Code language is required")
});

// Define the type for our form errors
type FormErrors = {
  _form?: string;
  name?: string;
  description?: string;
  example?: string;
  wcagCriteria?: string;
  tags?: string;
  code?: string;
  codeLanguage?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const rawFormData = Object.fromEntries(formData);
  
  // Return a specific error response when we have validation errors
  try {
    const validatedData = PatternSchema.parse(rawFormData);
    
    // Format the data for the API
    const submissionData = {
      name: validatedData.name,
      description: validatedData.description,
      example: validatedData.example,
      wcagCriteria: validatedData.wcagCriteria.split(",").map(criteria => criteria.trim()),
      tags: validatedData.tags.split(",").map(tag => tag.trim()),
      code: validatedData.code,
      codeLanguage: validatedData.codeLanguage
    };
    
    // Submit to Google Sheets
    const success = await submitNewItem("pattern", submissionData);
    
    if (success) {
      return redirect("/patterns/submit/success");
    } else {
      return json<{ success: boolean; errors: FormErrors }>({
        success: false,
        errors: { _form: "Failed to submit the pattern. Please try again." }
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce((acc, curr) => {
        const fieldName = curr.path[0];
        acc[fieldName as keyof FormErrors] = curr.message;
        return acc;
      }, {} as FormErrors);
      
      return json<{ success: boolean; errors: FormErrors }>({
        success: false,
        errors: fieldErrors
      });
    }
    
    return json<{ success: boolean; errors: FormErrors }>({
      success: false,
      errors: { _form: "An unexpected error occurred. Please try again." }
    });
  }
}

export default function SubmitPattern() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // Use the accessible form hook
  const {
    formValues,
    formErrors,
    hasErrors,
    handleChange,
    handleBlur
  } = useAccessibleForm(
    {
      name: "",
      description: "",
      example: "",
      wcagCriteria: "",
      tags: "",
      code: "",
      codeLanguage: "html"
    },
    actionData
  );
  
  return (
    <Layout title="Submit an Accessibility Pattern">
      <div className="max-w-2xl mx-auto">
        <p className="mb-6">
          Share an accessibility pattern with the community. Your submission will be reviewed before being added to the directory.
        </p>
        
        {/* Error summary - only shown when there are errors */}
        {hasErrors && <ErrorSummary errors={formErrors} />}
        
        <Form method="post" noValidate className="space-y-6">
          <div className="form-group">
            <label htmlFor="name" id="name-label">Pattern Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-describedby={formErrors.name ? "name-error" : undefined}
              aria-invalid={formErrors.name ? "true" : undefined}
              className={formErrors.name ? "input-error" : ""}
            />
            <ErrorMessage id="name-error" error={formErrors.name} />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" id="description-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              aria-describedby={formErrors.description ? "description-error" : undefined}
              aria-invalid={formErrors.description ? "true" : undefined}
              className={formErrors.description ? "input-error" : ""}
            ></textarea>
            <ErrorMessage id="description-error" error={formErrors.description} />
          </div>
          
          <div className="form-group">
            <label htmlFor="example" id="example-label">Example Use Case</label>
            <textarea
              id="example"
              name="example"
              value={formValues.example}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              placeholder="Describe a real-world example of when to use this pattern"
              aria-describedby={formErrors.example ? "example-error" : undefined}
              aria-invalid={formErrors.example ? "true" : undefined}
              className={formErrors.example ? "input-error" : ""}
            ></textarea>
            <ErrorMessage id="example-error" error={formErrors.example} />
          </div>
          
          <div className="form-group">
            <label htmlFor="wcagCriteria" id="wcagCriteria-label">WCAG Criteria (comma-separated)</label>
            <input
              type="text"
              id="wcagCriteria"
              name="wcagCriteria"
              value={formValues.wcagCriteria}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="1.3.1, 2.4.3, 4.1.2"
              aria-describedby={formErrors.wcagCriteria ? "wcagCriteria-error" : undefined}
              aria-invalid={formErrors.wcagCriteria ? "true" : undefined}
              className={formErrors.wcagCriteria ? "input-error" : ""}
            />
            <ErrorMessage id="wcagCriteria-error" error={formErrors.wcagCriteria} />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags" id="tags-label">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formValues.tags}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Focus management, Forms, ARIA"
              aria-describedby={formErrors.tags ? "tags-error" : undefined}
              aria-invalid={formErrors.tags ? "true" : undefined}
              className={formErrors.tags ? "input-error" : ""}
            />
            <ErrorMessage id="tags-error" error={formErrors.tags} />
          </div>
          
          <div className="form-group">
            <label htmlFor="code" id="code-label">Code Sample</label>
            <textarea
              id="code"
              name="code"
              value={formValues.code}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={8}
              placeholder="Paste your code example here"
              aria-describedby={formErrors.code ? "code-error" : undefined}
              aria-invalid={formErrors.code ? "true" : undefined}
              className={formErrors.code ? "input-error" : ""}
            ></textarea>
            <ErrorMessage id="code-error" error={formErrors.code} />
          </div>
          
          <div className="form-group">
            <label htmlFor="codeLanguage" id="codeLanguage-label">Code Language</label>
            <select
              id="codeLanguage"
              name="codeLanguage"
              value={formValues.codeLanguage}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-describedby={formErrors.codeLanguage ? "codeLanguage-error" : undefined}
              aria-invalid={formErrors.codeLanguage ? "true" : undefined}
              className={formErrors.codeLanguage ? "input-error" : ""}
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="jsx">JSX</option>
              <option value="tsx">TSX</option>
            </select>
            <ErrorMessage id="codeLanguage-error" error={formErrors.codeLanguage} />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="button"
            >
              {isSubmitting ? "Submitting..." : "Submit Pattern"}
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
} 
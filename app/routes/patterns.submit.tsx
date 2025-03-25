import { ActionFunctionArgs, json } from "@remix-run/server-runtime";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import Layout from "~/components/Layout";
import { z } from "zod";
import { useAccessibleForm, ErrorSummary, ErrorMessage, formatZodErrors } from "~/utils/formUtils";
import { handleFormSubmission } from "~/utils/formSubmission";
import { useEffect } from "react";

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

// Type definition for successful response
type SuccessResponse = {
  success: true;
  redirect: string;
};

// Type definition for error response
type ErrorResponse = {
  success: false;
  errors: Record<string, string>;
};

export async function action({ request }: ActionFunctionArgs) {
  // Use the shared form submission utility
  const formData = await request.formData();
  console.log("===== SERVER: Form data received:", Object.fromEntries(formData));

  // Validate the form data using Zod
  const validationResult = PatternSchema.safeParse(Object.fromEntries(formData));
  
  if (!validationResult.success) {
    console.log("===== SERVER: Validation errors:", validationResult.error.format());
    return json<ErrorResponse>({ 
      success: false, 
      errors: formatZodErrors(validationResult.error.format()) 
    });
  }
  
  // Submit to Google Sheet
  await handleFormSubmission({
    formData: formData,
    schema: PatternSchema,
    type: "pattern",
    successPath: "/patterns/submit/success",
    formatData: (data) => ({
      "Pattern Name": data.name,
      "Description": data.description,
      "Example Use Case": data.example,
      "WCAG Criteria": data.wcagCriteria,
      "Tags": data.tags,
      "Code Sample": data.code,
      "Timestamp": new Date().toISOString()
    })
  });
  
  // We shouldn't reach here if handleFormSubmission does its job
  // but add this as a fallback
  return json<SuccessResponse>({
    success: true,
    redirect: "/patterns/submit/success"
  });
}

export default function SubmitPattern() {
  console.log("===== CLIENT: SubmitPattern component rendering =====");
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // Handle successful submission by redirecting client-side
  useEffect(() => {
    if (actionData?.success) {
      const successData = actionData as SuccessResponse;
      console.log("===== CLIENT: Successful submission, redirecting to", successData.redirect);
      window.location.href = successData.redirect;
    }
  }, [actionData]);
  
  // Use the accessible form hook with client-side validation
  const {
    formValues,
    formErrors,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit
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
    PatternSchema, // Pass the Zod schema for client-side validation
    actionData
  );
  
  return (
    <Layout title="Submit an Accessibile Pattern">
      <section className="content-section">
        <div className="container container-content">
          <p className="mb-6 subtitle">
            Share an accessibile pattern with the community. Your submission will be reviewed before being added to the library.
          </p>
          
          {/* Show error summary if there are form errors */}
          {hasErrors && (
            <ErrorSummary errors={formErrors} />
          )}
          
          <Form method="post" onSubmit={handleSubmit} noValidate className="space-y-6">
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
      </section>
    </Layout>
  );
} 
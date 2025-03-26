import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import { useFormSubmission, ToolSchema } from "../../utils/formSubmission";
import { useAccessibleForm, ErrorSummary, ErrorMessage } from "../../utils/formUtils";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

// ScrollToTop component that uses React Router's useLocation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default function ToolsSubmit() {
  const { handleToolSubmit, toolErrors, isSubmittingTool, statusMessage } = useFormSubmission();
  const [disciplineOptions] = useState([
    "All", "Design", "Tech", "Product", "QA", "Delivery", "Strategy", "Client"
  ]);
  const [sourceOptions] = useState(["ustwo", "external"]);

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
      url: "",
      discipline: [],
      source: "external",
      notes: ""
    },
    ToolSchema, // Pass the Zod schema for client-side validation
    toolErrors // Pass server errors from form submission
  );

  return (
    <Layout title="Submit a Tool">
      <ScrollToTop />
      <Helmet>
        <title>Submit a Tool - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Submit your favorite accessibility tool to be featured on our site."
        />
      </Helmet>

      {/* Live region for screen reader announcements */}
      <div 
        className="sr-only" 
        aria-live="assertive" 
        role="status"
        id="form-submission-status"
      >
        {statusMessage}
      </div>

      <section className="content-section" aria-labelledby="submit-heading">
        <div className="container container-content">
          <p className="intro-text mb-8">
            Share your favorite accessibility tool with the community. We appreciate your contributions!
          </p>
          
          <div className="form-container">
            {/* Show error summary if there are form errors */}
            {hasErrors && (
              <ErrorSummary errors={formErrors} />
            )}
            
            {/* Show loading spinner during submission */}
            {isSubmittingTool && (
              <div 
                className="form-loading-overlay" 
                aria-labelledby="form-submission-status"
              >
                <LoadingSpinner message="Submitting your tool..." />
              </div>
            )}
            
            <form 
              onSubmit={(e) => {
                // Prevent default form submission
                e.preventDefault();
                
                // Run client-side validation
                const isValid = handleSubmit(e);
                
                // If the form is valid according to client-side validation, submit to server
                if (isValid) {
                  handleToolSubmit(e);
                }
              }} 
              className="submission-form" 
              noValidate
              aria-busy={isSubmittingTool}
            >
              <div className="form-group">
                <label htmlFor="name">
                  Tool Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={`form-control ${formErrors.name ? "input-error" : ""}`}
                  placeholder="Enter the name of the tool"
                  value={formValues.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                  aria-invalid={formErrors.name ? "true" : undefined}
                  disabled={isSubmittingTool}
                />
                <ErrorMessage id="name-error" error={formErrors.name} />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  className={`form-control ${formErrors.description ? "input-error" : ""}`}
                  placeholder="Briefly describe what the tool does and how it helps with accessibility"
                  rows={4}
                  value={formValues.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.description ? "description-error" : undefined}
                  aria-invalid={formErrors.description ? "true" : undefined}
                  disabled={isSubmittingTool}
                ></textarea>
                <ErrorMessage id="description-error" error={formErrors.description} />
              </div>
              
              <div className="form-group">
                <label htmlFor="url">
                  URL <span className="required">*</span>
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  required
                  className={`form-control ${formErrors.url ? "input-error" : ""}`}
                  placeholder="https://example.com"
                  value={formValues.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.url ? "url-error" : undefined}
                  aria-invalid={formErrors.url ? "true" : undefined}
                  disabled={isSubmittingTool}
                />
                <ErrorMessage id="url-error" error={formErrors.url} />
                <p className="form-help">Enter the URL where this tool can be found</p>
              </div>
              
              <div className="form-group">
                <fieldset disabled={isSubmittingTool}>
                  <legend>
                    Which disciplines is this tool for? <span className="required">*</span>
                  </legend>
                  {formErrors.discipline && (
                    <div className="error-message" id="discipline-error">{formErrors.discipline}</div>
                  )}
                  <div className="checkbox-group">
                    {disciplineOptions.map(option => (
                      <div key={option} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`discipline-${option.toLowerCase()}`}
                          name="discipline"
                          value={option}
                          checked={Array.isArray(formValues.discipline) && (formValues.discipline as string[]).includes(option)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-describedby={formErrors.discipline ? "discipline-error" : undefined}
                          disabled={isSubmittingTool}
                        />
                        <label htmlFor={`discipline-${option.toLowerCase()}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              
              <div className="form-group">
                <label htmlFor="source">Source</label>
                <select
                  id="source"
                  name="source"
                  className={`form-control ${formErrors.source ? "input-error" : ""}`}
                  value={formValues.source}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.source ? "source-error" : undefined}
                  aria-invalid={formErrors.source ? "true" : undefined}
                  disabled={isSubmittingTool}
                >
                  <option value="">Select a source</option>
                  {sourceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ErrorMessage id="source-error" error={formErrors.source} />
                <p className="form-help">Is this tool from ustwo or external?</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  className={`form-control ${formErrors.notes ? "input-error" : ""}`}
                  placeholder="Any additional information about the tool (optional)"
                  rows={3}
                  value={formValues.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.notes ? "notes-error" : undefined}
                  aria-invalid={formErrors.notes ? "true" : undefined}
                  disabled={isSubmittingTool}
                ></textarea>
                <ErrorMessage id="notes-error" error={formErrors.notes} />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="button" disabled={isSubmittingTool}>
                  {isSubmittingTool ? "Submitting..." : "Submit Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
} 
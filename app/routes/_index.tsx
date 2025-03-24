import type { MetaFunction } from "@remix-run/react";
import { Link } from "@remix-run/react";
import Layout from "~/components/Layout";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "ustwo Accessibility Microsite - Resources for Designers and Developers",
    },
    {
      name: "description",
      content:
        "Helping designers, developers, product owners, and QAs design and deliver accessible digital products and services.",
    },
  ];
};

export default function Index() {
  return (
    <Layout>
      <div className="hero-section py-8">
        <div className="container">
          <div className="flex flex-col gap-8 items-center text-center">
            <h1>ustwo Accessibility Microsite</h1>
            <p className="text-xl max-w-3xl">
              Helping designers, developers, product owners, and QAs design and
              deliver accessible digital products and services.
            </p>
          </div>
        </div>
      </div>

      <section className="py-8" aria-labelledby="principles-heading">
        <div className="container">
          <h2 id="principles-heading" className="mb-6">
            Core Accessibility Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3>Perceivable</h3>
              <p>
                Information and user interface components must be presentable to
                users in ways they can perceive. This means information
                can&apos;t be invisible to all of a user&apos;s senses.
              </p>
              <a
                href="https://www.w3.org/WAI/WCAG21/Understanding/perceivable"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about perceivable
              </a>
            </div>
            <div className="card">
              <h3>Operable</h3>
              <p>
                User interface components and navigation must be operable. This
                means users must be able to operate the interface, and it
                can&apos;t require interaction that a user cannot perform.
              </p>
              <a
                href="https://www.w3.org/WAI/WCAG21/Understanding/operable"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about operable
              </a>
            </div>
            <div className="card">
              <h3>Understandable</h3>
              <p>
                Information and the operation of user interface must be
                understandable. This means users must be able to understand the
                information and operation of the user interface.
              </p>
              <a
                href="https://www.w3.org/WAI/WCAG21/Understanding/understandable"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about understandable
              </a>
            </div>
            <div className="card">
              <h3>Robust</h3>
              <p>
                Content must be robust enough that it can be interpreted by a
                wide variety of user agents, including assistive technologies.
                As technologies evolve, content should remain accessible.
              </p>
              <a
                href="https://www.w3.org/WAI/WCAG21/Understanding/robust"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about robust
              </a>
            </div>
            <div className="card">
              <h3>Inclusive Design</h3>
              <p>
                Design for users with the widest range of abilities and
                circumstances. Accessibility is a foundation for inclusivity,
                but true inclusion goes beyond compliance.
              </p>
              <a
                href="https://www.microsoft.com/design/inclusive/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about inclusive design
              </a>
            </div>
            <div className="card">
              <h3>User Testing</h3>
              <p>
                Always involve people with disabilities in your testing and
                research. Compliance with standards doesn&apos;t guarantee a
                good user experience.
              </p>
              <a
                href="https://www.w3.org/WAI/test-evaluate/involving-users/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about user testing
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-100" aria-labelledby="sections-heading">
        <div className="container">
          <h2 id="sections-heading" className="mb-6">
            Explore Our Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3>Accessibility Tools</h3>
              <p>
                Find tools to help evaluate, test, and improve the accessibility
                of your digital products. From automated testing tools to screen
                readers and more.
              </p>
              <Link to="/tools" className="button mt-4">
                Browse Tools
              </Link>
            </div>
            <div className="card">
              <h3>Accessibility Patterns</h3>
              <p>
                Discover reusable accessibility patterns that solve common
                design challenges. Each pattern includes examples, code, and
                WCAG success criteria.
              </p>
              <Link to="/patterns" className="button mt-4">
                Browse Patterns
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <div className="card">
              <h3>Screen Reader Guide</h3>
              <p>
                Learn how to test your website with screen readers on both Mac
                and Windows. This interactive guide will help you understand how
                screen reader users experience your site.
              </p>
              <Link to="/screen-reader-guide" className="button mt-4">
                Start the Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8" aria-labelledby="contribute-heading">
        <div className="container">
          <h2 id="contribute-heading" className="mb-6">
            Contribute Your Knowledge
          </h2>
          <p className="mb-6">
            We welcome contributions from the accessibility community. Share
            your favorite tools or patterns to help others create more
            accessible digital experiences.
          </p>
          <div className="flex gap-4">
            <Link to="/tools/submit" className="button">
              Submit a Tool
            </Link>
            <Link to="/patterns/submit" className="button">
              Submit a Pattern
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

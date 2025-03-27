import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <Layout title="About this site">
      <Helmet>
        <title>About this site - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Learn about our commitment to accessibility and inclusive design at ustwo."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="about-intro">
        <div className="container container-content">
          <h2 id="about-intro">Our commitment to accessibility</h2>
          <p>
            At ustwo, we believe that digital experiences should be accessible to everyone. We&apos;re a world-leading digital product studio renowned for creating experiences that delight and empower users. When we craft digital products, we ensure that each user – in all their beautiful diversity – can access the information and services our clients provide.
          </p>
          <p>
            With the European Accessibility Act (EAA) coming into effect in June 2025, we&apos;re excited to lead the way in making digital products accessible to all. This site represents our commitment to sharing knowledge and best practices with the wider community.
          </p>
        </div>
      </section>

      <section className="content-section" aria-labelledby="about-principles">
        <div className="container container-content">
          <h2 id="about-principles">Our accessibility principles</h2>
          <p>
            We&apos;ve developed a set of guiding principles to help teams create accessible digital experiences. These principles are designed to be practical, engaging, and effective:
          </p>
          <ul>
            <li><Link to="/tools">Level-up your gear</Link> - Discover the best tools for accessibility testing and development</li>
            <li><Link to="/patterns">Enjoy the patterns</Link> - Learn from proven accessibility patterns and solutions</li>
            <li><Link to="/checklist">Think beyond touch</Link> - Consider all interaction methods and user needs</li>
            <li><Link to="/screen-reader-guide">Close your eyes</Link> - Master screen reader testing and optimization</li>
            <li><Link to="/testing-templates">Party party (test) party</Link> - Make testing fun and thorough</li>
          </ul>
        </div>
      </section>

      <section className="content-section" aria-labelledby="about-facts">
        <div className="container container-content">
          <h2 id="about-facts">Why accessibility matters</h2>
          <ul>
            <li>Inclusive design improves the experience for everyone</li>
            <li>Accessibility and innovation go hand in hand</li>
            <li>Building for accessibility from the start saves time and resources</li>
          </ul>
        </div>
      </section>

      <section className="content-section" aria-labelledby="about-examples">
        <div className="container container-content">
          <h2 id="about-examples">Real-world impact</h2>
          <p>
            Our commitment to accessibility has led to significant achievements:
          </p>
          <ul>
            <li>Fully accessible apps like Bodycoach and Spotscan</li>
            <li>Accessible payment flows handling billions in transactions</li>
            <li>Comprehensive design systems with accessibility built-in</li>
          </ul>
        </div>
      </section>

      <section className="content-section" aria-labelledby="about-contribute">
        <div className="container container-content">
          <h2 id="about-contribute">Join the community</h2>
          <p>
            We&apos;re building this resource to help everyone create better, more accessible digital experiences. We welcome contributions from the accessibility community.
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
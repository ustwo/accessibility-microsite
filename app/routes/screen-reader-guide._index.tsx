import { json } from "@remix-run/server-runtime";
import { Link } from "@remix-run/react";
import Layout from "~/components/Layout";

export function loader() {
  return json({
    guides: [
      {
        id: "voiceover-mac",
        name: "VoiceOver (macOS)",
        description: "Learn how to use the built-in screen reader on Mac computers.",
        iconPath: "/icons/apple.svg",
      },
      {
        id: "nvda-windows",
        name: "NVDA (Windows)",
        description: "Learn how to use the free, open-source screen reader for Windows.",
        iconPath: "/icons/windows.svg",
      },
      {
        id: "jaws-windows",
        name: "JAWS (Windows)",
        description: "Learn how to use the most popular commercial screen reader for Windows.",
        iconPath: "/icons/windows.svg",
      },
      {
        id: "talkback-android",
        name: "TalkBack (Android)",
        description: "Learn how to use the built-in screen reader on Android devices.",
        iconPath: "/icons/android.svg",
      },
    ],
  });
}

export default function ScreenReaderGuideIndex() {
  return (
    <Layout title="Screen Reader Guide">
      <section className="content-section">
        <div className="container container-content">
          <h2 className="mb-4">Why Test with Screen Readers?</h2>
          <p>
            Screen readers are essential tools for people with visual impairments to navigate the web. Testing your websites and applications with screen readers helps ensure they&apos;re accessible to all users.
          </p>
          <p className="mt-4">
            This guide will help you get started with the most common screen readers on different platforms. Each guide includes:
          </p>
          <ul className="list-disc pl-8 mt-2">
            <li>How to install and configure the screen reader</li>
            <li>Basic navigation commands</li>
            <li>Common testing scenarios</li>
            <li>Tips for effective testing</li>
          </ul>
        </div>
      </section>

      <section className="content-section bg-gray-100">
        <div className="container container-full">
          <h2 className="mb-6 text-center">Choose a Screen Reader Guide</h2>
          <div className="container container-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <h3>VoiceOver (macOS)</h3>
                <p>
                  Learn how to use the screen reader built into macOS to test your websites and applications.
                </p>
                <div className="mt-4">
                  <Link to="/screen-reader-guide/voiceover-mac" className="button">
                    Start VoiceOver Guide
                  </Link>
                </div>
              </div>
              
              <div className="card">
                <h3>NVDA (Windows)</h3>
                <p>
                  Learn how to use the free, open-source screen reader for Windows to test your websites and applications.
                </p>
                <div className="mt-4">
                  <Link to="/screen-reader-guide/nvda-windows" className="button">
                    Start NVDA Guide
                  </Link>
                </div>
              </div>

              <div className="card">
                <h3>JAWS (Windows)</h3>
                <p>
                  Learn how to use the commercial screen reader for Windows to test your websites and applications.
                </p>
                <div className="mt-4">
                  <Link to="/screen-reader-guide/jaws-windows" className="button">
                    Start JAWS Guide
                  </Link>
                </div>
              </div>

              <div className="card">
                <h3>TalkBack (Android)</h3>
                <p>
                  Learn how to use the built-in screen reader on Android devices to test your mobile websites and applications.
                </p>
                <div className="mt-4">
                  <Link to="/screen-reader-guide/talkback-android" className="button">
                    Start TalkBack Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container container-content">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="mb-4">Screen Reader Testing Tips</h3>
            <ul className="list-disc pl-8">
              <li>Test with multiple screen readers when possible.</li>
              <li>Use keyboard navigation only (no mouse) while testing.</li>
              <li>Listen to the entire page to understand the user experience.</li>
              <li>Test common user flows and important functionality.</li>
              <li>Check that all important information is being announced.</li>
              <li>Verify that the reading order matches the visual order.</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
} 
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import './ScreenReaderGuide.css';
import Section from "../../components/Section";
import Grid, { Col } from "../../components/Grid";

export default function ScreenReaderGuideIndex() {
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const handlePracticeComplete = (sectionNumber: number) => {
    setCompletedSections(prev => {
      const newSet = new Set(prev);
      newSet.add(sectionNumber);
      return newSet;
    });
  };

  const isCompleted = (sectionNumber: number) => completedSections.has(sectionNumber);
  const allCompleted = completedSections.size === 4;

  return (
    <Layout
      title="Screen Reader Guide"
      introText="Welcome to your interactive guide for learning VoiceOver! Follow these steps and practice along to become comfortable with screen reader testing."
    > 
      <Helmet>
        <title>Screen Reader Guide - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Learn how to use screen readers for accessibility testing."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            <div className="guide-sections">
              <section className="guide-section" aria-labelledby="section1">
                <h2 id="section1">1. Turn it on and off with Cmd+F5</h2>
                <p>If there is a popup saying "Use voiceover" then check "Don't show this again"</p>
                <button 
                  className={`button ${isCompleted(1) ? 'completed' : ''}`}
                  onClick={() => handlePracticeComplete(1)}
                  aria-label="Practice turning VoiceOver on and off"
                  disabled={isCompleted(1)}
                >
                  {isCompleted(1) ? "Completed! ✓" : "I've practiced this!"}
                </button>
              </section>

              <section className="guide-section" aria-labelledby="section2">
                <h2 id="section2">2. Practice turning it on and off</h2>
                <p>You will need to do this often and it's good to know how to do it quickly.</p>
                <div className="practice-area">
                  <p>Try turning VoiceOver:</p>
                  <ul>
                    <li>On and wait for the welcome message</li>
                    <li>Off and notice the shutdown sound</li>
                    <li>On again and navigate to this text</li>
                  </ul>
                  <button 
                    className={`button ${isCompleted(2) ? 'completed' : ''}`}
                    onClick={() => handlePracticeComplete(2)}
                    aria-label="Mark VoiceOver toggle practice as complete"
                    disabled={isCompleted(2)}
                  >
                    {isCompleted(2) ? "Completed! ✓" : "I've got this!"}
                  </button>
                </div>
              </section>

              <section className="guide-section" aria-labelledby="section3">
                <h2 id="section3">3. Navigate to gov.uk</h2>
                <p>Get used to navigating through buttons and links using the tab key. Perform a search. Tab into the results. Always listen to the screen reader and do what it says – if it tells you to press Command + Option + Space to follow a link, then do that (rather than pressing Enter or clicking).</p>
                <button 
                  className={`button ${isCompleted(3) ? 'completed' : ''}`}
                  onClick={() => handlePracticeComplete(3)}
                  aria-label="Mark website navigation practice as complete"
                  disabled={isCompleted(3)}
                >
                  {isCompleted(3) ? "Completed! ✓" : "I've tried this!"}
                </button>
              </section>

              <section className="guide-section" aria-labelledby="section4">
                <h2 id="section4">4. Explore with modifier keys</h2>
                <p>These are Ctrl + Option + arrow keys (left and right – not up and down!). They allow you to move into any content and have it read out.</p>
                <div className="keyboard-visual">
                  <kbd>Ctrl</kbd> + <kbd>Option</kbd> + <kbd>←</kbd>/<kbd>→</kbd>
                </div>
                <button 
                  className={`button ${isCompleted(4) ? 'completed' : ''}`}
                  onClick={() => handlePracticeComplete(4)}
                  aria-label="Mark modifier keys practice as complete"
                  disabled={isCompleted(4)}
                >
                  {isCompleted(4) ? "Completed! ✓" : "I've explored this!"}
                </button>
              </section>
            </div>

            {allCompleted && (
              <div className="congratulations" role="alert">
                <h2>🎉 Congratulations!</h2>
                <p>You've practiced all the basic VoiceOver commands. Keep practicing to become more comfortable with screen reader testing.</p>
              </div>
            )}
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 
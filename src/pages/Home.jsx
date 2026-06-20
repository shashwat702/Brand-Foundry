import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />

      <section className="section-shell">
        <div className="section-intro">
          <span className="eyebrow">The toolkit</span>
          <h2>Everything you need to find the right words.</h2>
          <p>Focused tools that help you move from a rough idea to useful, publishable brand content.</p>
        </div>

        <div className="features">
          <FeatureCard
            number="01"
            title="Slogan Generator"
            description="Develop concise, memorable lines grounded in your product and audience."
          />
          <FeatureCard
            number="02"
            title="Billboard Ads"
            description="Turn your core message into sharp copy designed to be understood at a glance."
          />
          <FeatureCard
            number="03"
            title="AI Reel Generator"
            description="Create structured concepts and scripts for short-form marketing content."
          />
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-intro section-intro-centered">
          <span className="eyebrow">A simple process</span>
          <h2>From idea to usable direction.</h2>
          <p>Turn your startup idea into ready-to-use brand content in three easy steps.</p>
        </div>

        <div className="steps">
          <article className="step-card">
            <span className="step-number">01</span>
            <h3>Describe your startup</h3>
            <p>Share your idea, audience, and the personality you want the brand to have.</p>
          </article>
          <article className="step-card">
            <span className="step-number">02</span>
            <h3>Generate direction</h3>
            <p>Use your brief to create relevant slogans, campaigns, and marketing concepts.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span>
            <h3>Refine and publish</h3>
            <p>Review the results, keep the strongest ideas, and put them to work for your brand.</p>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;

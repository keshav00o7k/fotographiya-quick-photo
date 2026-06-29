import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Introducing the <br />
            All-New Fotographiya App
          </h1>

          <div className="highlight-line4"></div>

          <p>
            A photo sharing app powered by AI that helps you smartly share, find
            and interact with your photos.
          </p>
        </div>

        <div className="hero-image">
          <img src="/image/13.jpg" alt="Fotographiya App Preview" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from "react";

const Hero = () => {
  return (
    <React.Fragment>
      <div className="hero-container">
        <div className="hero-middle">
          <img src={"/hourglass.png"} alt="hourglass" className="hero-png" />
          <div className="hero-middle-right">
            <h1>Hourglass</h1>
            <p>Never miss a due date again!</p>
            <div className="hero-buttons">
              <button>Get Started</button>
              <button>Log In</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-container {
          width: 100vw;
          height: 500px;
          position: relative;
          background: #001c91;
        }

        .hero-middle {
          height: 50%;
          max-width: 100vw;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 2em;
          border-radius: 10px;
          display: flex;
        }

        .hero-png {
          width: 140px;
          height: 100%;
          transform: translateX(-10px);
        }

        .hero-middle-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hero-middle-right * {
          margin: 13px 0;
        }

        .hero-middle * {
          font-weight: 500;
        }

        button {
          cursor: pointer;
        }

        h1 {
          font-size: 3.5rem;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
          color: #f3f3f3;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Hero;

import React from "react";

import ArrowButton from "./reusable/ArrowButton";

const Hero: React.FC = () => {
  return (
    <React.Fragment>
      <div className="hero-container">
        <div className="hero-middle">
          <img src={"/hourglass.png"} alt="hourglass" className="hero-png" />
          <div className="hero-middle-right">
            <h1>Hourglass</h1>
            <p>
              Keep track of your tasks and get notified when the due date is near! Never miss a due date
              again!
            </p>
            <div className="hero-buttons">
              <ArrowButton
                text={"Get Started"}
                buttonColor={"#319795"}
                textColor={"#fff"}
                textSize={17}
                buttonHoverColor={"#0e7c79"}
                link={"/auth/signup"}
              />
              <ArrowButton
                text={"Log In"}
                buttonColor={"#d2d90c"}
                textColor={"#fff"}
                textSize={17}
                buttonHoverColor={"#b0c30b"}
                link={"/auth/login"}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          background: #e2e2e2;
        }

        .hero-middle {
          height: 70%;
          max-width: 100vw;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 1em;
          border-radius: 10px;
          display: flex;
          justify-content: space-around;
        }

        .hero-png {
          width: 25vw;
          min-width: 250px;
          max-height: 100%;
        }

        .hero-middle-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hero-middle-right > h1 {
          font-size: 6vw;
          color: #00034e;
          font-weight: 800;
        }

        .hero-middle-right > p {
          margin: 40px 0;
          text-align: center;
          font-weight: 400;
          line-height: 1.4em;
          font-size: 1rem;
          color: #37375d;
        }

        .hero-buttons {
          width: 100%;
          display: flex;
          justify-content: space-evenly;
          margin: 30px 0;
          align-items: center;
        }

        @media screen and (max-width: 1000px) {
          .hero-buttons {
            flex-direction: column;
          }
        }

        @media screen and (max-width: 570px) {
          .hero-middle {
            width: 80%;
            justify-content: center;
          }

          .hero-png {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
            height: 60vh;
          }

          .hero-middle-right h1 {
            font-size: 4rem;
          }

          .hero-buttons {
            margin: 10px;
            align-items: center;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default Hero;

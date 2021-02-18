import React from "react";

import Button from "../reusable/Button";

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
              <Button
                text={"Get Started"}
                buttonColor={"#319795"}
                textColor={"#fff"}
                size={"large"}
                textSize={1.2}
                buttonHoverColor={"#0e7c79"}
                margin={10}
              />
              <Button
                text={"Log In"}
                buttonColor={"#d2d90c"}
                textColor={"#451570"}
                size={"large"}
                textSize={1.2}
                buttonHoverColor={"#a2b500"}
                margin={10}
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
          background: #001c91;
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
          color: #fff;
        }

        .hero-middle-right > p {
          margin: 40px 0;
          text-align: center;
          font-weight: 300;
          line-height: 1.4em;
          color: #c6c6c6;
        }

        .hero-middle * {
          font-weight: 500;
        }

        .hero-buttons {
          width: 100%;
          display: flex;
          justify-content: space-evenly;
          margin: 30px 0;
        }

        @media screen and (max-width: 700px) {
          .hero-buttons {
            flex-direction: column;
          }
        }

        @media screen and (max-width: 500px) {
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

          .hero-middle-right h1,
          .hero-middle-right p {
            color: #ff2f2f;
          }

          .hero-middle-right h1 {
            font-size: 4rem;
          }

          .hero-buttons {
            margin: 10px;
            align-items: center;
          }
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

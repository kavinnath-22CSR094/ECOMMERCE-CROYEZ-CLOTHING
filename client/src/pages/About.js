import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About Us - Croyez Clothing"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        .about-container {
          padding: 60px 0;
          font-family: 'Poppins', sans-serif;
        }

        .about-heading {
          font-size: 38px;
          background: linear-gradient(to right, #0d6efd, #6610f2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          margin-bottom: 40px;
          text-align: center;
          animation: bounceSlide 2s ease-out;
        }

        @keyframes bounceSlide {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          60% {
            transform: translateY(20px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
          }
        }

        .move-in {
          opacity: 0;
          animation: slideInRight 1.5s ease forwards;
        }

        .move-in.delay-1 { animation-delay: 0.3s; }
        .move-in.delay-2 { animation-delay: 0.6s; }
        .move-in.delay-3 { animation-delay: 0.9s; }
        .move-in.delay-4 { animation-delay: 1.2s; }

        @keyframes slideInRight {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .about-text p {
          font-size: 16px;
          color: #444;
          line-height: 1.8;
          margin-bottom: 15px;
        }

        .about-text strong {
          color: #222;
        }

        .about-text em {
          color: #6c757d;
          font-style: italic;
        }

        .about-img {
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          transition: transform 0.4s ease;
          width: 100%;
          animation: floatImg 4s ease-in-out infinite alternate;
        }

        @keyframes floatImg {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-10px);
          }
        }

        .icon-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          color: #0d6efd;
          margin-top: 25px;
          font-weight: 600;
        }
      `}</style>

      <div className="container">
        <div className="row about-container align-items-center">
          <div className="col-md-6 mb-4">
            <img
              src="/images/about.jpeg"
              alt="about"
              className="about-img"
            />
          </div>
          <div className="col-md-6 about-text">
            <div className="icon-heading move-in delay-1">👕 Fashion with Purpose</div>
            <p className="move-in delay-1">
              <strong>Welcome to Croyez Clothing – Where Style Meets Confidence.</strong><br />
              At <strong>Croyez</strong>, we believe fashion is more than just clothing—it's a way to express who you are.
              Our name, from the French word <em>"Croyez"</em> meaning <em>"Believe"</em>, reflects our philosophy:
              <strong> believe in yourself, your style, and your journey</strong>.
            </p>

            <div className="icon-heading move-in delay-2">🚀 Our Mission</div>
            <p className="move-in delay-2">
              We offer bold streetwear, everyday essentials, and premium-quality fashion designed to empower your individuality.
              Our mission is to make you feel confident and authentic—because style starts with self-belief.
            </p>

            <div className="icon-heading move-in delay-3">👤 Why Croyez?</div>
            <p className="move-in delay-3">
              With fast shipping, hassle-free returns, and a community-first approach, Croyez Clothing is more than a brand—it's a movement.
            </p>

            <p className="move-in delay-4">
              <em>Join the Croyez movement—believe in your style, and wear it with pride.</em><br />
              <strong>✨ Croyez Clothing – Believe in What You Wear. ✨</strong>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

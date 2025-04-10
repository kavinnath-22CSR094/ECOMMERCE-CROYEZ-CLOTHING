import React from "react";
import Layout from "./../components/Layout/Layout";

const Policies = () => {
  return (
    <Layout title={"Policies - Croyez Clothing"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .policy-container {
          padding: 60px 20px;
          font-family: 'Poppins', sans-serif;
          color: #212529;
        }

        /* Typing Animation for Main Heading */
        .main-heading {
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          border-right: 2px solid #0d6efd;
          white-space: nowrap;
          overflow: hidden;
          width: 0;
          animation: typing 3s steps(40, end) forwards, blink 0.7s step-end infinite;
          color:rgb(2, 53, 130);
          margin-bottom: 50px;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: #0d6efd; }
        }

        /* Section Headings Animation */
        .policy-heading {
          font-size: 28px;
          font-weight: 700;
          margin: 30px 0 20px;
          color: #0d6efd;
          animation: revealWords 1.2s ease forwards;
          opacity: 0;
        }

        @keyframes revealWords {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Policy text */
        .policy-text p {
          margin-bottom: 14px;
          font-size: 16px;
          color: #444;
          line-height: 1.8;
          animation: fadeInText 1s ease forwards;
        }

        @keyframes fadeInText {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Animated bullet list */
        .policy-text ul {
          padding-left: 20px;
        }

        .policy-text ul li {
          margin-bottom: 10px;
          position: relative;
          padding-left: 25px;
          color: #333;
          opacity: 0;
          transform: translateX(-20px);
          animation: slideInList 0.5s ease forwards;
        }

        .policy-text ul li::before {
          content: '✔';
          position: absolute;
          left: 0;
          color: #0d6efd;
        }

        .policy-text ul li:nth-child(1) { animation-delay: 0.3s; }
        .policy-text ul li:nth-child(2) { animation-delay: 0.5s; }
        .policy-text ul li:nth-child(3) { animation-delay: 0.7s; }
        .policy-text ul li:nth-child(4) { animation-delay: 0.9s; }
        .policy-text ul li:nth-child(5) { animation-delay: 1.1s; }

        @keyframes slideInList {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Glowing emphasis text */
        .glow {
          color: #0d6efd;
          font-weight: 600;
          animation: glowPulse 1.5s infinite;
        }

        @keyframes glowPulse {
          0% { text-shadow: 0 0 5px #0d6efd; }
          50% { text-shadow: 0 0 15px #0d6efd; }
          100% { text-shadow: 0 0 5px #0d6efd; }
        }
      `}</style>

      <div className="container policy-container">
        <div className="main-heading">🛡️ Policies & Info - Croyez Clothing</div>

        {/* Privacy Policy */}
        <div>
          <h2 className="policy-heading">🧾 Privacy Policy</h2>
          <div className="policy-text">
            <p>We value your privacy. Any information collected is only used to provide better service.</p>
            <ul>
              <li>We do not sell your data.</li>
              <li>Your payment info is securely encrypted.</li>
              <li>Cookies help us personalize your experience.</li>
              <li>All communication is confidential and safe.</li>
              <li>Opt-out options available anytime.</li>
            </ul>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div>
          <h2 className="policy-heading">📜 Terms & Conditions</h2>
          <div className="policy-text">
            <p>By using our site, you agree to our usage rules and conduct policies:</p>
            <ul>
              <li>Prices may change based on promotions or updates.</li>
              <li>Accounts must be used lawfully and responsibly.</li>
              <li>We reserve the right to cancel suspicious orders.</li>
              <li>Unauthorized use of our content is prohibited.</li>
              <li>Legal action may follow for fraudulent activities.</li>
            </ul>
          </div>
        </div>

        {/* Refund & Shipping */}
        <div>
          <h2 className="policy-heading">🚚 Refund & Shipping</h2>
          <div className="policy-text">
            <p>We ensure a smooth shopping experience from order to delivery.</p>
            <ul>
              <li>Orders processed within 24–48 hours.</li>
              <li>Free shipping above ₹999.</li>
              <li>Returns accepted within 7 days.</li>
              <li>Refunds issued within 5–7 business days.</li>
              <li>Contact our team for damaged item claims.</li>
            </ul>
            <p className="glow">✨ Shop confidently with Croyez Clothing – Where trust meets style.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policies;

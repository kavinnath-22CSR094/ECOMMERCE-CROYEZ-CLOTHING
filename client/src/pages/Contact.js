import React from "react";
import Layout from "./../components/Layout/Layout";
const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/croyez.jpg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            For any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3"> 
            ✉️ : croyezclothing@gmail.com
          </p>
            <p className="mt-3">
            📞 : +91 9655633669
          </p>
          <p className="mt-3">
            📍 : 76/1 & 76/2 First Floor , Above Thilaga Medicals , Near Daily market, Perundurai , Erode , Tamil Nadu - 638052 .
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

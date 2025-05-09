// === Fully Modified CartPage.js with Razorpay backend save ===

import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalAmountValue = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const totalPrice = () => {
    try {
      return totalAmountValue.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartItem = async (pid) => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/user/cart/remove/${pid}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (data?.success) {
        setCart(cart.filter((item) => item.product._id !== pid));
        toast.success("Item removed from cart");

        const { data: updatedCart } = await axios.get(`${process.env.REACT_APP_API}/api/v1/user/cart`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setCart(updatedCart.cart);
      }
    } catch (error) {
      console.error("Remove item error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const { nonce } = await instance.requestPaymentMethod();
      if (!nonce) throw new Error("No payment nonce received");

      const paymentData = {
        nonce,
        cart: cart.map(item => ({ product: item.product._id, quantity: item.quantity })),
        amount: totalAmountValue,
      };

      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, paymentData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Payment Successful!");
      setCart([]);
    } catch (error) {
      console.error("Payment error details:", error);
      toast.error(error.response?.data?.message || "Invalid payment information");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // use env key
      amount: totalAmountValue * 100,
      currency: "INR",
      name: "CROYEZ CLOTHING",
      description: "Order Payment",
      handler: async function (response) {
        toast.success("Payment Successful! Payment ID: " + response.razorpay_payment_id);

        try {
          const backendResponse = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/razorpay/payment`, {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            cart: cart.map(item => ({ product: item.product._id, quantity: item.quantity })),
            amount: totalAmountValue,
          }, {
            headers: { Authorization: `Bearer ${auth.token}` },
          });

          if (backendResponse.data.success) {
            toast.success("Order saved successfully!");
            setCart([]);
            navigate("/", {
              state: {
                orderData: {
                  customerDetails: {
                    name: auth?.user?.name,
                    email: auth?.user?.email,
                    phone: auth?.user?.phone || "9999999999",
                    address: auth?.user?.address,
                    total: totalAmountValue,
                  },
                  cartItems: cart,
                },
              },
            });
          } else {
            toast.error("Payment succeeded but failed to save order");
          }
        } catch (err) {
          console.error("Error saving Razorpay order:", err);
          toast.error("Failed to record order after payment");
        }
      },
      prefill: {
        name: auth?.user?.name || "Customer",
        email: auth?.user?.email || "customer@example.com",
        contact: auth?.user?.phone || "9999999999",
      },
      notes: {
        address: auth?.user?.address || "No address provided",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user ? "Hello Guest" : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length ? `You Have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout !"}` : "Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 p-0 m-0">
              {cart?.map((item) => (
                <div className="row card flex-row" key={item.product._id}>
                  <div className="col-md-4">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${item.product._id}`}
                      className="card-img-top"
                      alt={item.product.name}
                      width="100%"
                      height="130px"
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{item.product.name}</p>
                    <p>{item.product.description.substring(0, 30)}</p>
                    <p>Price: {item.product.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/login", { state: "/cart" })}
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? "" : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: { flow: "vault" },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary mb-2"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Pay with Braintree"}
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={handleRazorpayPayment}
                      disabled={!auth?.user?.address}
                    >
                      Pay with Razorpay
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;

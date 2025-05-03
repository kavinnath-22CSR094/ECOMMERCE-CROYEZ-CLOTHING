import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { AiFillWarning } from "react-icons/ai";
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

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.product.price * item.quantity;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = async (pid) => {
    try {
      const { data } = await axios.delete(`/api/v1/user/cart/remove/${pid}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      
      if (data?.success) {
        // Corrected filter condition
        setCart(cart.filter((item) => item.product._id !== pid));
        toast.success("Item removed from cart");
        
        // Optional: Refresh cart from server to ensure sync
        const { data: updatedCart } = await axios.get("/api/v1/user/cart", {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setCart(updatedCart.cart);
      }
    } catch (error) {
      console.error("Remove item error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);


  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // 1. Get payment method nonce
      const { nonce } = await instance.requestPaymentMethod();
      if (!nonce) {
        throw new Error("No payment nonce received");
      }
      console.log("Received nonce:", nonce); // Should start with "tokencc_"
  
      // 2. Prepare payment data
      const paymentData = {
        nonce,
        cart: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        amount: totalPrice() // Calculate from cart
      };
  
      // 3. Submit payment
      const { data } = await axios.post(
        "/api/v1/product/braintree/payment",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      // ... handle success ...
    } catch (error) {
      console.error("Payment error details:", {
        nonceError: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || "Invalid payment information");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
            {cart?.map((item) => (
          <div className="row card flex-row" key={item.product._id}>
            <div className="col-md-4">
              <img
                src={`/api/v1/product/product-photo/${item.product._id}`}
                className="card-img-top"
                alt={item.product.name}
                width="100%"
                height={"130px"}
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
            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
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
                </>
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
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
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
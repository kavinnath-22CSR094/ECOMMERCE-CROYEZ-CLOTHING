import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [auth, setAuth] = useAuth();

  // Review states
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  // Initial details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // Get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
      loadReviewsFromStorage(data?.product._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Add to Cart
  const HandleAddToCart = async (product) => {
    try {
      if (!auth?.user) {
        toast.error("Please login to add items to cart");
        navigate("/login", { state: { from: "http://localhost:3000/login" } });
        return;
      }

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/user/cart/add`,
        { product: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (data?.success) {
        setCart(data.cart);
        toast.success(`${product.name} added to cart`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("auth");
        setAuth(null);
        navigate("/login");
      } else {
        toast.error("Failed to add item to cart");
      }
    }
  };

  // Load reviews from localStorage
  const loadReviewsFromStorage = (productId) => {
    const allReviews = JSON.parse(localStorage.getItem("productReviews") || "{}");
    const productReviews = allReviews[productId] || [];
    setReviews(productReviews);
  };

  // Handle Review Submit
  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      rating,
      comment: reviewText,
      date: new Date().toLocaleString(),
    };

    const allReviews = JSON.parse(localStorage.getItem("productReviews") || "{}");

    const productReviews = allReviews[product._id] || [];
    const updatedReviews = [...productReviews, newReview];
    allReviews[product._id] = updatedReviews;

    localStorage.setItem("productReviews", JSON.stringify(allReviews));

    setReviews(updatedReviews);
    setReviewText("");
    setRating(0);

    toast.success("Review added!");
  };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            style={{ marginTop: "90px" }}
            alt={product.name}
            height="320"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <h6>Size : {product.size}</h6>
          <h6>Color : {product.color}</h6>
          <h6>Pattern : {product.pattern}</h6>
          <h6>Brand : {product.brand}</h6>
          <button className="btn btn-dark ms-1" onClick={() => HandleAddToCart(product)}>
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mt-4">
        <hr />
        <h4>Customer Reviews</h4>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="mb-3 border-bottom pb-2">
              <div>⭐ {review.rating} / 5</div>
              <div>{review.comment}</div>
              <small className="text-muted">{review.date}</small>
            </div>
          ))
        )}

        <hr />
        <h5>Write a Review</h5>
        <form onSubmit={handleReviewSubmit}>
          <div className="mb-2">
            <label>Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="form-select"
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label>Comment:</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="form-control"
              rows="3"
              required
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Submit Review
          </button>
        </form>
      </div>

      {/* Similar Products */}
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;

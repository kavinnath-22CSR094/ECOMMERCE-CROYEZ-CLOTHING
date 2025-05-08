import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import "../styles/Homepage.css";
import { useAuth } from "../context/auth"; 

const SIZES = {
  shirts: ["S", "M", "L", "XL"],
  pants: ["28", "30", "32", "34", "36"],
  tshirts: ["S", "M", "L", "XL","XXL","XXXL"],
  shorts: ["S", "M", "L", "XL","XXL","XXXL"],
  tracks: ["S", "M", "L", "XL","XXL","XXXL"],
};

const COLOR = {
  shirts: ["Red", "Blue", "Green", "Black", "White",],
  pants: ["Blue", "Black", "Brown", "Grey", "White","Sandal"],
  tshirts: ["Red", "Blue", "Green", "Black", "White","Yellow","Pink"],
  shorts: ["Black", "Blue", "Brown", "Grey", "White","Green"],
  tracks: ["Black", "Blue", "Brown", "Grey", "White","Green"],
};

const PATTERN = {
  shirts: ["Striped", "Solid", "Checked", "Printed","Denim"],
  pants: ["Solid", "Checked", "Printed","Joger","Jeans"],
  tshirts: ["Round neck", "V neck", "Hooded", "Collared","Jersey"],
  shorts: ["Cotton","Nylon","Denim"],
  tracks: ["Cotton","Sports"],
};

const BRAND = {
  shirts: ["Black letter","Logoff","SO-ME","Krimty","Zara","Wild Studio"],
  pants: ["Black letter","Duster Blue","Wood Machine","Boulter"],
  tshirts: ["Technosports","Blk Bull","You Turn","Thanabat","Pointer"],
  shorts: ["Technosports","ASICS","Boulter","Newzy"],
  tracks: ["Technosports","Lookkint"],
};

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]); // Selected category (only one)
  const [sizes, setSizes] = useState([]); // Selected sizes
  const [colors, setColors] = useState([]); // Selected colors
  const [patterns, setPatterns] = useState([]); // Selected patterns
  const [radio, setRadio] = useState([]); // Selected price range
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("shirts"); // Default to shirts
  const [auth,setAuth] = useAuth();
  const[brands,setBrands] = useState([]);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Get all products (initial load)
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Get total count of products
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Handle category filter (updated for radio buttons)
  const handleFilter = (e, id, name) => {
    e.preventDefault();
    setChecked([id]); // Only one category can be selected at a time

    // Determine if the selected category is shirts or pants
    if (name.toLowerCase().includes("tshirt")) {
      setData("tshirts");
    } else if (name.toLowerCase().includes("pant")) {
      setData("pants");
    } else if (name.toLowerCase().includes("shirt")) {
      setData("shirts");
    } else if (name.toLowerCase().includes("short")) {
      setData("shorts");
    } else if (name.toLowerCase().includes("track")) {
      setData("tracks");
    }
  };

  // Handle size filter
  const handleSizeFilter = (e, size) => {
    e.preventDefault();
    let updatedSizes = [...sizes];
    if (e.target.checked) {
      updatedSizes.push(size);
    } else {
      updatedSizes = updatedSizes.filter((s) => s !== size);
    }
    setSizes(updatedSizes);
  };

  // Handle color filter
  const handleColorFilter = (e, color) => {
    e.preventDefault();
    let updatedColors = [...colors];
    if (e.target.checked) {
      updatedColors.push(color);
    } else {
      updatedColors = updatedColors.filter((c) => c === color);
    }
    setColors(updatedColors);
  };

  // Handle pattern filter
  const handlePatternFilter = (e, pattern) => {
    e.preventDefault();
    let updatedPatterns = [...patterns];
    if (e.target.checked) {
      updatedPatterns.push(pattern);
    } else {
      updatedPatterns = updatedPatterns.filter((p) => p !== pattern);
    }
    setPatterns(updatedPatterns);
  };

  // Handle brand filter
  const handleBrandFilter = (e, brand) => {
    e.preventDefault();
    let updatedBrands = [...brands];
    if (e.target.checked) {
      updatedBrands.push(brand);
    } else {
      updatedBrands = updatedBrands.filter((b) => b !== brand);
    }
    setBrands(updatedBrands);
  };

  // Handle price filter
  const handlePriceFilter = (e) => {
    e.preventDefault();
    setRadio(e.target.value);
  };

  // Call API when filters change
  useEffect(() => {
    if (checked.length === 0 && sizes.length === 0 && colors.length === 0 && patterns.length === 0 && brands.length === 0 && radio.length === 0) {
      getAllProducts();
    } else {
      filterProduct();
    }
  }, [checked, sizes, colors, patterns, brands, radio]);

  // Get filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, {
        checked,
        sizes,
        colors,
        patterns,
        brands,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log("Error filtering products:", error);
    }
  };  

  // In your HomePage.js or wherever you're adding to cart
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


  return (
    <Layout title={"All Products - Best offers"}>
      {/* Banner Image */}
      <img
        src="/images/croyez.jpg"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
        height={"300px"}
      />

      <div className="container-fluid row mt-3 home-page">
        {/* Sidebar Filters */}
        <div className="col-md-3 filters">
          {/* Category Filter */}
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            <Radio.Group value={checked[0]} onChange={(e) => {
              const selectedCategory = categories.find((c) => c._id === e.target.value);
              handleFilter(e, e.target.value, selectedCategory?.name);
            }}>
              {categories?.map((c) => (
                <Radio key={c._id} value={c._id}>
                  {c.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>

          {/* Size Filter */}
          <h4 className="text-center mt-4">Filter By Size</h4>
          <div className="d-flex flex-column">
            {SIZES[data]?.map((size) => (
              <Checkbox
                key={size}
                onChange={(e) => handleSizeFilter(e, size)}
                checked={sizes.includes(size)}
              >
                {size}
              </Checkbox>
            ))}
          </div>

          {/* Color Filter */}
          <h4 className="text-center mt-4">Filter By Color</h4>
          <div className="d-flex flex-column">
            {COLOR[data].map((color) => (
              <Checkbox
                key={color}
                onChange={(e) => handleColorFilter(e, color)}
                checked={colors.includes(color)}
              >
                {color}
              </Checkbox>
            ))}
          </div>

          {/* Pattern Filter */}
          <h4 className="text-center mt-4">Filter By Pattern</h4>
          <div className="d-flex flex-column">
            {PATTERN[data].map((pattern) => (
              <Checkbox
                key={pattern}
                onChange={(e) => handlePatternFilter(e, pattern)}
                checked={patterns.includes(pattern)}
              >
                {pattern}
              </Checkbox>
            ))}
          </div>

          {/* Brand Filter */}
          <h4 className="text-center mt-4">Filter By Brand</h4>
          <div className="d-flex flex-column">
            {BRAND[data].map((brand) => (
              <Checkbox
                key={brand}
                onChange={(e) => handleBrandFilter(e, brand)}
                checked={brands.includes(brand)}
              >
                {brand}
              </Checkbox>
            ))}
          </div>

          {/* Price Filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={handlePriceFilter}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          {/* Reset Filters Button */}
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => {
                setChecked([]);
                setSizes([]);
                setColors([]);
                setPatterns([]);
                setBrands([]);
                setRadio([]);
                getAllProducts();
              }}
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
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
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
        className="btn btn-dark ms-1"
        onClick={() => HandleAddToCart(p)}
      >
        ADD TO CART
      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

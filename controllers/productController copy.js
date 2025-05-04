import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, size, color, pattern, brand } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case !size:
        return res.status(500).send({ error: "Size is Required" });
      case !color:
        return res.status(500).send({ error: "Color is Required" });
      case !pattern:
        return res.status(500).send({ error: "Pattern is Required" });
      case !brand:
        return res.status(500).send({ error: "Brand is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo is Required and should be less than 1MB" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log("Error in createProductController:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};


//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, size, color, pattern, brand } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case !size:
        return res.status(500).send({ error: "Size is Required" });
      case !color:
        return res.status(500).send({ error: "Color is Required" });
      case !pattern:
        return res.status(500).send({ error: "Pattern is Required" });
      case !brand:
        return res.status(500).send({ error: "Brand is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo is Required and should be less than 1MB" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked = [], sizes = [], colors = [], patterns = [], brands = [], radio = [] } = req.body;
    let filterConditions = {};

    if (checked.length > 0) {
      filterConditions.category = { $in: checked };
    }
    if (sizes.length > 0) {
      filterConditions.size = { $in: sizes };
    }
    if (colors.length > 0) {
      filterConditions.color = { $in: colors };
    }
    if (s.length > 0) {
      filterConditions.pattern = { $in: patterns };
    }
    if (brands.length > 0) {
      filterConditions.brand = { $in: brands };
    }
    if (radio.length === 2) {
      filterConditions.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(filterConditions).select("-photo");
    res.status(200).json({
      success: true,
      message: "Filtered products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error while filtering products:", error);
    res.status(400).json({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};
// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Handle payments
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;

    console.log("Received cart:", cart);
     // Fetch product prices from the database
const productIds = cart.map((item) => item.product);
const products = await productModel.find({ _id: { $in: productIds } });

// Map product prices to the cart
const cartWithPrices = cart.map((item) => {
  const product = products.find((p) => p._id.toString() === item.product);
  if (!product) {
    throw new Error(`Product with ID ${item.product} not found`);
  }
  return { ...item, price: product.price };
});

console.log("Cart with prices:", cartWithPrices);

cartWithPrices.forEach((item) => {
  if (typeof item.price !== "number" || typeof item.quantity !== "number") {
    throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
  }
});
 
     // Calculate amount from cart
     const calculateTotal = (cart) => {
       return cart.reduce((total, item) => total + item.price * item.quantity, 0);
     };
     const amount = calculateTotal(cartWithPrices);
     console.log("Calculated amount:", amount);

    // Validate nonce
    if (!nonce || typeof nonce !== "string" || !nonce.startsWith("tokencc_")) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment token format",
        expectedFormat: "Should start with 'tokencc_'",
      });
    }

   
    // Validate amount
    if (isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Amount is not a valid number",
        receivedValue: amount,
      });
    }
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
        receivedValue: amount,
      });
    }

    // Process payment
    const result = await gateway.transaction.sale({
      amount: amount.toFixed(2),
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || "Payment processing failed",
        processorResponse: result.processorResponseText,
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      transaction: result.transaction,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during payment processing",
      error: error.message,
    });
  }
};
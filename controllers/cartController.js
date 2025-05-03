import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export const getCartController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate("cart.product");
    res.status(200).send({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).send({
      success: false,
      message: "Error getting cart",
      error,
    });
  }
};



export const updateCartController = async (req, res) => {
    try {
      const { cart } = req.body;
      
      // Validate and transform cart items
      const validCart = await Promise.all(
        cart.map(async (item) => {
          // Ensure product exists
          const product = await productModel.findById(item.product?._id || item.product);
          if (!product) return null;
          
          return {
            product: product._id, // Store just the ObjectId
            quantity: Math.max(1, item.quantity || 1)
          };
        })
      ).then(items => items.filter(Boolean));
  
      // Update user with the validated cart
      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $set: { cart: validCart } }, // Use $set to ensure proper update
        { new: true }
      ).populate("cart.product");
  
      res.status(200).send({
        success: true,
        message: "Cart updated successfully",
        cart: user.cart
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).send({
        success: false,
        message: "Error updating cart",
        error: error.message
      });
    }
  };

export const mergeCartController = async (req, res) => {
  try {
    const { guestCart } = req.body;
    const user = await userModel.findById(req.user._id).populate("cart.product");

    // Merge carts and remove duplicates
    const mergedCart = [...user.cart];
    for (const guestItem of guestCart) {
      const existingIndex = mergedCart.findIndex(
        item => item.product._id.toString() === guestItem._id
      );
      
      if (existingIndex >= 0) {
        mergedCart[existingIndex].quantity += 1;
      } else {
        const product = await productModel.findById(guestItem._id);
        if (product) {
          mergedCart.push({
            product: guestItem._id,
            quantity: 1,
          });
        }
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { cart: mergedCart },
      { new: true }
    ).populate("cart.product");

    res.status(200).send({
      success: true,
      message: "Cart merged successfully",
      cart: updatedUser.cart,
    });
  } catch (error) {
    console.error("Error merging carts:", error);
    res.status(500).send({
      success: false,
      message: "Error merging carts",
      error,
    });
  }
};
export const addToCartController = async (req, res) => {
  try {
    console.log("Incoming cart add request:", req.body); // Log incoming data
    
    const { product, quantity = 1 } = req.body;
    const user = await userModel.findById(req.user._id);
    console.log("Found user:", user._id); // Verify user exists

    const productExists = await productModel.findById(product);
    if (!productExists) {
      console.log("Product not found:", product);
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    // Cart update logic
    const existingIndex = user.cart.findIndex(
      item => item.product.toString() === product
    );

    if (existingIndex >= 0) {
      user.cart[existingIndex].quantity += quantity;
      console.log("Updated existing cart item");
    } else {
      user.cart.push({ product, quantity });
      console.log("Added new cart item");
    }

    const savedUser = await user.save();
    console.log("Saved user document:", savedUser); // Verify save operation

    const populatedUser = await userModel.findById(user._id)
      .populate("cart.product");
    
    res.status(200).send({
      success: true,
      message: `${productExists.name} added to cart`,
      cart: populatedUser.cart
    });
  } catch (error) {
    console.error("Database save error:", error);
    res.status(500).send({
      success: false,
      message: "Error saving to database",
      error: error.message
    });
  }
};
  
  // Remove item from cart
  export const removeFromCartController = async (req, res) => {
    try {
      const { productId } = req.params;
      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { cart: { product: productId } }},
        { new: true }
      ).populate("cart.product");
  
      res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart: user.cart
      });
    } catch (error) {
      console.error("Remove error:", error);
      res.status(500).json({
        success: false,
        message: "Error removing item",
        error: error.message
      });
    }
  };
  
  // Clear entire cart
  export const clearCartController = async (req, res) => {
    try {
      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $set: { cart: [] } },
        { new: true }
      );
  
      res.status(200).send({
        success: true,
        message: "Cart cleared successfully",
        cart: user.cart
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).send({
        success: false,
        message: "Error clearing cart",
        error: error.message
      });
    }
  };
  
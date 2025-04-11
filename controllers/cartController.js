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
      const { product, quantity = 1 } = req.body;
      const user = await userModel.findById(req.user._id);
  
      // Check if product exists
      const productExists = await productModel.findById(product);
      if (!productExists) {
        return res.status(404).send({
          success: false,
          message: "Product not found"
        });
      }
  
      // Check if product already in cart
      const existingItemIndex = user.cart.findIndex(
        item => item.product.toString() === product
      );
  
      if (existingItemIndex >= 0) {
        // Update quantity if already exists
        user.cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        user.cart.push({ product, quantity });
      }
  
      await user.save();
      const populatedUser = await user.populate("cart.product");
  
      res.status(200).send({
        success: true,
        message: "Item added to cart",
        cart: populatedUser.cart
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).send({
        success: false,
        message: "Error adding to cart",
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
        { $pull: { cart: { product: productId } } },
        { new: true }
      ).populate("cart.product");
  
      res.status(200).send({
        success: true,
        message: "Item removed from cart",
        cart: user.cart
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).send({
        success: false,
        message: "Error removing from cart",
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
  
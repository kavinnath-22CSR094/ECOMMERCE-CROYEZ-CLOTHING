import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { 
  getCartController,
  updateCartController,
  mergeCartController,
  addToCartController,
  removeFromCartController,
  clearCartController
} from "../controllers/cartController.js";


const router = express.Router();

// GET cart - Get user's cart
router.get("/cart", requireSignIn, getCartController);

// POST cart - Update entire cart (replace)
router.post("/cart", 
  requireSignIn,
  updateCartController
);

// POST cart/add - Add single item to cart
router.post("/cart/add", 
  requireSignIn,
  addToCartController
);

// DELETE cart/remove/:productId - Remove item from cart
router.delete("/cart/remove/:productId", 
  requireSignIn,
  removeFromCartController
);

// POST cart/merge - Merge guest cart with user cart
router.post("/cart/merge", 
  requireSignIn,
  mergeCartController
);

// DELETE cart/clear - Clear entire cart
router.delete("/cart/clear", 
  requireSignIn,
  clearCartController
);

// In userRoutes.js
router.get("/debug-cart/:userId", requireSignIn, async (req, res) => {
  try {
    // Verify the requesting user matches the debug user
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const user = await userModel.findById(req.params.userId)
      .populate("cart.product", "name price") // Only get needed fields
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      userId: user._id,
      cartCount: user.cart.length,
      cartItems: user.cart
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
});

export default router;
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
import { validateCartItem } from "../validators/cartValidator.js";

const router = express.Router();

// GET cart - Get user's cart
router.get("/cart", requireSignIn, getCartController);

// POST cart - Update entire cart (replace)
router.post("/cart", 
  requireSignIn,
  validateCartItem,
  updateCartController
);

// POST cart/add - Add single item to cart
router.post("/cart/add", 
  requireSignIn,
  validateCartItem,
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

export default router;
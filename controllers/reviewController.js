import Product from "../models/product.model.js";
import Review from "../models/reviewModel.js";
import User from "../models/user.model.js";
//add review & rating


export const addReview = async (request, response) => {
  try {
    const { productId, rating, comment } = request.body;
    const userId = request.userId; // set by auth middleware

    if (!productId || !rating || !comment?.trim()) {
      return response.status(400).json({
        message: "Product, rating, and comment are required",
        error: true,
        success: false,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    const user = await User.findById(userId); // ✅ FIX: no { userId }
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // prevent double review
    const already = await Review.findOne({ user: userId, product: productId });
    if (already) {
      return response.status(400).json({
        message: "You already reviewed this product",
        error: true,
        success: false,
      });
    }

    // create review
    const review = await Review.create({
      user: userId,
      product: productId,
      name: user.name || "Anonymous",
      rating: Number(rating), // ensure number
      comment: comment.trim(),
    });

    // recalc product stats
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const avgRating = reviews.length ? totalRating / reviews.length : 0;

    product.averageRating = avgRating;
    product.totalReviews = reviews.length;
    await product.save();

    return response.status(200).json({
      message: "Review added successfully",
      data: review,
      success: true,
    });
  } catch (error) {
    console.error("addReview error:", error);
    return response.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false,
    }); // ✅ FIX: use `response`, not `res`
  }
};

export const getReviews = async (request, response) => {
  try {
    const { productId } = request.params;

    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .lean();

    const total = reviews.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const rt = Number(r.rating || 0);
      if (rt >= 1 && rt <= 5) distribution[rt] += 1;
      sum += rt;
    });

    const average = total ? sum / total : 0;

    return response.status(200).json({
      reviews,
      total,
      average,
      distribution,
      success: true,
    });
  } catch (error) {
    console.error("getReviews error:", error);
    return response.status(500).json({
      message: "Failed to fetch reviews",
      error: true,
      success: false,
    });
  }
};


//Update Review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ 
        message: "Review not found", 
        success: false });
    }

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Not authorized", 
        success: false });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Recalculate product rating
    const reviews = await Review.find({ product: review.product });
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(review.product, {
      averageRating: avgRating,
      totalReviews: reviews.length,
    });

    res.status(200).json({
      message: "Review updated successfully",
      data: review,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message, success: false });
  }
};

// Delete Review (User or Admin)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;
    const isAdmin = req.isAdmin; // Assuming your auth middleware sets this

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found", success: false });
    }

    if (!isAdmin && review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    await Review.findByIdAndDelete(reviewId);

    // Recalculate product rating
    const reviews = await Review.find({ product: review.product });
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = reviews.length ? totalRating / reviews.length : 0;

    await Product.findByIdAndUpdate(review.product, {
      averageRating: avgRating,
      totalReviews: reviews.length,
    });

    res.status(200).json({ message: "Review deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message, success: false });
  }
};
//get all reviews for admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data:reviews,
      
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all reviews",
      error: error.message,
    });
  }
};
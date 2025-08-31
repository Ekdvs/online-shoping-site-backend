import Product from "../models/product.model.js";
import Review from "../models/reviewModel.js";


//add review & rating
export const addReview=async(request,response)=>{
    try {

        //get details
        const{productId,rating,comment}=request.body;
        //get user id
        const userId=request.userId;

    if(!productId||!rating||!comment){
        return response.status(404).json({
            message:'Product, rating, and comment are required',
            error:true,
            sucess:false,
        })

    }

    //check product exist
    const product =await Product.findById(productId);
    if(!product){
        return response.status(404).json({
            message:'Product not found',
            error:true,
            sucess:false,
        })
    }

    //check user
    const user=await User.findById({userId});
    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({ user: userId, product: productId });
    if (alreadyReviewed) {
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
      rating,
      comment,
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    product.averageRating = avgRating;
    product.totalReviews = reviews.length;
    await product.save();

    return response.status(200).json({
        message: "Review added successfully",
        data: review,
        success: true,
    })

        
    } 
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }
}

//get all reviews for a products

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("User", "name") // Optional: show user details
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Reviews fetched successfully",
      data: reviews,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
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
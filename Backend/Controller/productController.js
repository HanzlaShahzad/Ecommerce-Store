import mongoose from "mongoose";
import Products from "../Models/productsSchema.js";
import uploadToCloudinary from "../Cloudinary/cloudinaryUploads.js";
import { normalizeMongoId } from "../Utils/mongoId.js";

//Create Products
export const ProductController = async (req, res) => {
  try {
    const { name, discount, quantity, price, description } = req.body;
    let image;
    if (req.file) {
      const upload = await uploadToCloudinary(req.file.buffer);
      image = upload.secure_url;
    }
    const product = await Products.create({
      name,
      discount,
      quantity,
      price,
      image,
      description,
      user: req.user?._id,
    });
    console.log("Product =>", product);
    return res.status(200).json({ product });
  } catch (error) {
    console.log("Product Creation Error =>", error);
    return res.status(500).json({ error });
  };
};

//Get Products
export const GetProducts = async (req, res) => {
  try {
    const products = await Products.find();
    return res.status(200).json({ products: products });
  } catch (error) {
    console.log("Get Product Error =>", error);
    return res.status(500).json({ error });
  }
};
export const UpdateProduct = async (req, res) => {
  try {
    const id = normalizeMongoId(req.body.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const updateData = {
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      quantity: req.body.quantity,
      description: req.body.description,
      status: req.body.status,
    };

    if (req.file) {
      const upload = await uploadToCloudinary(req.file.buffer);
      updateData.image = upload.secure_url;
    }
    const updatedProduct = await Products.findByIdAndUpdate(id, updateData, {
      new: true,
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("Update Product Error =>", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const deletedProduct = async (req, res) => {
  try {
    const id = normalizeMongoId(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const deleted = await Products.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true, runValidators: true },
    );
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ deleted, msg: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error, msg: "Deleted false" })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      id: product._id,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error =>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

export const inActiveProduct = async (req, res) => {
  try {
    const id = normalizeMongoId(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.status = product.status === "Inactive" ? "Active" : "Inactive";
    await product.save();
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
import mongoose from "mongoose";
import Products from "../Models/productsSchema.js";

//Create Products
export const ProductController = async (req, res) => {
  try {
    const { name, discount, quantity, price, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const product = await Products.create({
      name,
      discount,
      quantity,
      price,
      image,
      description,
      user: req.users?._id,
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
    const { id } = req.body;

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
    };

    if (req.file) {
      updateData.image = req.file.filename;
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
    const id = req.params.id;
    const deleted = await Products.findByIdAndUpdate(id,
      {
        deleted: true,
      },
      { returnDocument: "after" },
      {
        new: true
      }
    );
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
    const id = req.params.id;
    const inActive = await Products.findByIdAndUpdate(id,
      {
        status: "InActive",
      },
      { returnDocument: "after" },
      {
        new: true
      }
    );
    return res.status(200).json({ inActive, msg: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error, msg: "inActiveProduct false" })
  }
}
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createProductThunk } from "../Thunks/productThunk";

export default function CreateProducts() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [discount, setDiscount] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);
  // Calculate final price after discount
  const discountPrice =
    price && discount
      ? Number(price) - (Number(price) * Number(discount)) / 100
      : Number(price) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        createProductThunk({
          name,
          file,
          discount,
          price,
          discountPrice,
          quantity,
          description,
        }),
      ).unwrap();

      setName("");
      setFile(null);
      setDiscount("");
      setPrice("");
      setQuantity("");
      setDescription("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Product creation failed:", error);
    }
  };

  return (
    <div className="max-w-lg max-h-[50%]  px-4 py-5 lg:ms-110">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white py-4 px-8 shadow-lg">
        <h1 className="mb-1 text-3xl font-bold text-gray-800">Add Product</h1>

        <form className="space-y-2" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Product Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-300 px-4 py-1 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Original Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Price
              </label>

              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full rounded-lg border border-gray-300 px-4 py-1 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Discount (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g. 10"
                className="w-full rounded-lg border border-gray-300 px-4 py-1 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Discount Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Discount Price
              </label>

              <input
                type="number"
                value={discountPrice}
                readOnly
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-1 font-semibold text-green-600 outline-none"
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Quantity
            </label>

            <input
              type="number"
              min="0"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full rounded-lg border border-gray-300 px-4 py-1 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Product Image
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-4 py-1 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-indigo-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              rows="2"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-1 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-1 font-semibold text-white transition hover:bg-indigo-700"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

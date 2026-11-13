import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Search,
  Settings,
  X,
  Tag,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Package,
} from "lucide-react";

import {
  deleteProductThunk,
  getProductThunk,
  updateProductThunk,
} from "../Thunks/productThunk";
import { Link } from "react-router-dom";

export default function Products() {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.getProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [loadingId, setLoadingId] = useState(null);
  const [actionType, setActionType] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    discount: "",
    status: "Active",
    image: null,
  });

  useEffect(() => {
    dispatch(getProductThunk());
  }, [dispatch]);

  const products = useMemo(() => {
    if (!Array.isArray(data)) return [];

    // Remove soft-deleted products
    const nonDeletedProducts = data.filter(
      (product) => product?.deleted !== true && product?.deleted !== "true",
    );

    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return nonDeletedProducts;
    }

    return nonDeletedProducts.filter((product) =>
      product?.name?.toLowerCase().includes(searchValue),
    );
  }, [data, search]);

  // --------------------------------------------------
  // DISCOUNT PRICE
  // --------------------------------------------------

  const getDiscountedPrice = (price, discount) => {
    const productPrice = Number(price) || 0;
    const productDiscount = Number(discount) || 0;

    const discounted = productPrice - (productPrice * productDiscount) / 100;

    return discounted.toFixed(0);
  };

  // --------------------------------------------------
  // IMAGE URL
  // --------------------------------------------------

  const getImageUrl = (image) => {
    if (!image) {
      return "/placeholder-product.png";
    }

    return `http://localhost:2000/uploads/${image}`;
  };

  // --------------------------------------------------
  // OPEN EDIT MODAL
  // --------------------------------------------------

  const handleOpenEdit = (product) => {
    setEditingProduct(product);

    setEditForm({
      name: product?.name || "",
      price: product?.price ?? "",
      description: product?.description || "",
      quantity: product?.quantity ?? "",
      discount: product?.discount ?? "",
      status: product?.status || "Active",
      image: null,
    });

    setIsEditModalOpen(true);
  };

  // --------------------------------------------------
  // CLOSE EDIT MODAL
  // --------------------------------------------------

  const handleCloseEdit = () => {
    if (actionType === "update") return;

    setIsEditModalOpen(false);
    setEditingProduct(null);

    setEditForm({
      name: "",
      price: "",
      description: "",
      quantity: "",
      discount: "",
      status: "Active",
      image: null,
    });
  };

  // --------------------------------------------------
  // EDIT INPUT
  // --------------------------------------------------

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setEditForm((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }));

      return;
    }

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // UPDATE PRODUCT
  // --------------------------------------------------

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!editingProduct?._id) return;

    const name = editForm.name.trim();
    const price = Number(editForm.price);
    const quantity = Number(editForm.quantity);
    const discount = Number(editForm.discount);

    if (!name) {
      alert("Product name is required.");
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (Number.isNaN(quantity) || quantity < 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (Number.isNaN(discount) || discount < 0 || discount > 100) {
      alert("Discount must be between 0 and 100.");
      return;
    }

    try {
      setActionType("update");
      setLoadingId(editingProduct._id);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", editForm.description.trim());
      formData.append("quantity", quantity);
      formData.append("discount", discount);
      formData.append("status", editForm.status);

      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      await dispatch(
        updateProductThunk({
          id: editingProduct._id,
          formData,
        }),
      ).unwrap();

      // Refresh Redux products
      await dispatch(getProductThunk());

      alert("Product updated successfully.");

      handleCloseEdit();
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      alert(
        error?.message ||
          error?.response?.data?.message ||
          "Failed to update product.",
      );
    } finally {
      setLoadingId(null);
      setActionType("");
    }
  };

  // --------------------------------------------------
  // DELETE PRODUCT
  // --------------------------------------------------

  const handleDeleteProduct = async (product) => {
    if (!product?._id) return;

    try {
      setLoadingId(product._id);
      setActionType("delete");

      await dispatch(deleteProductThunk(product._id)).unwrap();

      alert("Product deleted successfully.");
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      alert(
        error?.message ||
          error?.response?.data?.message ||
          error ||
          "Failed to delete product.",
      );
    } finally {
      setLoadingId(null);
      setActionType("");
    }
  };

  // --------------------------------------------------
  // ENABLE / DISABLE PRODUCT
  // --------------------------------------------------

  const handleToggleStatus = async (id) => {
    if (!id) return;

    try {
      setLoadingId(id);
      setActionType("status");

      await axios.patch(`http://localhost:2000/inActive/${id}`);

      // Refresh Redux
      await dispatch(getProductThunk());
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);

      alert(
        error?.response?.data?.message || "Failed to update product status.",
      );
    } finally {
      setLoadingId(null);
      setActionType("");
    }
  };

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product?.status === "Active",
  ).length;

  const disabledProducts = products.filter(
    (product) => product?.status === "Inactive",
  ).length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-[250px]">
      <main className="w-full min-w-0 p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="mx-auto w-full max-w-7xl">
          {/* =========================================
            HEADER
        ========================================== */}

          <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-gray-900 p-2 text-white">
                    <Package size={20} />
                  </div>

                  <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Products
                  </h1>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your products, inventory and availability.
                </p>
              </div>

              {/* SEARCH */}

              <div className="px-8 lg:max-w-sm">
                <Link
                  to="/createProducts"
                  className="bg-cyan-500 rounded-xl text-center flex justify-center items-center px-6 py-2 text-white"
                >
                  Add Product
                </Link>
              </div>
            </div>

            {/* =========================================
              STATS
          ========================================== */}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Total Products
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {totalProducts}
                    </p>
                  </div>

                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <Tag size={19} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Active</p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {activeProducts}
                    </p>
                  </div>

                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <CheckCircle size={19} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Disabled
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {disabledProducts}
                    </p>
                  </div>

                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <Ban size={19} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
            DESKTOP TABLE
        ========================================== */}

          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.length > 0 ? (
                    products.map((product) => {
                      const isDisabled = product?.status === "Inactive";

                      const isLoading = loadingId === product?._id;

                      const discountedPrice = getDiscountedPrice(
                        product?.price,
                        product?.discount,
                      );

                      return (
                        <tr
                          key={product?._id}
                          className="transition hover:bg-gray-50"
                        >
                          {/* PRODUCT */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={getImageUrl(product?.image)}
                                alt={product?.name || "Product"}
                                className="h-14 w-14 rounded-xl border border-gray-100 object-cover"
                              />

                              <div className="min-w-0">
                                <p className="max-w-[260px] truncate font-semibold text-gray-900">
                                  {product?.name}
                                </p>

                                {Number(product?.discount) > 0 && (
                                  <p className="mt-1 text-xs font-medium text-gray-500">
                                    {product.discount}% discount
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* PRICE */}

                          <td className="px-5 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">
                                Rs. {discountedPrice}
                              </p>

                              {Number(product?.discount) > 0 && (
                                <p className="text-xs text-gray-400 line-through">
                                  Rs. {Number(product?.price || 0).toFixed(0)}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* QUANTITY */}

                          <td className="px-5 py-4">
                            <span
                              className={`font-medium ${
                                Number(product?.quantity) === 0
                                  ? "text-gray-400"
                                  : "text-gray-700"
                              }`}
                            >
                              {product?.quantity ?? 0}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                isDisabled
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              {isDisabled ? (
                                <Ban size={13} />
                              ) : (
                                <CheckCircle size={13} />
                              )}

                              {isDisabled ? "Disabled" : "Active"}
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              {/* EDIT */}

                              <button
                                type="button"
                                disabled={Boolean(loadingId)}
                                onClick={() => handleOpenEdit(product)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Edit product"
                              >
                                <Edit size={17} />
                              </button>

                              {/* ENABLE / DISABLE */}

                              <button
                                type="button"
                                disabled={Boolean(loadingId)}
                                onClick={() => handleToggleStatus(product?._id)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                                title={
                                  isDisabled
                                    ? "Enable product"
                                    : "Disable product"
                                }
                              >
                                {isLoading && actionType === "status" ? (
                                  <span className="block h-[17px] w-[17px] animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                                ) : isDisabled ? (
                                  <CheckCircle size={17} />
                                ) : (
                                  <Ban size={17} />
                                )}
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                disabled={Boolean(loadingId)}
                                onClick={() => handleDeleteProduct(product)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete product"
                              >
                                {isLoading && actionType === "delete" ? (
                                  <span className="block h-[17px] w-[17px] animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                                ) : (
                                  <Trash2 size={17} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-3 rounded-full bg-gray-100 p-4">
                            <Package size={25} className="text-gray-400" />
                          </div>

                          <p className="font-semibold text-gray-700">
                            No products found
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            {search
                              ? "Try another search."
                              : "Your products will appear here."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* =========================================
            MOBILE CARDS
        ========================================== */}

          <div className="space-y-3 md:hidden">
            {products.length > 0 ? (
              products.map((product) => {
                const isDisabled = product?.status === "Inactive";

                const isLoading = loadingId === product?._id;

                const discountedPrice = getDiscountedPrice(
                  product?.price,
                  product?.discount,
                );

                return (
                  <div
                    key={product?._id}
                    className="rounded-2xl bg-white p-4 shadow-sm"
                  >
                    {/* TOP */}

                    <div className="flex gap-3">
                      <img
                        src={getImageUrl(product?.image)}
                        alt={product?.name || "Product"}
                        className="h-16 w-16 shrink-0 rounded-xl border border-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate font-semibold text-gray-900">
                            {product?.name}
                          </h3>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              isDisabled
                                ? "bg-gray-100 text-gray-600"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {isDisabled ? "Disabled" : "Active"}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            Rs. {discountedPrice}
                          </span>

                          {Number(product?.discount) > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              Rs. {Number(product?.price || 0).toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* INFO */}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-400">Quantity</p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {product?.quantity ?? 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-400">Discount</p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {product?.discount || 0}%
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        disabled={Boolean(loadingId)}
                        onClick={() => handleOpenEdit(product)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Edit size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={Boolean(loadingId)}
                        onClick={() => handleToggleStatus(product?._id)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading && actionType === "status" ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                        ) : isDisabled ? (
                          <>
                            <CheckCircle size={15} />
                            Enable
                          </>
                        ) : (
                          <>
                            <Ban size={15} />
                            Disable
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={Boolean(loadingId)}
                        onClick={() => handleDeleteProduct(product)}
                        aria-label={`Delete ${product?.name}`}
                        title="Delete product"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading && actionType === "delete" ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                        ) : (
                          <>
                            <Trash2 size={15} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl bg-white px-5 py-16 text-center shadow-sm">
                <div className="mx-auto mb-3 w-fit rounded-full bg-gray-100 p-4">
                  <Package size={25} className="text-gray-400" />
                </div>

                <p className="font-semibold text-gray-700">No products found</p>

                <p className="mt-1 text-sm text-gray-400">
                  {search
                    ? "Try another search."
                    : "Your products will appear here."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
          EDIT MODAL
      ========================================== */}

        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
            <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Edit Product
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Update product information
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={actionType === "update"}
                  className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FORM */}

              <form onSubmit={handleUpdateProduct} className="overflow-y-auto">
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                  {/* NAME */}

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      disabled={actionType === "update"}
                      className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-gray-400 disabled:bg-gray-100"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* PRICE */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      min="0"
                      value={editForm.price}
                      onChange={handleEditChange}
                      disabled={actionType === "update"}
                      className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-gray-400 disabled:bg-gray-100"
                      placeholder="0"
                    />
                  </div>

                  {/* QUANTITY */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Quantity
                    </label>

                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      value={editForm.quantity}
                      onChange={handleEditChange}
                      disabled={actionType === "update"}
                      className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-gray-400 disabled:bg-gray-100"
                      placeholder="0"
                    />
                  </div>

                  {/* DISCOUNT */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>

                    <input
                      type="number"
                      name="discount"
                      min="0"
                      max="100"
                      value={editForm.discount}
                      onChange={handleEditChange}
                      disabled={actionType === "update"}
                      className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-gray-400 disabled:bg-gray-100"
                      placeholder="0"
                    />
                  </div>

                  {/* STATUS */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      disabled={actionType === "update"}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-400 disabled:bg-gray-100"
                    >
                      <option value="Active">Active</option>

                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* IMAGE */}

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product Image
                    </label>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <img
                        src={getImageUrl(editingProduct?.image)}
                        alt={editingProduct?.name}
                        className="h-24 w-24 rounded-xl border border-gray-200 object-cover"
                      />

                      <div className="flex-1">
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleEditChange}
                          disabled={actionType === "update"}
                          className="block w-full rounded-xl border border-gray-200 p-2 text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-medium file:text-gray-700 disabled:opacity-50"
                        />

                        {editForm.image && (
                          <p className="mt-2 text-xs text-gray-500">
                            New image: {editForm.image.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      rows="4"
                      value={editForm.description}
                      onChange={handleEditChange}
                      disabled={actionType === "update"}
                      className="w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-gray-400 disabled:bg-gray-100"
                      placeholder="Enter product description"
                    />
                  </div>
                </div>

                {/* MODAL FOOTER */}

                <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-gray-100 bg-white p-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    disabled={actionType === "update"}
                    className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={actionType === "update"}
                    className="flex h-11 items-center justify-center rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionType === "update" ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                        Updating...
                      </>
                    ) : (
                      "Update Product"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

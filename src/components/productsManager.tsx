// src/components/ProductsManager.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ProductsManager.module.css";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

interface DiscountCode {
  _id?: string;
  code: string;
  discountPercentage: number;
  expiresAt: string;
  usageLimit?: number;
  timesUsed?: number;
  active: boolean;
}

export default function ProductsManager() {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "",
    stock: 0,
  });
  const [discountFormData, setDiscountFormData] = useState<DiscountCode>({
    code: "",
    discountPercentage: 0,
    expiresAt: "",
    usageLimit: undefined,
    active: true,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetchProducts();
    fetchDiscountCodes();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/product");
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchDiscountCodes = async () => {
    try {
      const response = await fetch("/api/discount-codes");
      const data = await response.json();
      if (Array.isArray(data)) {
        setDiscountCodes(data);
      }
    } catch (error) {
      console.error("Error fetching discount codes:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDiscountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscountFormData({ ...discountFormData, [name]: value });
  };

  const handleSaveProduct = async (e: React.FormEvent, action: string) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          action: action,
        }),
      });

      if (response.ok) {
        const updatedProducts = await response.json();
        if (Array.isArray(updatedProducts)) {
          setProducts(updatedProducts);
        } else {
          console.error("Unexpected response format after save:", updatedProducts);
        }

        setFormData({
          name: "",
          description: "",
          price: 0,
          imageUrl: "",
          category: "",
          stock: 0,
        });
      } else {
        console.error(`Failed to ${action} product`);
      }
    } catch (error) {
      console.error(`Error during ${action} operation:`, error);
    }
  };

  const handleSaveDiscountCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = discountFormData._id ? "PUT" : "POST";
      const response = await fetch("/api/discount-codes", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discountFormData),
      });

      if (response.ok) {
        const updatedDiscountCodes = await response.json();
        setDiscountCodes(updatedDiscountCodes);

        setDiscountFormData({
          code: "",
          discountPercentage: 0,
          expiresAt: "",
          usageLimit: undefined,
          active: true,
        });
      } else {
        console.error("Failed to save discount code");
      }
    } catch (error) {
      console.error("Error saving discount code:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setFormData(product);
  };

  const handleEditDiscountCode = (discountCode: DiscountCode) => {
    setDiscountFormData(discountCode);
  };

  const handleDeleteDiscountCode = async (_id: string) => {
    try {
      const response = await fetch("/api/discount-codes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });

      if (response.ok) {
        const updatedDiscountCodes = await response.json();
        setDiscountCodes(updatedDiscountCodes);
      } else {
        console.error("Failed to delete discount code");
      }
    } catch (error) {
      console.error("Error deleting discount code:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
    );
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Products Manager</h1>

      {/* Create or Update Product Form */}
      <form className={styles.form} onSubmit={(e) => handleSaveProduct(e, formData._id ? "update" : "create")}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">
            Product Name
          </label>
          <input
            className={styles.input}
            type="text"
            name="name"
            id="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">
            Product Description
          </label>
          <input
            className={styles.input}
            type="text"
            name="description"
            id="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="price">
            Price
          </label>
          <input
            className={styles.input}
            type="number"
            name="price"
            id="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="imageUrl">
            Image URL
          </label>
          <input
            className={styles.input}
            type="text"
            name="imageUrl"
            id="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="category">
            Category
          </label>
          <input
            className={styles.input}
            type="text"
            name="category"
            id="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="stock">
            Stock
          </label>
          <input
            className={styles.input}
            type="number"
            name="stock"
            id="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className={styles.button} type="submit">
          {formData._id ? "Update Product" : "Create Product"}
        </button>
      </form>

      {/* Create or Update Discount Code Form */}
      <form className={styles.form} onSubmit={handleSaveDiscountCode}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="code">
            Discount Code
          </label>
          <input
            className={styles.input}
            type="text"
            name="code"
            id="code"
            placeholder="Discount Code"
            value={discountFormData.code}
            onChange={handleDiscountInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="discountPercentage">
            Discount Percentage
          </label>
          <input
            className={styles.input}
            type="number"
            name="discountPercentage"
            id="discountPercentage"
            placeholder="Discount Percentage"
            value={discountFormData.discountPercentage}
            onChange={handleDiscountInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="expiresAt">
            Expires At
          </label>
          <input
            className={styles.input}
            type="date"
            name="expiresAt"
            id="expiresAt"
            placeholder="Expires At"
            value={discountFormData.expiresAt}
            onChange={handleDiscountInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="usageLimit">
            Usage Limit (Optional)
          </label>
          <input
            className={styles.input}
            type="number"
            name="usageLimit"
            id="usageLimit"
            placeholder="Usage Limit"
            value={discountFormData.usageLimit?.toString() || ""}
            onChange={handleDiscountInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="active">
            Active
          </label>
          <input
            className={styles.input}
            type="checkbox"
            name="active"
            id="active"
            checked={discountFormData.active}
            onChange={(e) => setDiscountFormData({ ...discountFormData, active: e.target.checked })}
          />
        </div>
        <button className={styles.button} type="submit">
          {discountFormData._id ? "Update Discount Code" : "Create Discount Code"}
        </button>
      </form>

      {/* Products List */}
      <div className={styles.filterContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
        />
        <select
          className={styles.select}
          value={selectedCategory}
          onChange={handleCategoryFilter}
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      <ul className={styles.productList}>
        {filteredProducts.map((product) => (
          <li className={styles.productItem} key={product._id}>
            <div className={styles.productDetails}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={150}
                height={150}
                className={styles.image}
              />
            </div>
            <div className={styles.productActions}>
              <button className={styles.editButton} onClick={() => handleEditProduct(product)}>
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Discount Codes List */}
      <h2>Discount Codes</h2>
      <ul className={styles.discountList}>
        {discountCodes.map((discountCode) => (
          <li className={styles.discountItem} key={discountCode._id}>
            <div className={styles.discountDetails}>
              <h3>{discountCode.code}</h3>
              <p>Discount: {discountCode.discountPercentage}%</p>
              <p>Expires At: {new Date(discountCode.expiresAt).toLocaleDateString()}</p>
              <p>Usage Limit: {discountCode.usageLimit || "Unlimited"}</p>
              <p>Times Used: {discountCode.timesUsed || 0}</p>
              <p>Status: {discountCode.active ? "Active" : "Inactive"}</p>
            </div>
            <div className={styles.discountActions}>
              <button className={styles.editButton} onClick={() => handleEditDiscountCode(discountCode)}>
                Edit
              </button>
              <button className={styles.deleteButton} onClick={() => handleDeleteDiscountCode(discountCode._id!)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

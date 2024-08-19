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

export default function ProductsManager() {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "",
    stock: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetchProducts();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleEditProduct = (product: Product) => {
    setFormData(product);
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

      {/* Search and Filter */}
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

      {/* Products List */}
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
    </div>
  );
}

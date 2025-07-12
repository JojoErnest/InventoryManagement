import React, { useEffect, useState } from "react";
import "../CSS/HomePage.css";

function HomePage({ user, onLogout }) {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const API = "http://localhost:5243";

  const fetchProducts = () => {
    fetch(`${API}/api/product`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => {
        console.error("Error fetching inventory:", err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (formDataToSend) => {
    try {
      const response = await fetch(`${API}/api/product`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Product added successfully");
        fetchProducts();
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  function AddProductModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      price: "",
      quantityInStock: "",
      category: "",
    });

    const [imageFile, setImageFile] = useState(null);

    const handleImageUpload = (e) => {
      setImageFile(e.target.files[0]);
    };

    const handleChange = (e) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleSubmit = () => {
      const createdBy = localStorage.getItem("username");
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formDataToSend.append(key, value)
      );
      formDataToSend.append("createdBy", createdBy);
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
     onAdd(formDataToSend)
    .then(() => {
        onClose(); 
    })
    .catch((err) => {
        console.error("Gagal add product:", err);
        alert("Gagal menambahkan produk.");
    });

    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content"onClick={(e) => e.stopPropagation()}>
          <h2>Add New Product</h2>
          <input className="modal-input" name="name" placeholder="Name" onChange={handleChange} />
          <input className="modal-input" name="description" placeholder="Description" onChange={handleChange} />
          <input className="modal-input" name="price" placeholder="Price" onChange={handleChange} />
          <input className="modal-input" name="quantityInStock" placeholder="Stock" onChange={handleChange} />
          <input className="modal-input" name="category" placeholder="Category" onChange={handleChange} />
          <input type="file" name="image" onChange={handleImageUpload} />

          <div className="modal-actions">
            <button className="add-btn" onClick={handleSubmit}>Add</button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <button className="logout-btn" onClick={onLogout}>Logout</button>

      <div className="welcome-message">Welcome, {user}!</div>

      <div className="product-grid">
        {items.map((item, idx) => (
          <div className="product-card" key={idx}>
            <img
              src={`${API}/${item.imagePath ? item.imagePath : "images/image.png"}`}
              alt={item.name}
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${API}/images/image.png`;
              }}
            />
            <h3>{item.name}</h3>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Stock:</strong> {item.quantityInStock}</p>
            <p><strong>Price:</strong> {item.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
          </div>
        ))}

       <div className="add-product-card" onClick={() => setShowModal(true)}>
        + Add Product
        </div>

        {showModal && (
        <AddProductModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddProduct}
        />
        )}

      </div>
    </div>
  );
}

export default HomePage;

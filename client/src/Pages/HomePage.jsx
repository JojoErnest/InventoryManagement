import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/HomePage.css";
import RegisterModal from "../components/RegisterModal";

function HomePage({ user, onLogout, onRegister }) {

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regRole, setRegRole] = useState(2); // default User


  const [items, setItems] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const navigate = useNavigate();
  const API = "http://localhost:5243";

  const handleHome = () => {
  navigate("/home"); 
};

// export default Homepage;
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

  const updateStock = async (productId, delta, updatedBy) => {
  try {
    await fetch(`${API}/api/product/stock/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delta, updatedBy }),
    });

    const updatedItems = [...items];
    const target = updatedItems.find((item) => item.id === productId);
    if (target) target.quantityInStock += delta;
    setItems(updatedItems);
  } catch (error) {
    console.error("Gagal update stock:", error);
  }
};

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

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const deletedBy = user?.username;
        const response = await fetch(`${API}/api/product/${productId}?deletedBy=${encodeURIComponent(deletedBy)}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Product deleted successfully");
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  }

      const openRegisterModal = () => {
      setShowRegisterModal(true)
      setRegUsername("");
      setRegPassword("");
    };

    const handleRegisterSubmit = (e) => {
      e.preventDefault();
      if (
        !regUsername.trim() ||
        !regPassword.trim() ||
        !regFullName.trim() ||
        !regEmail.trim() ||
        !regPhone.trim()
      ) {
        alert("Please fill in all fields");
        return;
      }

      onRegister({
        username: regUsername,
        password: regPassword,
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        role: regRole,
        actionsBy: user?.username
      });

      setShowRegisterModal(false);
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
        <div className="homepage-layout">
          <aside className="sidebar">
            <button onClick={handleHome}>🏠 Home</button>
            
            {user?.role === 0 && (
              <>
              <button onClick={openRegisterModal}>➕ Register</button>
              <button onClick={() => navigate("/users")}>👥 User List</button>
              </>
            )}
            
            <button onClick={onLogout}>🚪 Logout</button>
          </aside>

          <main className="main-content">
            <div className="home-container">

                    <div className="welcome-message">Welcome, {user?.username}!</div>

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
                    <p><strong>Stock:</strong>
                      <button onClick={() => updateStock(item.id, -1, user?.username)} disabled={item.quantityInStock <= 0}>−</button>
                      {item.quantityInStock}
                      <button onClick={() => updateStock(item.id, 1, user?.username)}>+</button>
                    </p>
                    <p><strong>Price:</strong> {item.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
                    {item.quantityInStock === 0 && (
                      <div className="out-of-stock">Out of stock</div>
                    )}
                    {user?.role < 2  && ( 
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    )}          
                    </div>
                ))}
                {user?.role < 2 && (
                  <div className="add-product-card" onClick={() => setShowAddProductModal(true)}>
                    + Add Product
                  </div>
                )}
              </div>
              {/* <div className="add-product-card" onClick={() => setShowModal(true)}>
                + Add Product
                </div> */}

                {showAddProductModal && (
                <AddProductModal
                    onClose={() => setShowAddProductModal(false)}
                    onAdd={handleAddProduct}
                />
                )}

              {/* </div> */}
             {showRegisterModal && (
              <RegisterModal
                username={regUsername}
                setUsername={setRegUsername}
                password={regPassword}
                setPassword={setRegPassword}
                fullName={regFullName}
                setFullName={setRegFullName}
                email={regEmail}
                setEmail={setRegEmail}
                phone={regPhone}
                setPhone={setRegPhone}
                role={regRole}
                setRole={setRegRole}
                onClose={() => setShowRegisterModal(false)}
                onSubmit={handleRegisterSubmit}
              />
            )}
            </div>
          </main>
        </div>
  );
}

export default HomePage;

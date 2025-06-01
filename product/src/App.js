import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");

  // Lấy sản phẩm từ API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
  }, []);

  const addProduct = () => {
    if (newProduct.trim() !== "") {
      axios
        .post("http://localhost:5000/api/products", { name: newProduct })
        .then((response) => {
          setProducts([...products, response.data]);
          setNewProduct(""); // Clear input after adding
        })
        .catch((error) => console.error("Lỗi khi thêm sản phẩm:", error));
    } else {
      alert("Please enter a product name.");
    }
  };

  const removeProduct = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      axios
        .delete(`http://localhost:5000/api/products/${id}`)
        .then(() => {
          setProducts(products.filter((product) => product.id !== id));
        })
        .catch((error) => console.error("Lỗi khi xóa sản phẩm:", error));
    }
  };

  const editProduct = (id, currentName) => {
    const newName = prompt("Nhập tên mới:", currentName);
    if (newName !== null && newName.trim() !== "") {
      axios
        .put(`http://localhost:5000/api/products/${id}`, { name: newName })
        .then(() => {
          setProducts(
            products.map((product) =>
              product.id === id ? { ...product, name: newName } : product
            )
          );
        })
        .catch((error) => console.error("Lỗi khi sửa sản phẩm:", error));
    }
  };

  return (
    <div className="App">
      <div className="input-group">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="New products"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
        />
        <button type="button" className="btn btn-success" onClick={addProduct}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <table className="table table-light">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-1"
                  onClick={() => editProduct(product.id, product.name)}
                >
                  <i className="fa-solid fa-wrench"></i> Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeProduct(product.id)}
                >
                  <i className="fa-solid fa-trash"></i> Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

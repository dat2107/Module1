const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Kết nối đến MySQL (phpMyAdmin)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'products',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// API để lấy sản phẩm
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err.message);
      res.status(500).send('Lỗi khi truy vấn dữ liệu');
    } else {
      res.json(results);
    }
  });
});

// API để thêm sản phẩm
app.post('/api/products', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO products (name) VALUES (?)', [name], (err, results) => {
    if (err) {
      console.error('Lỗi khi thêm sản phẩm:', err);
      res.status(500).send('Lỗi khi thêm sản phẩm');
    } else {
      res.json({ id: results.insertId, name });
    }
  });
});

// API để xóa sản phẩm
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      res.status(500).send('Lỗi khi xóa sản phẩm');
    } else {
      res.send('Sản phẩm đã được xóa');
    }
  });
});

// API để sửa sản phẩm
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.query('UPDATE products SET name = ? WHERE id = ?', [name, id], (err, results) => {
    if (err) {
      console.error('Lỗi khi sửa sản phẩm:', err);
      res.status(500).send('Lỗi khi sửa sản phẩm');
    } else {
      res.json({ id, name });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

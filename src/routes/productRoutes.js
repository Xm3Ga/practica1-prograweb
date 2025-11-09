const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateJWT, isAdmin } = require('../middleware/authenticateJWT');

// Obtener todos los productos (público o autenticado)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'username');
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear producto (solo administradores)
router.post('/', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { nombre, precio, descripcion, stock, categoria } = req.body;
    
    const product = new Product({
      nombre,
      precio,
      descripcion,
      stock,
      categoria,
      createdBy: req.user.id
    });

    await product.save();
    await product.populate('createdBy', 'username');

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto (solo administradores)
router.put('/:id', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { nombre, precio, descripcion, stock, categoria } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { nombre, precio, descripcion, stock, categoria },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto (solo administradores)
router.delete('/:id', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

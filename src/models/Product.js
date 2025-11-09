const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  categoria: {
    type: String,
    default: 'General'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

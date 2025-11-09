const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/chat', chatRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de autenticación para Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Token no proporcionado'));
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Token inválido'));
    }
    socket.user = decoded;
    next();
  });
});

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.user.username}`);

  // Unir al usuario a una sala general
  socket.join('chat-general');

  // Notificar a otros usuarios
  socket.to('chat-general').emit('user joined', {
    username: socket.user.username,
    message: `${socket.user.username} se ha unido al chat`
  });

  // Manejo de mensajes
  socket.on('chat message', (msg) => {
    const messageData = {
      username: socket.user.username,
      message: msg,
      timestamp: new Date()
    };
    
    // Emitir a todos los usuarios en la sala
    io.to('chat-general').emit('chat message', messageData);
  });

  // Cuando alguien está escribiendo
  socket.on('typing', () => {
    socket.to('chat-general').emit('typing', socket.user.username);
  });

  socket.on('stop typing', () => {
    socket.to('chat-general').emit('stop typing', socket.user.username);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.user.username}`);
    socket.to('chat-general').emit('user left', {
      username: socket.user.username,
      message: `${socket.user.username} ha salido del chat`
    });
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Conexión a MongoDB y arranque del servidor
mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    server.listen(config.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });

module.exports = app;

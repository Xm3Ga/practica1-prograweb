# Portal de Productos con Autenticación y Chat

Aplicación web completa que integra un sistema de gestión de productos con autenticación JWT y chat en tiempo real usando Socket.IO.

## Características

- **Sistema de Autenticación**: Registro y login de usuarios con JWT
- **Gestión de Roles**: Usuarios normales y administradores con diferentes permisos
- **CRUD de Productos**: Sistema completo de gestión de productos (solo administradores)
- **Chat en Tiempo Real**: Chat integrado con Socket.IO para usuarios autenticados
- **Interfaz Moderna**: Diseño responsive y amigable

## Tecnologías Utilizadas

- **Backend**: Node.js con Express
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JSON Web Tokens (JWT) con bcrypt
- **Tiempo Real**: Socket.IO
- **Frontend**: HTML, CSS y JavaScript vanilla

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB instalado y ejecutándose localmente
- NPM o Yarn

## Instalación

1. Navegar a la carpeta del proyecto:
```bash
cd alt_practica1/src
```

2. Instalar las dependencias:
```bash
npm install
```

3. (Opcional) Crear un archivo `.env` basado en las siguientes variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/portal_productos
JWT_SECRET=mi_secreto_super_seguro_para_jwt_2024
```

4. Asegurarse de que MongoDB esté ejecutándose en tu sistema.

## Ejecución

Para iniciar el servidor:
```bash
npm start
```

Para modo desarrollo con auto-recarga:
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## Estructura del Proyecto

```
/src
├── /public              # Archivos estáticos del frontend
│   ├── index.html       # Página principal
│   ├── chat.html        # Página del chat
│   ├── styles.css       # Estilos
│   └── client.js        # JavaScript del cliente
├── /routes              # Rutas de la API
│   ├── authRoutes.js    # Rutas de autenticación
│   ├── productRoutes.js # Rutas de productos
│   └── chatRoutes.js    # Rutas del chat
├── /models              # Modelos de MongoDB
│   ├── User.js          # Modelo de usuario
│   └── Product.js       # Modelo de producto
├── /middleware          # Middlewares personalizados
│   └── authenticateJWT.js # Autenticación JWT
├── server.js            # Servidor principal
└── config.js            # Configuración de la aplicación
```

## Funcionalidades por Rol

### Usuario Normal
- Ver lista de productos
- Acceder al chat en tiempo real
- Gestionar su sesión (login/logout)

### Administrador
- Todas las funciones de usuario normal
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión

### Productos
- `GET /api/products` - Obtener todos los productos (público)
- `GET /api/products/:id` - Obtener un producto específico
- `POST /api/products` - Crear producto (solo admin)
- `PUT /api/products/:id` - Actualizar producto (solo admin)
- `DELETE /api/products/:id` - Eliminar producto (solo admin)

### Chat
- `GET /chat` - Página del chat (requiere autenticación)

## Decisiones de Desarrollo

### Arquitectura
- **Separación de responsabilidades**: Backend API REST + Frontend SPA básico
- **Modularización**: Rutas, modelos y middleware en archivos separados
- **Configuración centralizada**: Todas las variables de entorno en config.js

### Seguridad
- **Contraseñas encriptadas**: Uso de bcrypt con salt rounds de 10
- **JWT en headers**: Token enviado como Bearer token
- **Validación de roles**: Middleware para verificar permisos de administrador
- **Autenticación en Socket.IO**: Verificación de JWT en conexiones de websocket

### Base de Datos
- **Esquemas con validación**: Uso de Mongoose para validar datos
- **Referencias entre colecciones**: Productos vinculados a usuarios creadores
- **Timestamps automáticos**: createdAt y updatedAt en todos los documentos

### Frontend
- **JavaScript Vanilla**: Sin frameworks para mantener simplicidad
- **Estado local**: Gestión básica del estado en variables globales
- **Diseño responsive**: CSS Grid y Flexbox para adaptabilidad

### Chat en Tiempo Real
- **Salas de chat**: Implementación de sala general para todos los usuarios
- **Indicador de escritura**: Muestra cuando otros usuarios están escribiendo
- **Mensajes del sistema**: Notificaciones de conexión/desconexión
- **Escape de HTML**: Prevención de XSS en mensajes

## Prueba de la Aplicación

### Crear Usuario Administrador (Manual)
Para crear un usuario administrador, puedes:
1. Registrar un usuario normal
2. Acceder a MongoDB y cambiar el rol a 'admin':
```javascript
db.users.updateOne({username: "tu_usuario"}, {$set: {role: "admin"}})
```

### Flujo de Prueba Recomendado
1. Registrar un usuario nuevo
2. Iniciar sesión
3. Ver productos (inicialmente vacío)
4. Acceder al chat
5. Crear usuario admin (ver arriba)
6. Iniciar sesión como admin
7. Crear, editar y eliminar productos
8. Probar el chat con múltiples usuarios

## Consideraciones de Producción

Para un entorno de producción real, se recomienda:
- Usar HTTPS con certificados SSL
- Implementar rate limiting
- Agregar validación más estricta de datos
- Implementar logs más detallados
- Usar un servicio de gestión de sesiones
- Configurar CORS correctamente
- Implementar caché para mejorar rendimiento

## Ampliaciones Futuras

Posibles mejoras para el proyecto:
- Persistencia del historial de chat en base de datos
- Sistema de notificaciones
- Búsqueda y filtrado de productos
- Paginación de productos
- Subida de imágenes para productos
- Sistema de categorías más robusto
- Perfil de usuario editable
- Recuperación de contraseña

## Autor

Proyecto desarrollado como práctica universitaria para demostrar la integración de múltiples tecnologías web modernas.

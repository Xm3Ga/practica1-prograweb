# PRÁCTICA 1: PORTAL DE PRODUCTOS CON AUTENTICACIÓN Y CHAT

En este repositorio se encuentra el código completo de la aplicación de la práctica 1 para la asignatura de programación web.

## Criterios de evaluación

- Autenticación con JWT correctamente implementada ✅
- Roles y permisos funcionales (user / admin) ✅
- CRUD de productos operativo y conectado a MongoDB ✅
- Chat integrado y funcionando con usuarios autenticados ✅
- Estructura y claridad del código / buenas prácticas (A criterio del profesor)
- Documentación y presentación (A criterio del profesor)

## Como ejecutar la aplicación

1. Clona el repositorio
```bash
git clone https://github.com/Xm3Ga/practica1-prograweb.git
```

2. Navegamos a la carpeta clonada, y ejecutamos:
```bash
npm install
```

3. Navegamos a la carpeta /src y ejecutamos:
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

## Notas importantes

La aplicación corre de manera 100% local, por lo tanto para ejecutar el proyecto necesitaremos NodeJS con npm, y MongoDB ejecutandose en local.

La aplicación no incluye un .env de ejemplo. Se recomienda crear un .env personalizado si se va a utilizar la aplicación en producción (Cambiar usando los valores en src/config.js)

Para hacer a un usuario administrador, modificar el atributo 'role' de ese usuario en la base de datos, y cambiarlo de 'user' a 'admin'.

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

## Decisiones de Desarrollo

### Arquitectura
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

## Decisiones del desarrollo

Primero, he partido usando los codigos de las sesiones 10 y 12, que están disponibles en github. Para que la aplicación se ajuste un poco más al objetivo, he modificado los modelos y las rutas para ampliar ligeramente la funcionalidad:
- En el caso de los modelos, product.js ahora acepta stock, categoría y creado por, además de añadir pequeños mensajes a las demás categorías.
- La ruta de productos (que ha pasado a llamarse productRoutes.js) ahora utiliza autenticación con JWT, y se ha añadido una ruta para obtener un producto por su ID, en vez de obtener todos los productos. La autenticación utiliza el método isAdmin del archivo authenticateJWT.js

El archivo server.js conteniendo el chat usando WS también lo he cambiado mucho. Al haber hecho tantos cambios, me he ayudado de un modelo de lenguaje para realizar todos los cambios:
- Ahora los usuarios no son anonimos, sino autenticados con JWT.
- Los mensajes tienen usuario y timestamp.
- El chat contiene notificaciones de "escribiendo".
- El puerto no está hardcodeado en server.js, si no configurable en config.js
- Uso de CORS (pero sin configurar detalladamente, TODO)
- Uso de la librería 'morgan' para logear todas las peticiones a consola. Lo añadí para claridad y debugging mientras probaba la app
- La conexión a MongoDB se realiza aquí
- Rutas de la API y las rutas principales de index y chat están aquí también

Fuera de todos esos cambios, el resto de la aplicación y en su conjunto cumplen con todos los requisitos pedidos.
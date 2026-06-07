# Sistema de Control de Visitas

Plataforma web para llevar control de instituciones visitadas por el personal, con registro de comentarios y seguimiento.

## Características

- **Gestión de usuarios**: Administrador puede crear/eliminar usuarios
- **Ingreso Empresa**: Registro de instituciones con nombre, RUT, tamaño y comuna
- **Ingreso Visita**: Registro de comentarios y contactos por empresa
- **Visitas Realizadas**: Historial con filtro por mes y año
- **Datos independientes**: Cada usuario solo ve su propia información
- **Admin**: Acceso total a los datos de todos los usuarios

## Credenciales por defecto

- **Usuario**: admin
- **Contraseña**: 123456

## Requisitos

- Node.js >= 18
- PostgreSQL

## Instalación local

1. Clonar el repositorio:
```bash
git clone <url-del-repo>
cd app-miguel
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz con:
```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/app_miguel
JWT_SECRET=tu_secreto_jwt_aqui
PORT=5000
NODE_ENV=development
```

4. Construir el frontend:
```bash
npm run build
```

5. Iniciar el servidor:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:5000`

## Despliegue en Railway

1. Subir el código a GitHub
2. En Railway, crear un nuevo proyecto desde el repositorio de GitHub
3. Agregar un servicio de PostgreSQL
4. Configurar las variables de entorno:
   - `DATABASE_URL`: Se genera automáticamente al vincular PostgreSQL
   - `JWT_SECRET`: Un string secreto para tokens JWT
   - `NODE_ENV`: production
5. Railway ejecutará automáticamente `npm run postinstall` y `npm start`

## Stack Tecnológico

- **Backend**: Node.js, Express, Sequelize ORM
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT + bcrypt

## Configuración y Ejecución del Proyecto

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example` proporcionado. Define las credenciales de tu base de datos local:

DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=taller_motos_db
NODE_ENV=development
PORT=3000


### 2. Preparación de la Base de Datos
Antes de ejecutar el proyecto, debes crear la base de datos vacía en tu gestor de MySQL local. Puedes hacerlo ejecutando el siguiente comando en tu cliente SQL:

CREATE DATABASE taller_motos_db;


### 3. Instalación de Dependencias
Abre una terminal en la carpeta raíz del proyecto y ejecuta:

npm install


### 4. Ejecución de Migraciones (Sequelize)
Este proyecto utiliza Sequelize para el modelado de datos. Para construir automáticamente las tablas y relaciones en la base de datos que creaste en el paso 2, ejecuta:

npx sequelize-cli db:migrate


### 5. Ejecución del Proyecto
Una vez que la base de datos esté estructurada, puedes levantar el servidor en modo desarrollo:

npm run dev
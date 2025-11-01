# 🧠 Backend - Proyecto MERN

Este es el **backend del proyecto Josby**, desarrollado con **Node.js, Express y MongoDB**.  
Aquí se gestionan todas las rutas, controladores y la conexión a la base de datos.

---

## 🧩 Clonar el repositorio


1. Crea una carpeta principal llamada **`josby`** (puede estar donde quieras).  
2. Dentro de esa carpeta, crea otra llamada **`backend`**.  
3. Abre la carpeta `backend` en tu editor de código (por ejemplo, **VSCode**).  
   Puedes arrastrar la carpeta o abrirla manualmente desde el menú **Archivo → Abrir carpeta**.  
4. Luego, abre la terminal dentro de esa carpeta y ejecuta el siguiente comando:


```bash
git clone https://github.com/FacundoZu/josby-backend.git .
```

🔹 El punto al final (.) hace que se copie directamente dentro de la carpeta actual.

---

## 📦 Instalación de dependencias

Una vez clonado el repositorio, instala las dependencias necesarias ejecutando:

```bash
npm install
```

---

## 🔐 Configurar variables de entorno

Crea un archivo llamado .env en la raíz del proyecto.
Por ahora, solo necesitas definir las siguientes variables (pasé por discord los valores):

```bash
PORT=
MONGO_URI=
NODE_ENV=
FRONTEND_URL=
```

---

## 🚀 Ejecutar el servidor

```bash
npm run dev
```


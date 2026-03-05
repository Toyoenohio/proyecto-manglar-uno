# 🌿 Proyecto Manglar Uno

Webapp básica construida con HTML, CSS y JavaScript puro (sin frameworks).

---

## 📋 **Descripción**

Proyecto Manglar Uno es una plantilla web moderna y responsive, lista para personalizar. Incluye:

- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Navegación con menú hamburguesa para móvil
- ✅ Secciones pre-configuradas (Inicio, Nosotros, Servicios, Contacto)
- ✅ Formulario de contacto con validación
- ✅ Efectos de scroll y animaciones
- ✅ Código limpio y comentado

---

## 🚀 **Estructura del Proyecto**

```
proyecto-manglar-uno/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos principales
├── js/
│   └── app.js              # JavaScript funcional
├── assets/
│   ├── images/             # Imágenes del proyecto
│   └── fonts/              # Fuentes personalizadas
└── README.md               # Este archivo
```

---

## 🛠️ **Instalación y Uso**

### **1. Clonar el repositorio**

```bash
git clone https://github.com/Toyoenohio/proyecto-manglar-uno.git
cd proyecto-manglar-uno
```

### **2. Abrir en el navegador**

Simplemente abre el archivo `index.html` en tu navegador:

```bash
# Opción 1: Doble click en el archivo
# Opción 2: Desde terminal
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux

# Opción 3: Usar un servidor local (recomendado)
npx http-server -p 3000
# Luego abrir: http://localhost:3000
```

---

## 🎨 **Personalización**

### **Colores**

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --color-primario: #29ABE2;      /* Color principal (azul) */
    --color-secundario: #1A1F2B;    /* Color secundario (oscuro) */
    --color-acento: #F9F9FB;        /* Color de acento (claro) */
    --color-texto: #333333;         /* Color de texto */
    --color-blanco: #FFFFFF;        /* Blanco */
}
```

### **Tipografía**

```css
:root {
    --fuente-principal: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --fuente-titulos: 'Georgia', serif;
}
```

### **Contenido**

Edita `index.html` para cambiar:

- Textos de las secciones
- Enlaces de navegación
- Campos del formulario
- Información de contacto

---

## 📱 **Features Incluidas**

| Feature | Descripción |
|---------|-------------|
| **Responsive Design** | Se adapta a móvil, tablet y desktop |
| **Menú Móvil** | Hamburguesa animada para pantallas pequeñas |
| **Scroll Suave** | Navegación entre secciones con animación |
| **Formulario Validado** | Validación de email y campos requeridos |
| **Alertas** | Notificaciones visuales para el usuario |
| **Animaciones** | Efectos de aparición al hacer scroll |
| **Código Limpio** | Comentado y fácil de entender |

---

## 🔧 **Funcionalidades JavaScript**

### **Incluidas:**

```javascript
// Navegación móvil
initNavigation()

// Botón del hero (scroll a servicios)
initHeroButton()

// Formulario de contacto
initContactForm()

// Efectos de scroll
initScrollEffects()

// Utilidades
isValidEmail()
showAlert()
fetchData()
saveToStorage()
getFromStorage()
toggleDarkMode()
```

### **Para agregar más funcionalidades:**

1. **Conectar a una API real:**
   ```javascript
   const data = await fetchData('https://api.ejemplo.com/datos');
   ```

2. **Enviar formulario a un webhook:**
   ```javascript
   fetch('https://tu-webhook.com', {
       method: 'POST',
       body: JSON.stringify(formData)
   });
   ```

3. **Activar Dark Mode:**
   ```javascript
   toggleDarkMode();
   ```

---

## 🌐 **Deploy**

### **Opciones gratuitas:**

| Plataforma | URL |
|------------|-----|
| **GitHub Pages** | `https://toyoenohio.github.io/proyecto-manglar-uno/` |
| **Netlify** | Arrastra la carpeta o conecta el repo |
| **Vercel** | Conecta el repo de GitHub |
| **Cloudflare Pages** | Conecta el repo de GitHub |

### **Deploy en GitHub Pages:**

```bash
# Habilitar GitHub Pages en el repo
# Settings → Pages → Source: main branch → Save

# O usar la CLI de GitHub
gh pages deploy
```

---

## 📝 **To-Do / Próximas Mejoras**

- [ ] Agregar más secciones según necesidad
- [ ] Integrar con backend real
- [ ] Agregar más animaciones
- [ ] Optimizar imágenes
- [ ] Agregar tests
- [ ] Implementar dark mode toggle

---

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -m 'Agregar nueva feature'`)
4. Push a la branch (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

## 📄 **Licencia**

Este proyecto es de código abierto. Sentite libre de usarlo y modificarlo.

---

## 👨‍💻 **Autor**

- **GitHub:** [@Toyoenohio](https://github.com/Toyoenohio)

---

## 🙏 **Agradecimientos**

Gracias por usar Proyecto Manglar Uno. ¡Espero que te sea útil! 🌿

---

**Hecho con ❤️ y código limpio**

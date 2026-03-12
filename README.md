# 🎓 Academic App - Mobile-Only

Aplicación móvil académica replicada fielmente desde diseño. Construida con **HTML, CSS y JavaScript puro** (sin frameworks).

---

## 📱 **Mobile-Only Design**

Esta webapp está diseñada **exclusivamente para móviles**. El contenedor principal está limitado a 428px (iPhone 14 Pro Max) para garantizar la mejor experiencia en dispositivos móviles.

---

## 🚀 **Vista Previa**

### **Features Visuales:**

| Elemento | Descripción |
|----------|-------------|
| **Pantalla Principal** (`index.html`) | Dashboard académico con resumen general |
| **Pantalla de Notas** (`notas.html`) | Gestión completa de calificaciones por materia |
| **Pantalla de Calendario** (`calendario.html`) | Calendario académico con eventos y navegación |
| **Pantalla de Perfil** (`perfil.html`) | Perfil del estudiante con estadísticas y configuración |
| **Header** | Avatar, saludo personalizado, botón de notificaciones con badge |
| **Tarjeta Académica** | Gradiente azul, promedio 18/20, badges de materias |
| **Próximas Entregas** | Scroll horizontal, cards con iconos de colores |
| **Últimas Notas** | Lista vertical, notas con colores por rendimiento |
| **Bottom Nav** | 4 íconos (Inicio, Notas, Calendario, Perfil) con navegación completa |

---

## 🎨 **Paleta de Colores**

```css
--color-primario: #1E6CEB;         /* Azul principal */
--blanco: #FFFFFF;                  /* Blanco */
--gris-oscuro: #1A1F28;             /* Texto principal */
--gris-medio: #6C757D;              /* Texto secundario */
--gris-claro: #F0F4F8;              /* Fondo */

--rojo-alerta: #E53E3E;             /* Urgente */
--verde-exito: #059669;             /* Notas altas (≥18) */
--amarillo-advertencia: #92400E;    /* Notas medias (15-17) */

--naranja-materia: #FF9E4D;         /* Icono matemáticas */
--azul-claro-materia: #E3F2FD;      /* Icono ensayo */
```

---

## 📋 **Estructura del Proyecto**

```
proyecto-manglar-uno/
├── index.html              # Página principal (mobile layout)
├── notas.html              # Pantalla de Mis Calificaciones
├── calendario.html         # Pantalla de Calendario Académico
├── perfil.html             # Pantalla de Perfil del Estudiante
├── css/
│   ├── styles.css          # Estilos mobile-first
│   ├── notas.css           # Estilos específicos para pantalla de notas
│   ├── calendario.css      # Estilos específicos para calendario
│   └── perfil.css          # Estilos específicos para perfil
├── js/
│   ├── app.js              # Funcionalidades JavaScript principales
│   ├── notas.js            # Funcionalidades específicas para notas
│   ├── calendario.js       # Funcionalidades específicas para calendario
│   └── perfil.js           # Funcionalidades específicas para perfil
├── assets/
│   ├── images/             # Imágenes (avatars, icons)
│   └── fonts/              # Fuentes (Inter de Google Fonts)
└── README.md               # Documentación
```

---

## 🛠️ **Instalación y Uso**

### **1. Clonar el repositorio**

```bash
git clone https://github.com/Toyoenohio/proyecto-manglar-uno.git
cd proyecto-manglar-uno
```

### **2. Abrir en el navegador**

**Opción A: Directo (recomendado para mobile)**
```bash
# Abrir en Chrome DevTools mobile
# F12 → Toggle device toolbar (Ctrl+Shift+M) → Seleccionar iPhone 14 Pro
```

**Opción B: Servidor local**
```bash
# Usar http-server
npx http-server -p 3000

# O usar Python
python -m http.server 3000

# Luego abrir: http://localhost:3000
```

**Opción C: Live Server (VS Code)**
```
# Instalar extensión "Live Server"
# Click derecho en index.html → "Open with Live Server"
```

---

## 📱 **Dispositivos Soportados**

| Dispositivo | Resolución | Estado |
|-------------|------------|--------|
| iPhone 14 Pro Max | 428×926 | ✅ Optimizado |
| iPhone 14 Pro | 393×852 | ✅ Optimizado |
| iPhone SE | 375×667 | ✅ Optimizado |
| Samsung Galaxy S23 | 360×780 | ✅ Optimizado |
| Google Pixel 7 | 412×915 | ✅ Optimizado |

---

## 🎨 **Componentes UI**

### **1. Header**
- Avatar circular con borde azul
- Saludo en dos líneas ("¡Bienvenido!" + "Hola, Alejandro")
- Botón de notificaciones con badge rojo

### **2. Tarjeta Académica**
- Fondo gradiente azul
- Badge "Académico"
- Indicador de crecimiento (+0.2%)
- Número grande (18/20)
- Badges de materias (MAT, FIS, HIS)
- Link "Ver detalles"

### **3. Próximas Entregas**
- Scroll horizontal
- Cards con:
  - Icono de color (naranja, azul, etc.)
  - Título de la tarea
  - Materia (en mayúsculas)
  - Badges de fecha/urgencia

### **4. Últimas Notas**
- Lista vertical
- Cards con:
  - Icono circular gris
  - Nombre de materia
  - Actividad
  - Nota con color codificado:
    - 🟢 Verde: ≥18 (excelente)
    - 🟡 Amarillo: 15-17 (regular)
    - 🔴 Rojo: <15 (mal)

### **5. Pantalla de Mis Calificaciones** (`notas.html`)
- **Header con botón de volver** y título "Mis Calificaciones"
- **Barra de búsqueda** para filtrar materias/profesores
- **Tarjetas de resumen** (Promedio, Materias, Créditos)
- **Lista de materias expandible** con:
  - Iconos personalizados por materia
  - Notas con colores según rendimiento
  - Profesor asignado
  - Desglose detallado de evaluaciones (pesos y notas)
- **Banner "Simulador de Promedio"** (CTA para funcionalidad futura)
- **Navegación completa** entre pantallas

### **6. Pantalla de Calendario** (`calendario.html`)
- **Navegación por meses** (botones anterior/siguiente)
- **Grid de calendario** con días de la semana
- **Eventos visualizados** con puntos de colores:
  - 🔴 Rojo: Exámenes
  - 🔵 Azul: Tareas/Entregas
  - 🟢 Verde: Clases
- **Eventos de hoy** con detalles completos
- **Próximos eventos** destacados
- **Interacción completa**: selección de días, detalles de eventos

### **7. Pantalla de Perfil** (`perfil.html`)
- **Header con avatar grande** y botón de edición
- **Estadísticas del estudiante** (promedio, materias, asistencia, créditos)
- **Información personal** editable (email, teléfono, carrera, facultad)
- **Configuración de la app**:
  - Notificaciones
  - Privacidad
  - Modo oscuro (toggle)
- **Acciones principales**:
  - Exportar datos (JSON)
  - Cerrar sesión
- **Información de la aplicación** (versión, enlaces)

### **8. Bottom Navigation**
- 4 íconos fijos abajo
- Estado activo en azul
- Labels debajo de cada ícono
- **Navegación funcional completa** entre todas las pantallas:
  - `index.html` → Dashboard principal
  - `notas.html` → Mis Calificaciones
  - `calendario.html` → Calendario Académico
  - `perfil.html` → Perfil del Estudiante

---

## 🔧 **Funcionalidades JavaScript**

### **Incluidas:**

```javascript
// Navegación bottom nav
initBottomNav()

// Botón de notificaciones
initNotificationBtn()

// Animaciones de scroll
initScrollAnimations()

// Pull to refresh (simulado)
initPullToRefresh()

// Click en cards
initCardInteractions()

// Utilidades
showAlert()
updateNotificationBadge()
updateGrade()
addAssignment()

// Funcionalidades específicas de notas (notas.js)
initCourseCards()      // Expandir/colapsar materias
initSearch()           // Búsqueda en tiempo real
initSimulatorBanner()  // Banner interactivo
initBackButton()       // Botón de volver
updateAssessmentScore() // Actualizar notas específicas
exportGrades()         // Exportar datos a JSON

// Funcionalidades específicas de calendario (calendario.js)
initCalendarNavigation() // Navegación por meses
initCalendarDays()      // Interacción con días del calendario
initEventCards()        // Detalles de eventos
loadEventsFromAPI()     // Carga de eventos (placeholder para API)
addCalendarEvent()      // Agregar eventos (para integración futura)
exportCalendar()        // Exportar calendario (iCal, etc.)

// Funcionalidades específicas de perfil (perfil.js)
initProfileSettings()   // Configuración del perfil
initProfileActions()    // Acciones (exportar, cerrar sesión)
initDarkModeToggle()    // Toggle de modo oscuro
loadProfileFromAPI()    // Carga de datos del perfil (placeholder)
updateProfileData()     // Actualización de datos del perfil
uploadProfilePhoto()    // Subir foto de perfil (para integración futura)
```

### **Características:**

| Feature | Descripción |
|---------|-------------|
| **Feedback háptico** | Vibración en mobile (si soportado) |
| **Animaciones** | Fade in al hacer scroll |
| **Pull to refresh** | Simulado con touch events |
| **Toast alerts** | Notificaciones tipo toast |
| **Active states** | Cambios visuales al tocar |

---

## 🌐 **Deploy**

### **Opciones gratuitas:**

| Plataforma | URL |
|------------|-----|
| **GitHub Pages** | `https://toyoenohio.github.io/proyecto-manglar-uno/` |
| **Netlify Drop** | Arrastra la carpeta |
| **Vercel** | Conecta el repo |
| **Cloudflare Pages** | Conecta el repo |

### **Deploy en GitHub Pages:**

```bash
# Settings → Pages → Source: main branch → Save

# URL resultante:
https://toyoenohio.github.io/proyecto-manglar-uno/

# Pantallas disponibles:
https://toyoenohio.github.io/proyecto-manglar-uno/              # Dashboard principal
https://toyoenohio.github.io/proyecto-manglar-uno/notas.html    # Mis Calificaciones
https://toyoenohio.github.io/proyecto-manglar-uno/calendario.html # Calendario Académico
https://toyoenohio.github.io/proyecto-manglar-uno/perfil.html   # Perfil del Estudiante
```

---

## 📝 **Personalización**

### **Cambiar colores:**

Edita `css/styles.css`:

```css
:root {
    --color-primario: #TU_COLOR;  /* Cambia el azul */
}
```

### **Cambiar datos del usuario:**

Edita `index.html`:

```html
<span class="greeting-large">Hola, TU_NOMBRE</span>
```

### **Agregar más notas:**

Copia y pega un bloque `.grade-card`:

```html
<div class="grade-card">
    <div class="grade-icon">
        <!-- SVG del icono -->
    </div>
    <div class="grade-info">
        <h3 class="grade-subject-name">Materia</h3>
        <p class="grade-activity">Actividad</p>
    </div>
    <div class="grade-score grade-score-high">19.5</div>
</div>
```

---

## 🎯 **To-Do / Próximas Mejoras**

- [x] **Pantalla de Mis Calificaciones** - Completada ✅
- [x] **Pantalla de Calendario** - Completada ✅
- [x] **Pantalla de Perfil** - Completada ✅
- [ ] Conectar a API real de notas y calendario
- [ ] Implementar modo oscuro
- [ ] Agregar animaciones de carga
- [ ] Optimizar imágenes (WebP)
- [ ] Agregar tests
- [ ] Implementar Simulador de Promedio funcional
- [ ] Agregar exportación de notas (PDF/CSV)
- [ ] Sincronización offline con localStorage
- [ ] Integración con Google Calendar/Outlook
- [ ] Notificaciones push para eventos

---

## 📊 **Performance**

| Métrica | Valor |
|---------|-------|
| **Tamaño HTML** | ~13 KB |
| **Tamaño CSS** | ~14 KB |
| **Tamaño JS** | ~13 KB |
| **Total** | ~40 KB |
| **Fonts** | Google Fonts (Inter) |
| **Imágenes** | SVG inline (sin requests extra) |

---

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -m 'Agregar nueva feature'`)
4. Push a la branch (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

## 📄 **Licencia**

Código abierto. Sentite libre de usar y modificar.

---

## 👨‍💻 **Autor**

- **GitHub:** [@Toyoenohio](https://github.com/Toyoenohio)

---

## 🙏 **Agradecimientos**

Diseño replicado fielmente desde captura de pantalla proporcionada.

**Hecho con ❤️ para mobile**

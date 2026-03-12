/**
 * ========================================
 * Pantalla de Perfil
 * Funcionalidad JavaScript
 * ======================================== */

// ========================================
// Esperar a que el DOM esté cargado
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 Pantalla de Perfil - Cargada correctamente');
    
    // Inicializar funcionalidades
    initProfileSettings();
    initProfileActions();
    initBackButton();
    initDarkModeToggle();
});

// ========================================
// Profile Settings Interaction
// ========================================
function initProfileSettings() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const settingItems = document.querySelectorAll('.setting-item');
    
    // Botones de editar
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionTitle = this.closest('.section-header')?.querySelector('.section-title')?.textContent;
            console.log('✏️ Editando:', sectionTitle);
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
            
            // Aquí iría la lógica de edición
            showAlert(`✏️ Editando ${sectionTitle}`, 'info');
        });
    });
    
    // Items de configuración
    settingItems.forEach(item => {
        item.addEventListener('click', function() {
            const settingTitle = this.querySelector('.setting-title')?.textContent;
            
            // Si es el toggle de modo oscuro, no hacer nada (manejado por otro evento)
            if (settingTitle === 'Modo Oscuro') {
                return;
            }
            
            console.log('⚙️ Abriendo configuración:', settingTitle);
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
            
            // Aquí iría la navegación a la configuración específica
            showAlert(`⚙️ ${settingTitle}`, 'info');
        });
    });
    
    // Botón de editar avatar
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
            console.log('🖼️ Cambiando foto de perfil');
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }
            
            // Aquí iría la lógica para subir una nueva foto
            showAlert('🖼️ Cambiar foto de perfil', 'info');
            
            // Simular selector de archivos
            setTimeout(() => {
                showAlert('✅ Foto actualizada (simulación)', 'success');
            }, 1000);
        });
    }
}

// ========================================
// Dark Mode Toggle
// ========================================
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        // Cargar preferencia guardada
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = savedDarkMode;
        
        // Aplicar modo oscuro si está activado
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // Escuchar cambios
        darkModeToggle.addEventListener('change', function() {
            const isDarkMode = this.checked;
            
            console.log('🌙 Modo oscuro:', isDarkMode ? 'Activado' : 'Desactivado');
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
            
            // Guardar preferencia
            localStorage.setItem('darkMode', isDarkMode);
            
            // Aplicar/remover clase
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                showAlert('🌙 Modo oscuro activado', 'info');
            } else {
                document.body.classList.remove('dark-mode');
                showAlert('☀️ Modo claro activado', 'info');
            }
        });
    }
}

// ========================================
// Profile Actions
// ========================================
function initProfileActions() {
    const exportBtn = document.querySelector('.action-btn-primary');
    const logoutBtn = document.querySelector('.action-btn-secondary');
    
    // Exportar datos
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            console.log('📤 Exportando datos del perfil');
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate([10, 30, 10]);
            }
            
            exportProfileData();
        });
    }
    
    // Cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('🚪 Cerrando sesión');
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate([20, 40, 20]);
            }
            
            confirmLogout();
        });
    }
}

function exportProfileData() {
    console.log('📊 Preparando exportación de datos...');
    
    // Mostrar estado de carga
    showAlert('📊 Preparando exportación...', 'info');
    
    // Simular proceso de exportación
    setTimeout(() => {
        // Crear datos del perfil para exportar
        const profileData = {
            nombre: 'Alejandro Rodríguez',
            id: '2023-00123456',
            email: 'alejandro.rodriguez@universidad.edu',
            telefono: '+1 (555) 123-4567',
            carrera: 'Ingeniería de Sistemas',
            facultad: 'Ingeniería y Tecnología',
            promedio: 18.2,
            materias: 6,
            asistencia: '92%',
            creditos: 18,
            fechaExportacion: new Date().toISOString()
        };
        
        // Convertir a JSON
        const jsonData = JSON.stringify(profileData, null, 2);
        
        // Crear blob y descargar
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `perfil_${profileData.id}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Datos exportados:', profileData);
        showAlert('✅ Datos exportados correctamente', 'success');
    }, 1500);
}

function confirmLogout() {
    // Aquí iría un modal de confirmación
    // Por ahora, mostramos un alert
    showAlert('🚪 ¿Estás seguro de que querés cerrar sesión?', 'info');
    
    // Simular confirmación
    setTimeout(() => {
        console.log('✅ Sesión cerrada');
        showAlert('✅ Sesión cerrada. Redirigiendo...', 'success');
        
        // Redirigir al login/inicio
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }, 500);
}

// ========================================
// Botón de Volver
// ========================================
function initBackButton() {
    const backBtn = document.querySelector('.back-btn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log('⬅️ Volviendo al inicio');
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
            
            // Navegar al inicio
            window.location.href = 'index.html';
        });
    }
}

// ========================================
// Funcionalidades de API (Placeholder)
// ========================================

// Cargar datos del perfil desde API
function loadProfileFromAPI() {
    console.log('📡 Cargando datos del perfil desde API...');
    
    // Esto sería una llamada real a una API
    return new Promise((resolve) => {
        setTimeout(() => {
            const profileData = {
                nombre: 'Alejandro Rodríguez',
                id: '2023-00123456',
                email: 'alejandro.rodriguez@universidad.edu',
                telefono: '+1 (555) 123-4567',
                carrera: 'Ingeniería de Sistemas',
                facultad: 'Ingeniería y Tecnología',
                promedio: 18.2,
                materias: 6,
                asistencia: '92%',
                creditos: 18,
                avatarUrl: null // URL de la foto de perfil
            };
            resolve(profileData);
        }, 500);
    });
}

// Actualizar datos del perfil
function updateProfileData(updatedData) {
    console.log('🔄 Actualizando datos del perfil:', updatedData);
    
    // Esto sería una llamada real a una API
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('✅ Perfil actualizado');
            resolve({ success: true, message: 'Perfil actualizado correctamente' });
        }, 1000);
    });
}

// Subir foto de perfil
function uploadProfilePhoto(file) {
    console.log('📤 Subiendo foto de perfil:', file.name);
    
    // Esto sería una llamada real a una API
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('✅ Foto subida correctamente');
            resolve({ 
                success: true, 
                url: 'https://example.com/profile-photo.jpg',
                message: 'Foto actualizada correctamente'
            });
        }, 2000);
    });
}

// ========================================
// Utilidades Específicas de Perfil
// ========================================

// Validar datos del perfil
function validateProfileData(data) {
    const errors = [];
    
    if (!data.nombre || data.nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('El email no es válido');
    }
    
    if (data.telefono && !isValidPhone(data.telefono)) {
        errors.push('El teléfono no es válido');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Generar reporte del perfil
function generateProfileReport() {
    console.log('📊 Generando reporte del perfil');
    
    const report = {
        fecha: new Date().toISOString(),
        perfil: {
            nombre: 'Alejandro Rodríguez',
            id: '2023-00123456',
            carrera: 'Ingeniería de Sistemas'
        },
        estadisticas: {
            promedio: 18.2,
            materias: 6,
            asistencia: '92%',
            creditos: 18
        },
        rendimiento: 'Excelente',
        recomendaciones: [
            'Mantener el promedio actual',
            'Considerar tomar materias electivas',
            'Participar en actividades extracurriculares'
        ]
    };
    
    return report;
}

// ========================================
// Notificaciones del Perfil (Para futura implementación)
// ========================================

function checkProfileNotifications() {
    console.log('🔔 Verificando notificaciones del perfil');
    
    // Verificar si hay actualizaciones pendientes
    // Verificar si hay acciones requeridas
    // Verificar si hay mensajes nuevos
    
    return {
        hasUpdates: false,
        requiredActions: [],
        newMessages: 0
    };
}

// ========================================
// Seguridad y Autenticación (Para futura implementación)
// ========================================

function changePassword(oldPassword, newPassword) {
    console.log('🔐 Cambiando contraseña');
    
    // Validar contraseñas
    if (newPassword.length < 8) {
        return { success: false, message: 'La nueva contraseña debe tener al menos 8 caracteres' };
    }
    
    // Aquí iría la lógica real de cambio de contraseña
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Contraseña cambiada correctamente' });
        }, 1500);
    });
}

function enableTwoFactorAuth() {
    console.log('🔐 Activando autenticación de dos factores');
    
    // Aquí iría la lógica real de 2FA
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ 
                success: true, 
                qrCode: 'data:image/png;base64,...', // QR code para la app de autenticación
                backupCodes: ['ABC123', 'DEF456', 'GHI789', 'JKL012']
            });
        }, 2000);
    });
}

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
    initProfileActions();
    initSettings();
    initBackButton();
    loadProfileData();
});

// ========================================
// Profile Actions
// ========================================
function initProfileActions() {
    // Botón de editar avatar
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
            changeProfilePicture();
        });
    }
    
    // Botón de editar información
    const editInfoBtn = document.querySelector('.edit-btn');
    if (editInfoBtn) {
        editInfoBtn.addEventListener('click', function() {
            editProfileInfo();
        });
    }
    
    // Botones de acción
    const exportBtn = document.querySelector('.action-btn-primary');
    const logoutBtn = document.querySelector('.action-btn-secondary');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportProfileData();
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutUser();
        });
    }
}

function changeProfilePicture() {
    console.log('🖼️ Cambiando foto de perfil');
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }
    
    // En una app real, esto abriría el selector de archivos o la cámara
    // Por ahora, mostramos un mensaje
    showAlert('🖼️ Seleccionar nueva foto de perfil', 'info');
    
    // Simular cambio de avatar
    setTimeout(() => {
        showAlert('✅ Foto de perfil actualizada', 'success');
    }, 1000);
}

function editProfileInfo() {
    console.log('✏️ Editando información del perfil');
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }
    
    // En una app real, esto abriría un formulario de edición
    // Por ahora, mostramos un mensaje
    showAlert('✏️ Abriendo editor de perfil', 'info');
}

function exportProfileData() {
    console.log('📤 Exportando datos del perfil');
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate([10, 30, 10]);
    }
    
    // Simular exportación
    showAlert('📤 Preparando exportación de datos...', 'info');
    
    setTimeout(() => {
        const profileData = getProfileDataForExport();
        console.log('📊 Datos para exportar:', profileData);
        
        // En una app real, esto generaría un archivo PDF/CSV
        showAlert('✅ Datos exportados correctamente', 'success');
    }, 1500);
}

function logoutUser() {
    console.log('🚪 Cerrando sesión');
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate([20, 50, 20]);
    }
    
    // Confirmar cierre de sesión
    showAlert('🚪 ¿Estás seguro de que querés cerrar sesión?', 'info');
    
    // En una app real, esto limpiaría el token de autenticación
    // y redirigiría al login
    setTimeout(() => {
        console.log('✅ Sesión cerrada');
        showAlert('✅ Sesión cerrada correctamente', 'success');
        
        // Redirigir al login (simulado)
        setTimeout(() => {
            window.location.href = 'index.html'; // En realidad sería login.html
        }, 1000);
    }, 2000);
}

// ========================================
// Settings Management
// ========================================
function initSettings() {
    // Configurar toggle de modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // Cargar preferencia guardada
        const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = darkModeEnabled;
        
        // Aplicar modo oscuro si está activado
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
        }
        
        // Escuchar cambios
        darkModeToggle.addEventListener('change', function() {
            toggleDarkMode(this.checked);
        });
    }
    
    // Configurar items de settings
    const settingItems = document.querySelectorAll('.setting-item:not(:has(.toggle-switch))');
    settingItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.setting-title')?.textContent;
            openSetting(title);
        });
    });
}

function toggleDarkMode(enabled) {
    console.log('🌙 Modo oscuro:', enabled ? 'activado' : 'desactivado');
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
    
    // Guardar preferencia
    localStorage.setItem('darkMode', enabled);
    
    // Aplicar/remover clase
    if (enabled) {
        document.body.classList.add('dark-mode');
        showAlert('🌙 Modo oscuro activado', 'info');
    } else {
        document.body.classList.remove('dark-mode');
        showAlert('☀️ Modo claro activado', 'info');
    }
}

function openSetting(settingName) {
    console.log('⚙️ Abriendo configuración:', settingName);
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }
    
    // En una app real, esto navegaría a la pantalla de configuración específica
    // Por ahora, mostramos un mensaje
    showAlert(`⚙️ ${settingName}`, 'info');
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
// Profile Data Management
// ========================================
function loadProfileData() {
    console.log('📋 Cargando datos del perfil');
    
    // En una app real, esto cargaría datos desde una API
    // Por ahora, usamos datos de ejemplo
    const profileData = {
        name: 'Alejandro Rodríguez',
        id: '2023-00123456',
        email: 'alejandro.rodriguez@universidad.edu',
        phone: '+1 (555) 123-4567',
        career: 'Ingeniería de Sistemas',
        faculty: 'Ingeniería y Tecnología',
        average: 18.2,
        subjects: 6,
        attendance: 92,
        credits: 18,
        status: 'Estudiante',
        year: '4to Año'
    };
    
    // Actualizar UI con datos
    updateProfileUI(profileData);
    
    // Simular carga desde API
    simulateAPILoad();
}

function updateProfileUI(data) {
    // Actualizar elementos de la UI
    const elements = {
        '.profile-name': data.name,
        '.profile-id': `ID: ${data.id}`,
        '.info-value:nth-child(1)': data.email,
        '.info-value:nth-child(2)': data.phone,
        '.info-value:nth-child(3)': data.career,
        '.info-value:nth-child(4)': data.faculty,
        '.stat-value:nth-child(1)': data.average,
        '.stat-value:nth-child(2)': data.subjects,
        '.stat-value:nth-child(3)': `${data.attendance}%`,
        '.stat-value:nth-child(4)': data.credits
    };
    
    Object.entries(elements).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Actualizar badges
    updateProfileBadges(data.status, data.year);
}

function updateProfileBadges(status, year) {
    const badgesContainer = document.querySelector('.profile-badges');
    if (badgesContainer) {
        badgesContainer.innerHTML = `
            <span class="badge badge-student">${status}</span>
            <span class="badge badge-year">${year}</span>
        `;
    }
}

function simulateAPILoad() {
    // Simular carga asíncrona desde API
    setTimeout(() => {
        console.log('✅ Datos del perfil cargados');
        // Podríamos mostrar un indicador de carga aquí
    }, 500);
}

function getProfileDataForExport() {
    // Recopilar datos actuales para exportar
    const data = {
        personalInfo: {
            name: document.querySelector('.profile-name')?.textContent || '',
            id: document.querySelector('.profile-id')?.textContent?.replace('ID: ', '') || '',
            email: document.querySelector('.info-value:nth-child(1)')?.textContent || '',
            phone: document.querySelector('.info-value:nth-child(2)')?.textContent || '',
            career: document.querySelector('.info-value:nth-child(3)')?.textContent || '',
            faculty: document.querySelector('.info-value:nth-child(4)')?.textContent || ''
        },
        academicStats: {
            average: parseFloat(document.querySelector('.stat-value:nth-child(1)')?.textContent || 0),
            subjects: parseInt(document.querySelector('.stat-value:nth-child(2)')?.textContent || 0),
            attendance: parseInt(document.querySelector('.stat-value:nth-child(3)')?.textContent?.replace('%', '') || 0),
            credits: parseInt(document.querySelector('.stat-value:nth-child(4)')?.textContent || 0)
        },
        exportDate: new Date().toISOString(),
        appVersion: document.querySelector('.app-version-number')?.textContent || '2.1.0'
    };
    
    return data;
}

// ========================================
// API Integration (Placeholder)
// ========================================

// Simular actualización de perfil en API
function updateProfileInAPI(updatedData) {
    console.log('📡 Actualizando perfil en API:', updatedData);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('✅ Perfil actualizado en API');
            resolve({ success: true, data: updatedData });
        }, 1000);
    });
}

// Simular carga de foto de perfil
function uploadProfilePicture(file) {
    console.log('📤 Subiendo foto de perfil:', file.name);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('✅ Foto subida correctamente');
            resolve({ 
                success: true, 
                url: 'https://api.example.com/profile/picture.jpg',
                thumbnail: 'https://api.example.com/profile/picture-thumb.jpg'
            });
        }, 1500);
    });
}

// ========================================
// Notifications Preferences
// ========================================

function loadNotificationPreferences() {
    // Cargar preferencias de notificaciones
    const preferences = {
        examReminders: true,
        assignmentDeadlines: true,
        classSchedule: true,
        gradeUpdates: true,
        systemAnnouncements: false
    };
    
    console.log('🔔 Preferencias de notificaciones:', preferences);
    return preferences;
}

function saveNotificationPreferences(preferences) {
    // Guardar preferencias de notificaciones
    console.log('💾 Guardando preferencias:', preferences);
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
}

// ========================================
// Privacy Settings
// ========================================

function loadPrivacySettings() {
    // Cargar configuración de privacidad
    const settings = {
        showProfile: true,
        showGrades: false,
        showSchedule: true,
        showAttendance: false,
        contactVisibility: 'friends-only'
    };
    
    console.log('🔒 Configuración de privacidad:', settings);
    return settings;
}

function savePrivacySettings(settings) {
    // Guardar configuración de privacidad
    console.log('💾 Guardando configuración de privacidad:', settings);
    localStorage.setItem('privacySettings', JSON.stringify(settings));
}

// ========================================
// Session Management
// ========================================

function checkSessionValidity() {
    // Verificar si la sesión es válida
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) {
        return false;
    }
    
    const now = new Date().getTime();
    return now < parseInt(expiry);
}

function refreshSession() {
    // Refrescar token de sesión
    console.log('🔄 Refrescando sesión');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const newExpiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 horas
            localStorage.setItem('tokenExpiry', newExpiry.toString());
            resolve(true);
        }, 500);
    });
}

/**
 * ========================================
 * Perfil - Academic App
 * Carga dinámica de perfil de usuario
 * ========================================
 */

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', async function() {
    console.log('👤 Perfil - Cargada correctamente');
    console.log('📱 Página de perfil cargada');
    
    // Verificar autenticación
    console.log('🔍 Verificando autenticación...');
    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        console.log('✅ Usuario autenticado:', user);
        console.log('📝 Nombre del usuario:', user.nombre);
        console.log('📧 Email del usuario:', user.correo);
        
        // Cargar datos del perfil
        await loadProfileData(user);
        
        // Inicializar funcionalidades
        initProfileActions();
        initBackButton();
    } else {
        console.log('❌ Usuario NO autenticado');
        console.log('🔑 Redirigiendo a login...');
        // Auth.requireAuth(); // Comentado temporalmente para debug
    }
});

/**
 * Cargar datos del perfil del usuario
 */
async function loadProfileData(user) {
    try {
        // Mostrar loading
        showLoading();
        
        // Actualizar información básica del usuario
        updateProfileInfo(user);
        
        // Cargar estadísticas
        await loadProfileStats(user);
        
        console.log('✅ Perfil cargado:', user);
        
        // Ocultar loading
        hideLoading();
    } catch (error) {
        console.error('❌ Error cargando perfil:', error);
        showError('Error cargando perfil. Verifica tu conexión.');
        hideLoading();
    }
}

/**
 * Actualizar información básica del perfil
 */
function updateProfileInfo(user) {
    console.log('🔄 Actualizando perfil con usuario:', user);
    
    // Nombre
    const nameElement = document.querySelector('.profile-name');
    if (nameElement) {
        console.log('📝 Cambiando nombre de:', nameElement.textContent, 'a:', user.nombre);
        nameElement.textContent = user.nombre;
    } else {
        console.log('❌ No se encontró elemento .profile-name');
    }
    
    // ID (generado a partir del email)
    const idElement = document.querySelector('.profile-id');
    if (idElement) {
        const id = generateStudentId(user.correo);
        console.log('🆔 Generando ID:', id, 'para email:', user.correo);
        idElement.textContent = `ID: ${id}`;
    } else {
        console.log('❌ No se encontró elemento .profile-id');
    }
    
    // Email
    const emailElement = document.querySelector('.profile-email');
    if (emailElement) {
        console.log('📧 Actualizando email a:', user.correo);
        emailElement.textContent = user.correo;
    } else {
        console.log('ℹ️ No se encontró elemento .profile-email (puede ser normal)');
    }
    
    // Badges
    const badgesContainer = document.querySelector('.profile-badges');
    if (badgesContainer) {
        console.log('🎯 Badges container encontrado');
        // Mantener badges existentes o actualizar
        const studentBadge = badgesContainer.querySelector('.badge-student');
        if (studentBadge) {
            studentBadge.textContent = 'Estudiante';
        }
        
        // Año (generado aleatoriamente)
        const yearBadge = badgesContainer.querySelector('.badge-year');
        if (yearBadge) {
            const years = ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];
            const randomYear = years[Math.floor(Math.random() * years.length)];
            yearBadge.textContent = randomYear;
        }
    } else {
        console.log('❌ No se encontró elemento .profile-badges');
    }
    
    console.log('✅ Perfil actualizado correctamente');
}

/**
 * Generar ID de estudiante a partir del email
 */
function generateStudentId(email) {
    // Extraer números del email o usar hash
    const numbers = email.replace(/\D/g, '');
    if (numbers.length >= 6) {
        return `2023-${numbers.slice(0, 6)}`;
    }
    
    // Si no hay números, crear hash
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        hash = ((hash << 5) - hash) + email.charCodeAt(i);
        hash = hash & hash;
    }
    
    return `2023-${Math.abs(hash).toString().slice(0, 6).padStart(6, '0')}`;
}

/**
 * Cargar estadísticas del perfil
 */
async function loadProfileStats(user) {
    try {
        // Cargar evaluaciones del usuario
        const evaluaciones = await Database.getEvaluaciones(user.nombre);
        const calificadas = evaluaciones.filter(e => e.estado === 'Calificado' && e.nota);
        
        // Calcular estadísticas
        const promedio = calcularPromedio(calificadas);
        const materias = [...new Set(evaluaciones.map(e => e.materia))];
        const asistencia = calcularAsistencia(evaluaciones);
        const creditos = evaluaciones.length; // Simplificado
        
        // Actualizar tarjetas de estadísticas
        updateStatCards(promedio, materias.length, asistencia, creditos);
        
        console.log('📊 Estadísticas:', { promedio, materias: materias.length, asistencia, creditos });
    } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
        // Usar valores por defecto
        updateStatCards(18.2, 6, 92, 18);
    }
}

/**
 * Calcular promedio
 */
function calcularPromedio(calificadas) {
    if (calificadas.length === 0) return 0;
    
    const suma = calificadas.reduce((acc, e) => acc + (parseFloat(e.nota) || 0), 0);
    return Math.round((suma / calificadas.length) * 10) / 10;
}

/**
 * Calcular asistencia (simulada)
 */
function calcularAsistencia(evaluaciones) {
    // Simular asistencia basada en evaluaciones completadas
    const completadas = evaluaciones.filter(e => e.estado === 'Calificado').length;
    const total = evaluaciones.length;
    
    if (total === 0) return 100;
    
    return Math.round((completadas / total) * 100);
}

/**
 * Actualizar tarjetas de estadísticas
 */
function updateStatCards(promedio, materias, asistencia, creditos) {
    const statCards = document.querySelectorAll('.stat-card');
    
    if (statCards.length >= 4) {
        // Promedio
        const promedioValue = statCards[0].querySelector('.stat-value');
        if (promedioValue) {
            promedioValue.textContent = promedio.toFixed(1);
        }
        
        // Materias
        const materiasValue = statCards[1].querySelector('.stat-value');
        if (materiasValue) {
            materiasValue.textContent = materias;
        }
        
        // Asistencia
        const asistenciaValue = statCards[2].querySelector('.stat-value');
        if (asistenciaValue) {
            asistenciaValue.textContent = `${asistencia}%`;
        }
        
        // Créditos
        const creditosValue = statCards[3].querySelector('.stat-value');
        if (creditosValue) {
            creditosValue.textContent = creditos;
        }
    }
}

/**
 * Inicializar acciones del perfil
 */
function initProfileActions() {
    // Botón de logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('¿Seguro que querés cerrar sesión?')) {
                Auth.logout();
            }
        });
    }
    
    // Botón de editar avatar (placeholder)
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
            showAlert('📸 Función de cambiar foto disponible próximamente', 'info');
        });
    }
    
    // Botones de editar información (placeholder)
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.profile-section');
            const title = section ? section.querySelector('.section-title')?.textContent : 'información';
            showAlert(`✏️ Editar ${title} disponible próximamente`, 'info');
        });
    });
    
    // Enlaces de la app (placeholder)
    const appLinks = document.querySelectorAll('.app-link');
    appLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent;
            showAlert(`🔗 ${text} disponible próximamente`, 'info');
        });
    });
}

/**
 * Inicializar botón de volver
 */
function initBackButton() {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
}

/**
 * Mostrar loading
 */
function showLoading() {
    const profileHeader = document.querySelector('.profile-header');
    const profileStats = document.querySelector('.profile-stats');
    
    if (profileHeader) {
        profileHeader.style.opacity = '0.5';
    }
    if (profileStats) {
        profileStats.style.opacity = '0.5';
    }
}

/**
 * Ocultar loading
 */
function hideLoading() {
    const profileHeader = document.querySelector('.profile-header');
    const profileStats = document.querySelector('.profile-stats');
    
    if (profileHeader) {
        profileHeader.style.opacity = '1';
    }
    if (profileStats) {
        profileStats.style.opacity = '1';
    }
}

/**
 * Mostrar error
 */
function showError(message) {
    // Podríamos mostrar un toast o alerta
    console.error('❌ Error en perfil:', message);
    
    // Mostrar alerta temporal
    const alertDiv = document.createElement('div');
    alertDiv.className = 'profile-error';
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #E53E3E;
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

/**
 * Mostrar alerta (reutilizada de app.js)
 */
function showAlert(message, type = 'info') {
    // Remover alertas existentes
    const existingAlert = document.querySelector('.toast-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Crear elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `toast-alert toast-${type}`;
    alertDiv.textContent = message;
    
    // Estilos
    const bgColor = type === 'success' ? '#059669' : 
                    type === 'error' ? '#E53E3E' : 
                    '#1E6CEB';
    
    alertDiv.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${bgColor};
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    // Agregar al DOM
    document.body.appendChild(alertDiv);
    
    // Remover después de 2.5 segundos
    setTimeout(() => {
        alertDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 2500);
}

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

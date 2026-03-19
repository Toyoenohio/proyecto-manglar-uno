/**
 * ========================================
 * PERFIL FIX - Solución agresiva para problemas de perfil
 * ========================================
 */

// Ejecutar inmediatamente cuando el script se carga
console.log('🚀 PERFIL FIX - Inicializando...');

// Función para forzar la actualización del perfil
function forceUpdateProfile() {
    console.log('🔧 FORCE UPDATE PROFILE - Ejecutando...');
    
    // 1. Verificar autenticación
    if (!window.Auth || !window.Auth.isLoggedIn()) {
        console.log('❌ No hay usuario autenticado');
        return;
    }
    
    const user = window.Auth.getCurrentUser();
    console.log('✅ Usuario encontrado:', user);
    
    if (!user || !user.nombre) {
        console.log('❌ Usuario inválido');
        return;
    }
    
    // 2. ACTUALIZAR NOMBRE (FORZADO)
    const nameElements = document.querySelectorAll('.profile-name, [class*="name"], h2');
    nameElements.forEach(el => {
        if (el.textContent.includes('Alejandro') || el.textContent.includes('Rodríguez')) {
            console.log('📝 Forzando cambio de nombre en:', el);
            el.textContent = user.nombre;
        }
    });
    
    // Buscar específicamente .profile-name
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        console.log('✅ Actualizando .profile-name a:', user.nombre);
        profileName.textContent = user.nombre;
    }
    
    // 3. ACTUALIZAR EMAIL
    const emailElements = document.querySelectorAll('.profile-email, [class*="email"], [class*="correo"]');
    emailElements.forEach(el => {
        if (el.textContent.includes('@')) {
            console.log('📧 Forzando cambio de email en:', el);
            el.textContent = user.correo || user.email || user.correo_electronico;
        }
    });
    
    // Buscar en sección de información personal
    const infoSection = document.querySelector('.profile-section');
    if (infoSection) {
        const allText = infoSection.textContent;
        if (allText.includes('alejandro@') || allText.includes('Alejandro')) {
            console.log('🔄 Reemplazando texto en sección de información');
            // Reemplazar texto directamente
            infoSection.innerHTML = infoSection.innerHTML
                .replace(/Alejandro Rodríguez/g, user.nombre)
                .replace(/alejandro@manglar\.edu/g, user.correo || '')
                .replace(/Alejandro/g, user.nombre.split(' ')[0] || user.nombre);
        }
    }
    
    // 4. ACTUALIZAR ID
    const idElements = document.querySelectorAll('.profile-id, [class*="id"], [class*="ID"]');
    idElements.forEach(el => {
        if (el.textContent.includes('ID:')) {
            const newId = generateStudentId(user.correo || user.email);
            console.log('🆔 Actualizando ID a:', newId);
            el.textContent = `ID: ${newId}`;
        }
    });
    
    // 5. FORZAR LOGOUT BUTTON
    setupLogoutButton();
    
    console.log('✅ FORCE UPDATE COMPLETADO');
}

// Generar ID de estudiante
function generateStudentId(email) {
    if (!email) return '2023-00000000';
    const numbers = email.replace(/\D/g, '');
    if (numbers.length >= 6) {
        return `2023-${numbers.slice(0, 6)}`;
    }
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        hash = ((hash << 5) - hash) + email.charCodeAt(i);
        hash = hash & hash;
    }
    return `2023-${Math.abs(hash).toString().slice(0, 6).padStart(6, '0')}`;
}

// Configurar botón de logout (AGRESIVO)
function setupLogoutButton() {
    console.log('🔧 Configurando botón de logout...');
    
    // Buscar TODOS los botones
    const allButtons = document.querySelectorAll('button');
    let logoutButton = null;
    
    allButtons.forEach(btn => {
        const btnText = btn.textContent || '';
        if (btnText.includes('Cerrar Sesión') || btnText.includes('Cerrar') || btnText.includes('Salir') || btnText.includes('Logout')) {
            logoutButton = btn;
            console.log('✅ Encontrado botón de logout:', btn);
        }
    });
    
    if (!logoutButton) {
        console.log('❌ No se encontró botón de logout, creando uno...');
        // Crear botón si no existe
        const actionsSection = document.querySelector('.actions-list, .profile-section');
        if (actionsSection) {
            logoutButton = document.createElement('button');
            logoutButton.className = 'action-btn action-btn-secondary logout-btn';
            logoutButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Cerrar Sesión</span>
            `;
            actionsSection.appendChild(logoutButton);
            console.log('✅ Botón de logout creado');
        }
    }
    
    if (logoutButton) {
        // Remover event listeners previos
        const newLogoutButton = logoutButton.cloneNode(true);
        logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
        
        // Agregar nuevo event listener
        newLogoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('👋 Click en botón de logout (FORZADO)');
            
            if (confirm('¿Seguro que querés cerrar sesión?')) {
                console.log('✅ Confirmado, cerrando sesión...');
                if (window.Auth && window.Auth.logout) {
                    window.Auth.logout();
                } else {
                    // Fallback si Auth no está disponible
                    localStorage.clear();
                    window.location.href = 'login.html';
                }
            }
        });
        
        console.log('✅ Botón de logout configurado correctamente');
    } else {
        console.log('❌ No se pudo configurar botón de logout');
    }
}

// 6. EJECUTAR INMEDIATAMENTE Y CON RETRASOS
function initProfileFix() {
    console.log('🚀 INICIANDO PERFIL FIX...');
    
    // Ejecutar inmediatamente
    forceUpdateProfile();
    
    // Ejecutar después de 500ms (por si el DOM no está listo)
    setTimeout(forceUpdateProfile, 500);
    
    // Ejecutar después de 1000ms (por si hay contenido dinámico)
    setTimeout(forceUpdateProfile, 1000);
    
    // Ejecutar después de 2000ms (último intento)
    setTimeout(forceUpdateProfile, 2000);
    
    // Configurar observer para cambios en el DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                console.log('👀 DOM modificado, verificando perfil...');
                setTimeout(forceUpdateProfile, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ PERFIL FIX INICIALIZADO');
}

// Esperar a que cargue el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileFix);
} else {
    initProfileFix();
}

// También exportar para acceso global
window.ProfileFix = {
    forceUpdate: forceUpdateProfile,
    setupLogout: setupLogoutButton
};

console.log('✅ PERFIL FIX - Script cargado');
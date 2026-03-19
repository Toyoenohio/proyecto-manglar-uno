/**
 * ========================================
 * Authentication Module
 * Proyecto Manglar Uno
 * ========================================
 */

const Auth = {
    // Claves para localStorage
    keys: {
        user: 'manglar_user',
        session: 'manglar_session',
        timestamp: 'manglar_timestamp'
    },
    
    // Duración de sesión (7 días)
    sessionDuration: 7 * 24 * 60 * 60 * 1000,
    
    /**
     * Iniciar sesión
     */
    async login(email, pin) {
        try {
            // Validar credenciales contra la DB
            const user = await Database.validateUser(email, pin);
            
            if (!user) {
                console.warn('❌ [AUTH] Credenciales inválidas');
                return null;
            }
            
            // Guardar sesión
            this.saveSession(user);
            
            console.log(`✅ [AUTH] Login exitoso: ${user.nombre}`);
            return user;
        } catch (error) {
            console.error('❌ [AUTH] Error en login:', error);
            throw error;
        }
    },
    
    /**
     * Guardar sesión en localStorage
     */
    saveSession(user) {
        try {
            localStorage.setItem(this.keys.user, JSON.stringify(user));
            localStorage.setItem(this.keys.session, 'active');
            localStorage.setItem(this.keys.timestamp, Date.now().toString());
            
            console.log('💾 [SESSION] Sesión guardada');
        } catch (error) {
            console.error('❌ [SESSION] Error guardando sesión:', error);
        }
    },
    
    /**
     * Cerrar sesión
     */
    logout() {
        try {
            localStorage.removeItem(this.keys.user);
            localStorage.removeItem(this.keys.session);
            localStorage.removeItem(this.keys.timestamp);
            
            console.log('👋 [AUTH] Sesión cerrada');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('❌ [AUTH] Error cerrando sesión:', error);
        }
    },
    
    /**
     * Verificar si hay sesión activa
     */
    isLoggedIn() {
        try {
            const session = localStorage.getItem(this.keys.session);
            const timestamp = localStorage.getItem(this.keys.timestamp);
            
            if (!session || session !== 'active') {
                return false;
            }
            
            // Verificar si la sesión expiró
            if (timestamp) {
                const age = Date.now() - parseInt(timestamp);
                if (age > this.sessionDuration) {
                    console.log('⏰ [SESSION] Sesión expirada');
                    this.logout();
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('❌ [AUTH] Error verificando sesión:', error);
            return false;
        }
    },
    
    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        try {
            const userStr = localStorage.getItem(this.keys.user);
            
            if (!userStr) {
                return null;
            }
            
            return JSON.parse(userStr);
        } catch (error) {
            console.error('❌ [AUTH] Error obteniendo usuario:', error);
            return null;
        }
    },
    
    /**
     * Obtener nombre del usuario
     */
    getUserName() {
        const user = this.getCurrentUser();
        return user ? user.nombre : 'Usuario';
    },
    
    /**
     * Requerir autenticación (para páginas protegidas)
     */
    requireAuth() {
        if (!this.isLoggedIn()) {
            console.log('🔒 [AUTH] Redirigiendo a login');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },
    
    /**
     * Actualizar timestamp de sesión
     */
    refreshSession() {
        if (this.isLoggedIn()) {
            localStorage.setItem(this.keys.timestamp, Date.now().toString());
        }
    }
};

// Exportar para uso global
window.Auth = Auth;

// Auto-require auth si estamos en una página protegida
// (se puede deshabilitar agregando data-public="true" al body)
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const isPublic = body.getAttribute('data-public') === 'true';
    
    // Páginas públicas: login.html
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!isPublic && !isLoginPage) {
        Auth.requireAuth();
    }
});

/**
 * ========================================
 * Proyecto Manglar Uno - Academic App
 * Mobile-Only JavaScript
 * ========================================
 */

// ========================================
// Esperar a que el DOM esté cargado
// ========================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎓 Academic App - Cargada correctamente');
    
    // Verificar autenticación
    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        console.log('✅ Usuario logueado:', user.nombre);
        
        // Actualizar UI con datos del usuario
        await loadUserData(user);
    }
    
    // Inicializar funcionalidades
    initBottomNav();
    initNotificationBtn();
    initScrollAnimations();
    initPullToRefresh();
    initCardInteractions();
});

// ========================================
// Carga de Datos Dinámicos
// ========================================

/**
 * Cargar datos del usuario en la UI
 */
async function loadUserData(user) {
    try {
        // Actualizar saludo
        updateGreeting(user.nombre);
        
        // Cargar evaluaciones
        const [pendientes, calificadas] = await Promise.all([
            Database.getEvaluacionesPendientes(user.nombre),
            Database.getEvaluacionesCalificadas(user.nombre)
        ]);
        
        // Renderizar secciones
        renderProximasEntregas(pendientes);
        renderUltimasNotas(calificadas);
        
        console.log('✅ Datos cargados:', {
            pendientes: pendientes.length,
            calificadas: calificadas.length
        });
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        showError('Error cargando datos. Verifica tu conexión.');
    }
}

/**
 * Actualizar saludo con nombre del usuario
 */
function updateGreeting(nombre) {
    const greetingElement = document.querySelector('.greeting-large');
    if (greetingElement) {
        greetingElement.textContent = `Hola, ${nombre}`;
    }
}

/**
 * Renderizar Próximas Entregas (evaluaciones pendientes)
 */
function renderProximasEntregas(pendientes) {
    const container = document.querySelector('.assignments-scroll');
    if (!container) return;
    
    // Limpiar contenido estático
    container.innerHTML = '';
    
    if (pendientes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>✅ ¡No tenés entregas pendientes!</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por fecha límite
    pendientes.sort((a, b) => new Date(a.fecha_limite) - new Date(b.fecha_limite));
    
    // Renderizar cards
    pendientes.forEach(entrega => {
        const card = createAssignmentCard(entrega);
        container.appendChild(card);
    });
}

/**
 * Crear card de entrega
 */
function createAssignmentCard(entrega) {
    const card = document.createElement('div');
    card.className = 'assignment-card';
    
    // Determinar icono según tipo
    const iconClass = getIconClass(entrega.tipo_evaluacion);
    const iconSVG = getIconSVG(iconClass);
    
    // Determinar si es urgente
    const esUrgente = entrega.es_urgente === true || entrega.es_urgente === 'TRUE';
    const timeBadge = formatTimeBadge(entrega.fecha_limite);
    
    card.innerHTML = `
        <div class="assignment-icon ${iconClass}">
            ${iconSVG}
        </div>
        <div class="assignment-content">
            <h3 class="assignment-title">${entrega.titulo}</h3>
            <p class="assignment-subject">${entrega.materia}</p>
            <div class="assignment-footer">
                <span class="badge ${esUrgente ? 'badge-urgent-time' : 'badge-date'}">${timeBadge}</span>
                ${esUrgente ? '<span class="badge badge-urgent">Urgente</span>' : ''}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Renderizar Últimas Notas (evaluaciones calificadas)
 */
function renderUltimasNotas(calificadas) {
    // Buscar la sección de últimas notas (puede estar en index o notas.html)
    const container = document.querySelector('.latest-grades') || document.querySelector('.grades-list');
    if (!container) return;
    
    // Limpiar contenido estático
    container.innerHTML = '';
    
    if (calificadas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Sin notas disponibles</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por fecha (más recientes primero)
    calificadas.sort((a, b) => new Date(b.fecha_limite) - new Date(a.fecha_limite));
    
    // Tomar solo las últimas 5
    const ultimas5 = calificadas.slice(0, 5);
    
    // Renderizar items
    ultimas5.forEach(nota => {
        const item = createGradeItem(nota);
        container.appendChild(item);
    });
}

/**
 * Crear item de nota
 */
function createGradeItem(nota) {
    const item = document.createElement('div');
    item.className = 'grade-card';
    
    // Determinar color según nota
    const notaNum = parseFloat(nota.nota);
    const gradeClass = notaNum >= 18 ? 'grade-score-high' : notaNum >= 15 ? 'grade-score-medium' : 'grade-score-low';
    const iconClass = getIconClass(nota.tipo_evaluacion);
    const iconSVG = getIconSVG(iconClass);
    
    item.innerHTML = `
        <div class="grade-icon ${iconClass}">
            ${iconSVG}
        </div>
        <div class="grade-info">
            <h4 class="grade-subject-name">${nota.materia}</h4>
            <p class="grade-activity">${nota.titulo}</p>
        </div>
        <div class="grade-score ${gradeClass}">${nota.nota}</div>
    `;
    
    return item;
}

/**
 * Obtener clase de icono según tipo de evaluación
 */
function getIconClass(tipo) {
    const tipoLower = (tipo || '').toLowerCase();
    
    if (tipoLower.includes('examen') || tipoLower.includes('quiz')) return 'math';
    if (tipoLower.includes('ensayo')) return 'essay';
    if (tipoLower.includes('laboratorio')) return 'science';
    if (tipoLower.includes('proyecto')) return 'project';
    if (tipoLower.includes('tarea')) return 'homework';
    
    return 'assignment'; // Default
}

/**
 * Obtener SVG del icono
 */
function getIconSVG(iconClass) {
    const icons = {
        math: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/><line x1="7" y1="7" x2="17" y2="17"/></svg>',
        essay: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        science: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
        project: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
        homework: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"/><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        assignment: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
    };
    
    return icons[iconClass] || icons.assignment;
}

/**
 * Formatear badge de tiempo
 */
function formatTimeBadge(fechaLimite) {
    if (!fechaLimite) return 'Sin fecha';
    
    const fecha = new Date(fechaLimite);
    const ahora = new Date();
    const diffMs = fecha - ahora;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return 'Vencido';
    } else if (diffDays === 0) {
        return 'Hoy, ' + fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Mañana, ' + fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
        return `En ${diffDays} días`;
    } else {
        return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
}

// ========================================
// Bottom Navigation
// ========================================
function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    
    // Lo único que necesitamos es el feedback de vibración
    // Quitamos el e.preventDefault() para que el navegador sí cambie de página
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Feedback háptico (si está disponible en mobile)
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
}

// ========================================
// Botón de Notificaciones
// ========================================
function initNotificationBtn() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            console.log('🔔 Notificaciones abiertas');
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate([10, 30, 10]);
            }
            
            // Mostrar badge de notificaciones (ejemplo)
            const badge = this.querySelector('.notification-badge');
            if (badge) {
                badge.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    badge.style.animation = '';
                }, 500);
            }
            
            // Aquí iría la apertura del modal de notificaciones
            showAlert('🔔 Sin notificaciones nuevas', 'info');
        });
    }
}

// ========================================
// Logout
// ========================================
function initLogout() {
    // Buscar botón de logout en perfil.html o agregar en header
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('¿Seguro que querés cerrar sesión?')) {
                Auth.logout();
            }
        });
    }
}

// ========================================
// Animaciones de Scroll
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar cards
    const cards = document.querySelectorAll('.assignment-card, .grade-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ========================================
// Pull to Refresh (Simulado)
// ========================================
function initPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!isPulling) return;
        
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 0 && diff < 150) {
            // Efecto visual de pull
            document.body.style.transform = `translateY(${diff * 0.3}px)`;
            document.body.style.transition = 'transform 0.1s ease';
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        if (!isPulling) return;
        
        const diff = currentY - startY;
        
        if (diff > 100) {
            // Refresh trigger
            console.log('🔄 Refreshing...');
            showAlert('🔄 Actualizando...', 'info');
            
            // Simular carga
            setTimeout(() => {
                document.body.style.transform = '';
                document.body.style.transition = '';
                showAlert('✅ Actualizado', 'success');
            }, 1500);
        } else {
            // Reset
            document.body.style.transform = '';
            document.body.style.transition = '';
        }
        
        isPulling = false;
        startY = 0;
        currentY = 0;
    });
}

// ========================================
// Interacciones con Cards
// ========================================
function initCardInteractions() {
    // Assignment cards - click para ver detalles
    const assignmentCards = document.querySelectorAll('.assignment-card');
    
    assignmentCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.assignment-title')?.textContent;
            console.log('📚 Viendo detalles de:', title);
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }
            
            // Aquí iría la navegación al detalle
            if (title) {
                showAlert(`📖 ${title}`, 'info');
            }
        });
    });
    
    // Grade cards - click para ver detalles
    const gradeCards = document.querySelectorAll('.grade-card');
    
    gradeCards.forEach(card => {
        card.addEventListener('click', function() {
            const subject = this.querySelector('.grade-subject-name')?.textContent;
            const score = this.querySelector('.grade-score')?.textContent;
            console.log('📊 Nota de', subject, ':', score);
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }
            
            // Aquí iría la navegación al detalle
            if (subject && score) {
                showAlert(`📊 ${subject}: ${score}`, 'info');
            }
        });
    });
}

// ========================================
// Utilidades
// ========================================

// Mostrar alertas toast
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
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Funciones adicionales para el futuro
// ========================================

// Actualizar badge de notificaciones
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (count > 0) {
            badge.style.display = 'block';
            badge.setAttribute('aria-label', `${count} notificaciones`);
        } else {
            badge.style.display = 'none';
        }
    }
}

// Actualizar notas dinámicamente
function updateGrade(subject, newScore) {
    const gradeCards = document.querySelectorAll('.grade-card');
    
    gradeCards.forEach(card => {
        const subjectName = card.querySelector('.grade-subject-name')?.textContent;
        if (subjectName === subject) {
            const scoreElement = card.querySelector('.grade-score');
            if (scoreElement) {
                // Animación de actualización
                scoreElement.style.transform = 'scale(1.2)';
                scoreElement.style.transition = 'transform 0.2s ease';
                
                setTimeout(() => {
                    scoreElement.textContent = newScore;
                    scoreElement.style.transform = 'scale(1)';
                    
                    // Actualizar color según nota
                    scoreElement.classList.remove('grade-score-high', 'grade-score-medium', 'grade-score-low');
                    
                    if (newScore >= 18) {
                        scoreElement.classList.add('grade-score-high');
                    } else if (newScore >= 15) {
                        scoreElement.classList.add('grade-score-medium');
                    } else {
                        scoreElement.classList.add('grade-score-low');
                    }
                }, 200);
            }
        }
    });
}

// Agregar nueva entrega
function addAssignment(data) {
    const scrollContainer = document.querySelector('.assignments-scroll');
    
    if (scrollContainer) {
        const newCard = document.createElement('div');
        newCard.className = 'assignment-card';
        newCard.innerHTML = `
            <div class="assignment-icon ${data.iconClass || 'quiz'}">
                ${data.iconSVG || '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'}
            </div>
            <div class="assignment-content">
                <h3 class="assignment-title">${data.title}</h3>
                <p class="assignment-subject">${data.subject}</p>
                <div class="assignment-footer">
                    <span class="badge badge-date">${data.date}</span>
                </div>
            </div>
        `;
        
        // Insertar al principio
        scrollContainer.insertBefore(newCard, scrollContainer.firstChild);
        
        // Scroll automático para mostrar la nueva card
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
    }
}

// ========================================
// Service Worker Register (para PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js').then(function(registration) {
        //     console.log('ServiceWorker registration successful:', registration.scope);
        // }, function(err) {
        //     console.log('ServiceWorker registration failed:', err);
        // });
    });
}

// ========================================
// Online/Offline Detection
// ========================================
window.addEventListener('online', function() {
    console.log('🌐 Online');
    showAlert('🌐 Conexión restablecida', 'success');
});

window.addEventListener('offline', function() {
    console.log('❌ Offline');
    showAlert('❌ Sin conexión', 'error');
});

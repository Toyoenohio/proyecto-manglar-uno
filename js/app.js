/**
 * ========================================
 * Proyecto Manglar Uno - Academic App
 * Mobile-Only JavaScript
 * ========================================
 */

// ========================================
// Esperar a que el DOM esté cargado
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Academic App - Cargada correctamente');
    
    // Inicializar funcionalidades
    initBottomNav();
    initNotificationBtn();
    initScrollAnimations();
    initPullToRefresh();
    initCardInteractions();
});

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
            showAlert('🔔 3 notificaciones nuevas', 'info');
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

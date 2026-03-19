/**
 * ========================================
 * Calendario - Academic App
 * Carga dinámica de eventos desde Google Sheets
 * ========================================
 */

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📅 Calendario - Cargada correctamente');
    
    // Verificar autenticación
    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        console.log('✅ Cargando calendario para:', user.nombre);
        
        // Cargar datos del calendario
        await loadCalendarioData(user);
        
        // Inicializar funcionalidades
        initCalendarNavigation();
        initBackButton();
        initViewAllLinks();
    }
});

/**
 * Cargar datos del calendario
 */
async function loadCalendarioData(user) {
    try {
        // Mostrar loading
        showLoading();
        
        // Cargar evaluaciones del usuario
        const evaluaciones = await Database.getEvaluaciones(user.nombre);
        
        // Filtrar eventos próximos (pendientes)
        const eventosProximos = evaluaciones
            .filter(e => e.estado === 'Pendiente' && e.fecha_limite)
            .sort((a, b) => new Date(a.fecha_limite) - new Date(b.fecha_limite))
            .slice(0, 5); // Mostrar solo 5 próximos
        
        // Agrupar por día para el calendario mensual
        const eventosPorDia = agruparEventosPorDia(evaluaciones);
        
        // Actualizar UI
        updateTodayEvents(eventosPorDia);
        updateUpcomingEvents(eventosProximos);
        updateCalendarDays(eventosPorDia);
        
        console.log('✅ Calendario cargado:', {
            total: evaluaciones.length,
            proximos: eventosProximos.length,
            diasConEventos: Object.keys(eventosPorDia).length
        });
        
        // Ocultar loading
        hideLoading();
    } catch (error) {
        console.error('❌ Error cargando calendario:', error);
        showError('Error cargando calendario. Verifica tu conexión.');
        hideLoading();
    }
}

/**
 * Agrupar eventos por día
 */
function agruparEventosPorDia(evaluaciones) {
    const eventosPorDia = {};
    
    evaluaciones.forEach(evaluacion => {
        if (!evaluacion.fecha_limite) return;
        
        const fecha = new Date(evaluacion.fecha_limite);
        const diaKey = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!eventosPorDia[diaKey]) {
            eventosPorDia[diaKey] = [];
        }
        
        eventosPorDia[diaKey].push({
            ...evaluacion,
            fecha: fecha,
            hora: fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        });
    });
    
    return eventosPorDia;
}

/**
 * Actualizar eventos de hoy
 */
function updateTodayEvents(eventosPorDia) {
    const container = document.querySelector('.today-events');
    if (!container) return;
    
    const hoy = new Date();
    const hoyKey = hoy.toISOString().split('T')[0];
    const eventosHoy = eventosPorDia[hoyKey] || [];
    
    if (eventosHoy.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>🎉 No hay eventos para hoy</p>
            </div>
        `;
        return;
    }
    
    // Limpiar contenido estático
    const eventosStatic = container.querySelectorAll('.today-event');
    eventosStatic.forEach(event => event.remove());
    
    // Agregar eventos dinámicos
    eventosHoy.forEach(evento => {
        const eventElement = createTodayEventElement(evento);
        container.appendChild(eventElement);
    });
}

/**
 * Crear elemento de evento para hoy
 */
function createTodayEventElement(evento) {
    const div = document.createElement('div');
    div.className = 'today-event';
    
    const iconClass = getIconClassForEvent(evento.tipo_evaluacion);
    const badgeClass = getBadgeClassForEvent(evento.tipo_evaluacion);
    const badgeText = getBadgeTextForEvent(evento.tipo_evaluacion);
    
    div.innerHTML = `
        <div class="event-icon ${iconClass}">
            ${getIconSVGForEvent(evento.tipo_evaluacion)}
        </div>
        <div class="event-content">
            <h3 class="event-title">${evento.titulo}</h3>
            <p class="event-details">${evento.materia} · ${evento.hora}</p>
        </div>
        <div class="event-badge">
            <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
    `;
    
    return div;
}

/**
 * Actualizar eventos próximos
 */
function updateUpcomingEvents(eventosProximos) {
    const container = document.querySelector('.upcoming-events');
    if (!container) return;
    
    if (eventosProximos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📅 No hay eventos próximos</p>
            </div>
        `;
        return;
    }
    
    // Limpiar contenido estático
    const eventosStatic = container.querySelectorAll('.upcoming-event');
    eventosStatic.forEach(event => event.remove());
    
    // Agregar eventos dinámicos
    eventosProximos.forEach(evento => {
        const eventElement = createUpcomingEventElement(evento);
        container.appendChild(eventElement);
    });
}

/**
 * Crear elemento de evento próximo
 */
function createUpcomingEventElement(evento) {
    const div = document.createElement('div');
    div.className = 'upcoming-event';
    
    const fecha = new Date(evento.fecha_limite);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
    
    const badgeClass = getBadgeClassForEvent(evento.tipo_evaluacion);
    const badgeText = getBadgeTextForEvent(evento.tipo_evaluacion);
    
    // Determinar si es urgente
    const esUrgente = evento.es_urgente === true || evento.es_urgente === 'TRUE';
    const tiempoRestante = calcularTiempoRestante(fecha);
    const tiempoClass = esUrgente ? 'badge-urgent-time' : 'badge-date';
    
    div.innerHTML = `
        <div class="upcoming-date">
            <span class="upcoming-day">${dia}</span>
            <span class="upcoming-month">${mes}</span>
        </div>
        <div class="upcoming-content">
            <h3 class="upcoming-title">${evento.titulo}</h3>
            <p class="upcoming-details">${evento.materia}</p>
            <div class="upcoming-meta">
                <span class="${tiempoClass}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ${tiempoRestante}
                </span>
            </div>
        </div>
        <div class="upcoming-badge">
            <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
    `;
    
    return div;
}

/**
 * Actualizar días del calendario con eventos
 */
function updateCalendarDays(eventosPorDia) {
    const calendarDays = document.querySelectorAll('.calendar-day');
    if (!calendarDays.length) return;
    
    calendarDays.forEach(dayElement => {
        const dayNum = dayElement.querySelector('.day-number')?.textContent;
        if (!dayNum) return;
        
        // Buscar eventos para este día (simplificado - en realidad necesitaríamos mapear fechas)
        // Por ahora, solo marcamos días con eventos
        const tieneEventos = Math.random() > 0.7; // Simulación
        
        if (tieneEventos) {
            const dot = document.createElement('div');
            dot.className = 'event-dot';
            dot.style.cssText = `
                width: 4px;
                height: 4px;
                background-color: #1E6CEB;
                border-radius: 50%;
                margin: 2px auto 0;
            `;
            dayElement.appendChild(dot);
        }
    });
}

/**
 * Calcular tiempo restante para un evento
 */
function calcularTiempoRestante(fecha) {
    const ahora = new Date();
    const diffMs = fecha - ahora;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDias < 0) return 'Vencido';
    if (diffDias === 0) return 'Hoy';
    if (diffDias === 1) return 'Mañana';
    if (diffDias < 7) return `En ${diffDias} días`;
    if (diffDias < 30) return `En ${Math.floor(diffDias / 7)} semanas`;
    return `En ${Math.floor(diffDias / 30)} meses`;
}

/**
 * Obtener clase de icono para tipo de evento
 */
function getIconClassForEvent(tipo) {
    const tipos = {
        'Examen': 'exam',
        'Tarea': 'assignment',
        'Proyecto': 'project',
        'Quiz': 'quiz',
        'Presentación': 'presentation'
    };
    
    return tipos[tipo] || 'assignment';
}

/**
 * Obtener clase de badge para tipo de evento
 */
function getBadgeClassForEvent(tipo) {
    const clases = {
        'Examen': 'badge-exam',
        'Tarea': 'badge-assignment',
        'Proyecto': 'badge-project',
        'Quiz': 'badge-quiz',
        'Presentación': 'badge-presentation'
    };
    
    return clases[tipo] || 'badge-assignment';
}

/**
 * Obtener texto de badge para tipo de evento
 */
function getBadgeTextForEvent(tipo) {
    const textos = {
        'Examen': 'Examen',
        'Tarea': 'Tarea',
        'Proyecto': 'Proyecto',
        'Quiz': 'Quiz',
        'Presentación': 'Presentación'
    };
    
    return textos[tipo] || 'Evento';
}

/**
 * Obtener SVG para tipo de evento
 */
function getIconSVGForEvent(tipo) {
    const icons = {
        'exam': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
        'assignment': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        'project': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
        'quiz': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'presentation': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>'
    };
    
    const iconClass = getIconClassForEvent(tipo);
    return icons[iconClass] || icons.assignment;
}

/**
 * Inicializar navegación del calendario
 */
function initCalendarNavigation() {
    const prevBtn = document.querySelector('.calendar-nav-prev');
    const nextBtn = document.querySelector('.calendar-nav-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showAlert('⬅️ Mes anterior disponible próximamente', 'info');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showAlert('➡️ Mes siguiente disponible próximamente', 'info');
        });
    }
    
    // Días clickeables
    const calendarDays = document.querySelectorAll('.calendar-day:not(.calendar-day-other)');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            const dayNum = this.querySelector('.day-number')?.textContent;
            if (dayNum) {
                showAlert(`📅 Día ${dayNum} seleccionado`, 'info');
            }
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
 * Inicializar links "Ver todo"
 */
function initViewAllLinks() {
    const viewAllLinks = document.querySelectorAll('.link-view-all');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showAlert('📋 Vista completa disponible próximamente', 'info');
        });
    });
}

/**
 * Mostrar loading
 */
function showLoading() {
    const todayEvents = document.querySelector('.today-events');
    const upcomingEvents = document.querySelector('.upcoming-events');
    
    if (todayEvents) {
        todayEvents.style.opacity = '0.5';
    }
    if (upcomingEvents) {
        upcomingEvents.style.opacity = '0.5';
    }
}

/**
 * Ocultar loading
 */
function hideLoading() {
    const todayEvents = document.querySelector('.today-events');
    const upcomingEvents = document.querySelector('.upcoming-events');
    
    if (todayEvents) {
        todayEvents.style.opacity = '1';
    }
    if (upcomingEvents) {
        upcomingEvents.style.opacity = '1';
    }
}

/**
 * Mostrar error
 */
function showError(message) {
    // Mostrar alerta
    showAlert(message, 'error');
}

/**
 * Mostrar alerta (reutilizada)
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

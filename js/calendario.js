/**
 * ========================================
 * Pantalla de Calendario Académico
 * Funcionalidad JavaScript
 * ======================================== */

// ========================================
// Esperar a que el DOM esté cargado
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📅 Pantalla de Calendario - Cargada correctamente');
    
    // Inicializar funcionalidades
    initCalendarNavigation();
    initCalendarDays();
    initEventCards();
    initBackButton();
});

// ========================================
// Calendar Navigation (Mes anterior/siguiente)
// ========================================
function initCalendarNavigation() {
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const monthTitle = document.querySelector('.month-title');
    const monthSubtitle = document.querySelector('.month-subtitle');
    
    let currentDate = new Date(2026, 2, 13); // Marzo 2026 (mes 2 = marzo, 0-indexed)
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            navigateMonth(-1);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            navigateMonth(1);
        });
    }
    
    function navigateMonth(direction) {
        // Cambiar mes
        currentDate.setMonth(currentDate.getMonth() + direction);
        
        // Actualizar UI
        updateMonthDisplay();
        
        // Feedback háptico
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        console.log('📅 Navegando a:', getMonthName(currentDate.getMonth()), currentDate.getFullYear());
        showAlert(`📅 ${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`, 'info');
    }
    
    function updateMonthDisplay() {
        if (monthTitle) {
            monthTitle.textContent = `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
        }
        
        if (monthSubtitle) {
            // Calcular semana del año
            const weekNumber = getWeekNumber(currentDate);
            monthSubtitle.textContent = `Semana ${weekNumber}`;
        }
        
        // Actualizar día actual en el calendario
        updateTodayHighlight();
    }
    
    function getMonthName(monthIndex) {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[monthIndex];
    }
    
    function getWeekNumber(date) {
        // Algoritmo simple para calcular semana del año
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    // Inicializar display
    updateMonthDisplay();
}

// ========================================
// Calendar Days Interaction
// ========================================
function initCalendarDays() {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            const dayNumber = this.querySelector('.day-number')?.textContent;
            const currentMonth = document.querySelector('.month-title')?.textContent;
            
            if (dayNumber && currentMonth) {
                selectDay(parseInt(dayNumber), currentMonth);
            }
        });
    });
}

function selectDay(dayNumber, monthYear) {
    console.log('📅 Día seleccionado:', dayNumber, monthYear);
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }
    
    // Remover selección anterior
    const previouslySelected = document.querySelector('.calendar-day.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }
    
    // Encontrar y seleccionar el día
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
    calendarDays.forEach(day => {
        const dayNum = day.querySelector('.day-number')?.textContent;
        if (parseInt(dayNum) === dayNumber) {
            day.classList.add('selected');
            
            // Scroll suave a los eventos del día
            const eventsSection = document.querySelector('.section');
            if (eventsSection) {
                eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    // Actualizar título de "Eventos de Hoy"
    updateTodayEventsTitle(dayNumber, monthYear);
    
    // Mostrar eventos del día seleccionado (simulado)
    showDayEvents(dayNumber, monthYear);
}

function updateTodayEventsTitle(dayNumber, monthYear) {
    const todayDateElement = document.querySelector('.today-date');
    const sectionTitle = document.querySelector('.section-title');
    
    if (todayDateElement) {
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const today = new Date();
        const selectedDate = new Date(`${monthYear.split(' ')[0]} ${dayNumber}, ${monthYear.split(' ')[1]}`);
        
        // Verificar si es hoy
        const isToday = 
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear();
        
        const dayName = dayNames[selectedDate.getDay()];
        const monthName = monthYear.split(' ')[0];
        
        if (isToday) {
            todayDateElement.textContent = `${dayName}, ${dayNumber} de ${monthName}`;
            if (sectionTitle) {
                sectionTitle.textContent = 'Eventos de Hoy';
            }
        } else {
            todayDateElement.textContent = `${dayName}, ${dayNumber} de ${monthName}`;
            if (sectionTitle) {
                sectionTitle.textContent = `Eventos del ${dayNumber}`;
            }
        }
    }
}

function showDayEvents(dayNumber, monthYear) {
    console.log(`📋 Mostrando eventos para ${dayNumber} de ${monthYear}`);
    
    // Aquí iría la lógica para cargar eventos del día desde una API
    // Por ahora, mostramos un mensaje
    showAlert(`📅 Eventos del ${dayNumber} de ${monthYear}`, 'info');
}

function updateTodayHighlight() {
    const today = new Date();
    const currentMonth = document.querySelector('.month-title')?.textContent;
    
    if (!currentMonth) return;
    
    const [monthName, year] = currentMonth.split(' ');
    const monthIndex = getMonthIndex(monthName);
    
    // Remover highlight de "today" anterior
    const previousToday = document.querySelector('.calendar-day.today');
    if (previousToday) {
        previousToday.classList.remove('today');
    }
    
    // Si estamos en el mes actual, marcar el día de hoy
    if (monthIndex === today.getMonth() && parseInt(year) === today.getFullYear()) {
        const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
        calendarDays.forEach(day => {
            const dayNum = day.querySelector('.day-number')?.textContent;
            if (parseInt(dayNum) === today.getDate()) {
                day.classList.add('today');
            }
        });
    }
}

function getMonthIndex(monthName) {
    const months = {
        'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
        'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
    return months[monthName] || 0;
}

// ========================================
// Event Cards Interaction
// ========================================
function initEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    const upcomingEvents = document.querySelectorAll('.upcoming-event');
    
    eventCards.forEach(card => {
        card.addEventListener('click', function() {
            const eventTitle = this.querySelector('.event-title')?.textContent;
            const eventTime = this.querySelector('.event-hour')?.textContent;
            
            if (eventTitle && eventTime) {
                showEventDetails(eventTitle, eventTime);
            }
        });
    });
    
    upcomingEvents.forEach(event => {
        event.addEventListener('click', function() {
            const eventTitle = this.querySelector('.upcoming-title')?.textContent;
            const eventDate = this.querySelector('.upcoming-day')?.textContent;
            const eventMonth = this.querySelector('.upcoming-month')?.textContent;
            
            if (eventTitle && eventDate && eventMonth) {
                showUpcomingEventDetails(eventTitle, `${eventDate} ${eventMonth}`);
            }
        });
    });
}

function showEventDetails(title, time) {
    console.log('📖 Viendo detalles del evento:', title);
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }
    
    // Aquí iría un modal o navegación a detalles del evento
    showAlert(`📖 ${title}\n⏰ ${time}`, 'info');
}

function showUpcomingEventDetails(title, date) {
    console.log('📅 Viendo detalles del evento próximo:', title);
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }
    
    // Aquí iría un modal o navegación a detalles del evento
    showAlert(`📅 ${title}\n🗓️ ${date}`, 'info');
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

// Simular carga de eventos desde API
function loadEventsFromAPI(month, year) {
    console.log(`📡 Cargando eventos para ${month} ${year} desde API...`);
    
    // Esto sería una llamada real a una API
    // Por ahora, retornamos datos de ejemplo
    return new Promise((resolve) => {
        setTimeout(() => {
            const sampleEvents = [
                {
                    id: 1,
                    title: 'Examen de Matemáticas',
                    type: 'exam',
                    date: `${year}-${getMonthNumber(month)}-15`,
                    time: '09:00',
                    duration: '2h',
                    location: 'Aula 302',
                    subject: 'MAT'
                },
                {
                    id: 2,
                    title: 'Entrega de Proyecto',
                    type: 'assignment',
                    date: `${year}-${getMonthNumber(month)}-17`,
                    time: '23:59',
                    duration: '24h',
                    location: 'Plataforma Virtual',
                    subject: 'CIE'
                }
            ];
            resolve(sampleEvents);
        }, 500);
    });
}

function getMonthNumber(monthName) {
    const months = {
        'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04',
        'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
        'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
    };
    return months[monthName] || '01';
}

// ========================================
// Utilidades Específicas de Calendario
// ========================================

// Agregar nuevo evento (para integración futura con API)
function addCalendarEvent(eventData) {
    console.log('➕ Agregando evento al calendario:', eventData);
    
    // Aquí iría la lógica para agregar el evento visualmente
    // y posiblemente sincronizar con una API
    
    showAlert('✅ Evento agregado al calendario', 'success');
}

// Exportar calendario (iCal, Google Calendar, etc.)
function exportCalendar(format = 'ical') {
    console.log(`📤 Exportando calendario en formato ${format}`);
    
    // Aquí iría la lógica de exportación
    showAlert(`📤 Exportando calendario (${format})...`, 'info');
    
    // Simular exportación
    setTimeout(() => {
        showAlert('✅ Calendario exportado correctamente', 'success');
    }, 1500);
}

// Sincronizar con calendario externo
function syncWithExternalCalendar(provider = 'google') {
    console.log(`🔄 Sincronizando con ${provider} Calendar`);
    
    // Aquí iría la lógica de sincronización OAuth
    showAlert(`🔄 Conectando con ${provider} Calendar...`, 'info');
    
    // Simular conexión
    setTimeout(() => {
        showAlert(`✅ Sincronizado con ${provider} Calendar`, 'success');
    }, 2000);
}

// ========================================
// Filtros y Búsqueda (Para futura implementación)
// ========================================

function initEventFilters() {
    // Inicializar filtros por tipo de evento, materia, etc.
    console.log('🔍 Inicializando filtros de eventos');
}

function filterEventsByType(eventType) {
    // Filtrar eventos por tipo (examen, tarea, clase, etc.)
    console.log(`🔍 Filtrando eventos por tipo: ${eventType}`);
}

function searchEvents(query) {
    // Buscar eventos por título, materia, etc.
    console.log(`🔍 Buscando eventos: "${query}"`);
}

// ========================================
// Notificaciones de Eventos (Para futura implementación)
// ========================================

function scheduleEventNotifications() {
    // Programar notificaciones para eventos próximos
    console.log('🔔 Programando notificaciones de eventos');
}

function checkUpcomingEvents() {
    // Verificar eventos próximos y mostrar recordatorios
    console.log('⏰ Verificando eventos próximos');
    
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    // Lógica para verificar eventos en la próxima hora
    // ...
}

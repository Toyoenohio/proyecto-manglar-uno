/**
 * ========================================
 * Notas - Academic App
 * Carga dinámica de evaluaciones
 * ========================================
 */

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📊 Notas - Cargada correctamente');
    console.log('🔍 Verificando autenticación...');
    
    // Verificar autenticación
    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        console.log('✅ Usuario autenticado:', user);
        console.log('📝 Cargando notas para:', user.nombre);
        
        // Cargar datos
        await loadNotasData(user);
        
        // Inicializar funcionalidades
        initSearch();
        initCourseToggles();
        initBackButton();
    } else {
        console.log('❌ Usuario NO autenticado');
        console.log('🔑 Redirigiendo a login...');
        // Auth.requireAuth(); // Comentado temporalmente para debug
    }
});

/**
 * Cargar datos de notas del usuario
 */
async function loadNotasData(user) {
    try {
        // Mostrar loading
        showLoading();
        
        // Cargar todas las evaluaciones del usuario
        const evaluaciones = await Database.getEvaluaciones(user.nombre);
        
        // Separar por estado
        const calificadas = evaluaciones.filter(e => e.estado === 'Calificado' && e.nota);
        const pendientes = evaluaciones.filter(e => e.estado === 'Pendiente');
        
        // Calcular estadísticas
        const promedio = await calcularPromedio(calificadas);
        const materias = [...new Set(evaluaciones.map(e => e.materia))];
        
        // Actualizar UI
        updateSummaryCards(promedio, materias.length, evaluaciones.length);
        renderCourseList(evaluaciones, calificadas);
        
        console.log('✅ Datos de notas cargados:', {
            total: evaluaciones.length,
            calificadas: calificadas.length,
            pendientes: pendientes.length,
            promedio: promedio,
            materias: materias.length
        });
        
        // Ocultar loading
        hideLoading();
    } catch (error) {
        console.error('❌ Error cargando notas:', error);
        showError('Error cargando notas. Verifica tu conexión.');
        hideLoading();
    }
}

/**
 * Calcular promedio de evaluaciones calificadas
 */
function calcularPromedio(calificadas) {
    if (calificadas.length === 0) return 0;
    
    const suma = calificadas.reduce((acc, e) => acc + (parseFloat(e.nota) || 0), 0);
    return Math.round((suma / calificadas.length) * 10) / 10; // Redondear a 1 decimal
}

/**
 * Actualizar tarjetas de resumen
 */
function updateSummaryCards(promedio, materiasCount, evaluacionesCount) {
    // Promedio
    const promedioCard = document.querySelector('.summary-card-primary .summary-value');
    if (promedioCard) {
        promedioCard.textContent = promedio.toFixed(1);
    }
    
    // Materias
    const materiasCard = document.querySelectorAll('.summary-card')[1];
    if (materiasCard) {
        const valueElement = materiasCard.querySelector('.summary-value');
        if (valueElement) {
            valueElement.textContent = materiasCount;
        }
    }
    
    // Créditos (usamos evaluaciones como placeholder)
    const creditosCard = document.querySelectorAll('.summary-card')[2];
    if (creditosCard) {
        const valueElement = creditosCard.querySelector('.summary-value');
        if (valueElement) {
            valueElement.textContent = evaluacionesCount;
        }
    }
}

/**
 * Renderizar lista de cursos con evaluaciones
 */
function renderCourseList(evaluaciones, calificadas) {
    console.log('📚 Renderizando lista de cursos...');
    console.log('📊 Total evaluaciones:', evaluaciones.length);
    console.log('📊 Evaluaciones calificadas:', calificadas.length);
    
    const container = document.querySelector('.course-list');
    if (!container) {
        console.log('❌ No se encontró .course-list container');
        return;
    }
    
    console.log('✅ Container encontrado, limpiando contenido estático...');
    
    // Limpiar contenido estático
    container.innerHTML = '';
    
    if (evaluaciones.length === 0) {
        console.log('ℹ️ No hay evaluaciones, mostrando empty state');
        container.innerHTML = `
            <div class="empty-state">
                <p>📚 No hay evaluaciones registradas</p>
            </div>
        `;
        return;
    }
    
    // Agrupar evaluaciones por materia
    const evaluacionesPorMateria = {};
    evaluaciones.forEach(e => {
        if (!evaluacionesPorMateria[e.materia]) {
            evaluacionesPorMateria[e.materia] = [];
        }
        evaluacionesPorMateria[e.materia].push(e);
    });
    
    console.log('📊 Materias encontradas:', Object.keys(evaluacionesPorMateria));
    
    // Crear cards por materia
    Object.entries(evaluacionesPorMateria).forEach(([materia, evals], index) => {
        console.log(`📝 Creando card para materia: ${materia} (${evals.length} evaluaciones)`);
        const card = createCourseCard(materia, evals, calificadas);
        container.appendChild(card);
    });
    
    console.log('✅ Lista de cursos renderizada correctamente');
}

/**
 * Crear card de materia con evaluaciones
 */
function createCourseCard(materia, evaluaciones, todasCalificadas) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.dataset.course = materia.toLowerCase().replace(/\s+/g, '-');
    
    // Calcular promedio de la materia
    const calificadasMateria = evaluaciones.filter(e => e.estado === 'Calificado' && e.nota);
    const promedioMateria = calificadasMateria.length > 0 
        ? calificadasMateria.reduce((acc, e) => acc + parseFloat(e.nota), 0) / calificadasMateria.length
        : 0;
    
    // Determinar clase del badge según promedio
    const badgeClass = promedioMateria >= 18 ? 'grade-badge-high' : 
                      promedioMateria >= 15 ? 'grade-badge-medium' : 'grade-badge-low';
    
    // Determinar icono
    const iconClass = getIconClassForMateria(materia);
    const iconSVG = getIconSVG(iconClass);
    
    // Crear HTML de evaluaciones
    const evaluacionesHTML = evaluaciones.map(e => createEvaluationItem(e)).join('');
    
    card.innerHTML = `
        <div class="course-header">
            <div class="course-left">
                <div class="course-icon ${iconClass}">
                    ${iconSVG}
                </div>
                <div class="course-info">
                    <h3 class="course-name">${materia}</h3>
                    <p class="course-professor">${evaluaciones.length} evaluaciones</p>
                </div>
            </div>
            <div class="course-right">
                ${promedioMateria > 0 ? `<span class="grade-badge ${badgeClass}">${promedioMateria.toFixed(1)}</span>` : ''}
                <button class="expand-btn" aria-label="Expandir/Contraer">
                    <svg class="course-toggle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="course-details">
            <div class="evaluations-list">
                ${evaluacionesHTML}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Crear item de evaluación individual
 */
function createEvaluationItem(evaluacion) {
    const notaNum = parseFloat(evaluacion.nota) || 0;
    const gradeClass = notaNum >= 18 ? 'grade-badge-high' : 
                      notaNum >= 15 ? 'grade-badge-medium' : 'grade-badge-low';
    
    const fecha = evaluacion.fecha_limite ? new Date(evaluacion.fecha_limite) : null;
    const fechaFormateada = fecha ? fecha.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
    }) : 'Sin fecha';
    
    const estadoBadge = evaluacion.estado === 'Calificado' 
        ? `<span class="badge badge-grade">Calificado</span>`
        : `<span class="badge badge-pending">Pendiente</span>`;
    
    const notaHTML = evaluacion.estado === 'Calificado' && evaluacion.nota
        ? `<span class="evaluation-grade ${gradeClass}">${evaluacion.nota}</span>`
        : '';
    
    return `
        <div class="evaluation-item">
            <div class="evaluation-left">
                <span class="evaluation-type">${evaluacion.tipo_evaluacion}</span>
                <h4 class="evaluation-title">${evaluacion.titulo}</h4>
            </div>
            <div class="evaluation-right">
                <div class="evaluation-meta">
                    <span class="evaluation-date">${fechaFormateada}</span>
                    ${estadoBadge}
                </div>
                ${notaHTML}
            </div>
        </div>
    `;
}

/**
 * Obtener clase de icono para materia
 */
function getIconClassForMateria(materia) {
    const materiaLower = materia.toLowerCase();
    
    if (materiaLower.includes('matemática') || materiaLower.includes('cálculo')) return 'math';
    if (materiaLower.includes('física')) return 'science';
    if (materiaLower.includes('química')) return 'science';
    if (materiaLower.includes('historia') || materiaLower.includes('sociales')) return 'essay';
    if (materiaLower.includes('literatura') || materiaLower.includes('español')) return 'essay';
    if (materiaLower.includes('programación') || materiaLower.includes('computación')) return 'project';
    
    return 'assignment';
}

/**
 * Obtener SVG del icono (reutilizado de app.js)
 */
function getIconSVG(iconClass) {
    const icons = {
        math: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/><line x1="7" y1="7" x2="17" y2="17"/></svg>',
        essay: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        science: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
        project: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
        assignment: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
    };
    
    return icons[iconClass] || icons.assignment;
}

/**
 * Inicializar búsqueda
 */
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const courseName = card.querySelector('.course-name').textContent.toLowerCase();
            const shouldShow = courseName.includes(query) || query === '';
            card.style.display = shouldShow ? '' : 'none';
        });
    });
}

/**
 * Inicializar toggles de cursos (Corregido)
 */
function initCourseToggles() {
    // Escuchar clics en todo el documento para delegación de eventos
    document.addEventListener('click', function(e) {
        // Buscar si se hizo clic en el botón expand-btn o en la flecha course-toggle
        const toggleBtn = e.target.closest('.expand-btn') || e.target.closest('.course-toggle');
        if (!toggleBtn) return;
        
        // Encontrar la tarjeta padre
        const card = toggleBtn.closest('.course-card');
        if (!card) return;
        
        // Prevenir comportamiento por defecto
        e.preventDefault();
        
        // Alternar la clase que expande el contenido
        card.classList.toggle('course-card-expanded');
        
        // Rotar el SVG dentro del botón
        const svg = toggleBtn.querySelector('svg') || toggleBtn;
        if (svg && svg.tagName.toLowerCase() === 'svg') {
            svg.style.transform = card.classList.contains('course-card-expanded') 
                ? 'rotate(180deg)' 
                : 'rotate(0deg)';
            svg.style.transition = 'transform 0.3s ease';
        }
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
    const container = document.querySelector('.course-list');
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Cargando notas...</p>
            </div>
        `;
    }
}

/**
 * Ocultar loading
 */
function hideLoading() {
    // El contenido se reemplaza automáticamente
}

/**
 * Mostrar error
 */
function showError(message) {
    const container = document.querySelector('.course-list');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <p>⚠️ ${message}</p>
                <button class="retry-btn" onclick="window.location.reload()">Reintentar</button>
            </div>
        `;
    }
}

// Agregar estilos dinámicos
const style = document.createElement('style');
style.textContent = `
    .loading-state {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }
    
    .loading-spinner {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 3px solid #e0e0e0;
        border-radius: 50%;
        border-top-color: #1E6CEB;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
    }
    
    .error-state {
        text-align: center;
        padding: 40px 20px;
        color: #E53E3E;
    }
    
    .retry-btn {
        background: #1E6CEB;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        margin-top: 16px;
        cursor: pointer;
    }
    
    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }
    
    .evaluation-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .evaluation-item:last-child {
        border-bottom: none;
    }
    
    .evaluation-left {
        flex: 1;
    }
    
    .evaluation-type {
        font-size: 12px;
        color: #666;
        text-transform: uppercase;
        font-weight: 600;
    }
    
    .evaluation-title {
        font-size: 14px;
        font-weight: 500;
        margin-top: 4px;
    }
    
    .evaluation-right {
        text-align: right;
    }
    
    .evaluation-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: flex-end;
        margin-bottom: 8px;
    }
    
    .evaluation-date {
        font-size: 12px;
        color: #666;
    }
    
    .evaluation-grade {
        font-size: 16px;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 12px;
        display: inline-block;
    }
    
    .badge-grade {
        background: #059669;
        color: white;
    }
    
    .badge-pending {
        background: #F59E0B;
        color: white;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

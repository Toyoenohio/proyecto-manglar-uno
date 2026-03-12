/**
 * ========================================
 * Pantalla de Notas - Mis Calificaciones
 * Funcionalidad JavaScript
 * ======================================== */

// ========================================
// Esperar a que el DOM esté cargado
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Pantalla de Notas - Cargada correctamente');
    
    // Inicializar funcionalidades
    initCourseCards();
    initSearch();
    initSimulatorBanner();
});

// ========================================
// Course Cards - Expandir/Colapsar
// ========================================
function initCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const header = card.querySelector('.course-header');
        const expandBtn = card.querySelector('.expand-btn');
        
        if (header) {
            header.addEventListener('click', function(e) {
                // Prevenir que el botón de expandir dispare dos eventos
                if (e.target.closest('.expand-btn')) {
                    return;
                }
                
                toggleCourseCard(card);
            });
        }
        
        if (expandBtn) {
            expandBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleCourseCard(card);
            });
        }
    });
}

function toggleCourseCard(card) {
    const isExpanded = card.classList.contains('course-card-expanded');
    const courseName = card.querySelector('.course-name')?.textContent;
    
    if (isExpanded) {
        // Colapsar
        card.classList.remove('course-card-expanded');
        const expandBtnSvg = card.querySelector('.expand-btn svg');
        if (expandBtnSvg) {
            expandBtnSvg.style.transform = 'rotate(0deg)';
        }
        console.log('📚 Colapsando:', courseName);
    } else {
        // Opcional: Colapsar todas las demás primero
        // closeAllOtherCards(card);
        
        // Expandir
        card.classList.add('course-card-expanded');
        const expandBtnSvg = card.querySelector('.expand-btn svg');
        if (expandBtnSvg) {
            expandBtnSvg.style.transform = 'rotate(180deg)';
        }
        console.log('📖 Expandiendo:', courseName);
    }
    
    // Feedback háptico
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

function closeAllOtherCards(currentCard) {
    const allCards = document.querySelectorAll('.course-card');
    allCards.forEach(card => {
        if (card !== currentCard && card.classList.contains('course-card-expanded')) {
            card.classList.remove('course-card-expanded');
            const expandBtnSvg = card.querySelector('.expand-btn svg');
            if (expandBtnSvg) {
                expandBtnSvg.style.transform = 'rotate(0deg)';
            }
        }
    });
}

// ========================================
// Search Functionality
// ========================================
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterCourses(searchTerm);
        });
        
        // Búsqueda en tiempo real mientras se escribe
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                if (searchTerm) {
                    console.log('🔍 Buscando:', searchTerm);
                    showAlert(`🔍 Buscando: "${searchTerm}"`, 'info');
                }
            }
        });
    }
}

function filterCourses(searchTerm) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const courseName = card.querySelector('.course-name')?.textContent.toLowerCase() || '';
        const courseProfessor = card.querySelector('.course-professor')?.textContent.toLowerCase() || '';
        
        const matchesSearch = courseName.includes(searchTerm) || courseProfessor.includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar mensaje si no hay resultados
    const visibleCards = document.querySelectorAll('.course-card[style="display: block;"]');
    const noResultsMsg = document.querySelector('.no-results-message');
    
    if (visibleCards.length === 0 && searchTerm) {
        if (!noResultsMsg) {
            showNoResultsMessage();
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

function showNoResultsMessage() {
    const courseList = document.querySelector('.course-list');
    if (!courseList) return;
    
    const noResultsMsg = document.createElement('div');
    noResultsMsg.className = 'no-results-message';
    noResultsMsg.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--gris-medio);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 16px; opacity: 0.5;">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
            </svg>
            <p style="font-size: 16px; font-weight: 500; margin: 0 0 8px;">No se encontraron materias</p>
            <p style="font-size: 14px; margin: 0;">Intentá con otro término de búsqueda</p>
        </div>
    `;
    courseList.appendChild(noResultsMsg);
}

// ========================================
// Simulator Banner
// ========================================
function initSimulatorBanner() {
    const simulatorBanner = document.querySelector('.simulator-banner');
    
    if (simulatorBanner) {
        simulatorBanner.addEventListener('click', function() {
            console.log('📊 Abriendo simulador de promedio');
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate([10, 30, 10]);
            }
            
            // Aquí iría la navegación al simulador
            showAlert('🧮 Abriendo simulador...', 'info');
            
            // Ejemplo: mostrar un modal o navegar a otra página
            setTimeout(() => {
                showAlert('✨ Función próximamente', 'info');
            }, 1000);
        });
    }
}

// ========================================
// Botón de Notificaciones (Override del app.js)
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

// Inicializar botón de volver
initBackButton();

// ========================================
// Utilidades Específicas de Notas
// ========================================

// Actualizar una nota específica
function updateAssessmentScore(courseName, assessmentName, newScore) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const course = card.querySelector('.course-name')?.textContent;
        if (course === courseName) {
            const assessments = card.querySelectorAll('.assessment-item');
            assessments.forEach(assessment => {
                const name = assessment.querySelector('.assessment-name')?.textContent;
                if (name === assessmentName) {
                    const scoreElement = assessment.querySelector('.assessment-score');
                    if (scoreElement) {
                        // Animación de actualización
                        scoreElement.style.transform = 'scale(1.2)';
                        scoreElement.style.transition = 'transform 0.2s ease';
                        
                        setTimeout(() => {
                            scoreElement.textContent = newScore;
                            scoreElement.style.transform = 'scale(1)';
                            
                            // Actualizar color según nota
                            scoreElement.classList.remove('assessment-score-high', 'assessment-score-medium', 'assessment-score-low', 'assessment-score-pending');
                            
                            if (newScore === 'Pendiente') {
                                scoreElement.classList.add('assessment-score-pending');
                            } else {
                                const numScore = parseFloat(newScore);
                                if (numScore >= 16) {
                                    scoreElement.classList.add('assessment-score-high');
                                } else if (numScore >= 14) {
                                    scoreElement.classList.add('assessment-score-medium');
                                } else {
                                    scoreElement.classList.add('assessment-score-low');
                                }
                            }
                        }, 200);
                    }
                }
            });
            
            // Actualizar nota principal del curso
            updateCourseGrade(card);
        }
    });
}

// Recalcular nota del curso basado en las evaluaciones
function updateCourseGrade(courseCard) {
    const assessments = courseCard.querySelectorAll('.assessment-item');
    let totalWeight = 0;
    let weightedSum = 0;
    
    assessments.forEach(assessment => {
        const weightText = assessment.querySelector('.assessment-weight')?.textContent || '(0%)';
        const weight = parseInt(weightText.replace(/[()%]/g, '')) / 100;
        const scoreText = assessment.querySelector('.assessment-score')?.textContent || '0';
        const score = parseFloat(scoreText);
        
        if (!isNaN(score) && !isNaN(weight)) {
            weightedSum += score * weight;
            totalWeight += weight;
        }
    });
    
    if (totalWeight > 0) {
        const finalGrade = (weightedSum / totalWeight).toFixed(1);
        const gradeBadge = courseCard.querySelector('.grade-badge');
        
        if (gradeBadge) {
            // Animación de actualización
            gradeBadge.style.transform = 'scale(1.2)';
            gradeBadge.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                gradeBadge.textContent = finalGrade;
                gradeBadge.style.transform = 'scale(1)';
                
                // Actualizar color
                gradeBadge.classList.remove('grade-badge-high', 'grade-badge-medium', 'grade-badge-low');
                
                const numGrade = parseFloat(finalGrade);
                if (numGrade >= 16) {
                    gradeBadge.classList.add('grade-badge-high');
                } else if (numGrade >= 14) {
                    gradeBadge.classList.add('grade-badge-medium');
                } else {
                    gradeBadge.classList.add('grade-badge-low');
                }
            }, 200);
        }
    }
}

// ========================================
// Exportar/Importar Datos (Futuro)
// ========================================

// Exportar notas a JSON
function exportGrades() {
    const grades = [];
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const courseName = card.querySelector('.course-name')?.textContent;
        const professor = card.querySelector('.course-professor')?.textContent;
        const grade = card.querySelector('.grade-badge')?.textContent;
        
        const assessments = [];
        card.querySelectorAll('.assessment-item').forEach(assessment => {
            assessments.push({
                name: assessment.querySelector('.assessment-name')?.textContent,
                weight: assessment.querySelector('.assessment-weight')?.textContent,
                score: assessment.querySelector('.assessment-score')?.textContent
            });
        });
        
        grades.push({
            course: courseName,
            professor: professor,
            grade: grade,
            assessments: assessments
        });
    });
    
    console.log('📊 Notas exportadas:', grades);
    return JSON.stringify(grades, null, 2);
}

// ========================================
// Stats Update (Opcional)
// ========================================

// Actualizar tarjetas de resumen
function updateSummaryCards(average, subjects, credits) {
    const summaryValues = document.querySelectorAll('.summary-value');
    
    if (summaryValues[0]) {
        summaryValues[0].textContent = average.toFixed(1);
    }
    if (summaryValues[1]) {
        summaryValues[1].textContent = subjects;
    }
    if (summaryValues[2]) {
        summaryValues[2].textContent = credits;
    }
}

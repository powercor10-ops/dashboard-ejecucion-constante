// ==========================================
// Dashboard de Ejecución Constante Pro
// Con todas las 12 mejoras implementadas
// ==========================================

class ExecutionDashboardPro {
    constructor() {
        this.timers = {};
        this.intervals = {};
        this.practiceInterval = null;
        this.breathingInterval = null;
        this.pomodoroState = {};
        this.focusModeActive = false;
        this.theme = 'dark';
        
        // Block configurations
        this.blockConfig = {
            1: { name: 'Bloque 1: Anclaje y Disciplina', targetMinutes: 75, energyLevel: 'Alta', examples: ['Gimnasio', 'Ejercicio', 'Rutina matutina'] },
            2: { name: 'Bloque 2: La Tarea Pesada', targetMinutes: 37, energyLevel: 'Media-Alta', examples: ['CMM: Estudio', 'Tareas difíciles', 'Análisis profundo'] },
            3: { name: 'Bloque 3: El Alto Impacto', targetMinutes: 75, energyLevel: 'Media', examples: ['Trading: Análisis', 'Proyectos importantes', 'Decisiones clave'] },
            4: { name: 'Bloque 4: La Creación Ligera', targetMinutes: 52, energyLevel: 'Media-Baja', examples: ['IA + 3D: Creación', 'Contenido', 'Proyectos creativos'] },
            5: { name: 'Bloque 5: El Cierre Estratégico', targetMinutes: 17, energyLevel: 'Baja', examples: ['Lectura', 'Reflexión', 'Planificación'] }
        };
        
        // Weekly plan data
        this.weeklyPlan = [
            { day: 'monday', name: 'Lunes', energy: 'Alta', primary: 'Trading: Análisis y Backtesting', secondary: 'CMM: Revisión de la Semana Anterior', guidance: 'Usa la energía renovada del inicio de semana para el análisis riguroso.' },
            { day: 'tuesday', name: 'Martes', energy: 'Media', primary: 'Impresión 3D: Prototipo y Diseño', secondary: 'Contenido con IA: Generación de Ideas', guidance: 'Día ideal para la ejecución física y la resolución de problemas técnicos.' },
            { day: 'wednesday', name: 'Miércoles', energy: 'Baja', primary: 'CMM: Estudio Profundo de Módulo', secondary: 'Trading: Psicología y Diario', guidance: 'Día central de la semana. Tarea de Baja Energía/Alta Importancia.' },
            { day: 'thursday', name: 'Jueves', energy: 'Media', primary: 'Contenido con IA: Producción y Guion', secondary: 'Impresión 3D: Mantenimiento/Ventas', guidance: 'Día para la creación de contenido y práctica de la Acción Imperfecta.' },
            { day: 'friday', name: 'Viernes', energy: 'Media', primary: 'Trading: Cierre de Semana y Planificación', secondary: 'CMM: Práctica de Ejercicios', guidance: 'Momento para la reflexión y la toma de decisiones finales.' },
            { day: 'saturday', name: 'Sábado', energy: 'Alta', primary: 'Día de Integración y Creación', secondary: 'Lectura: Revisión de Notas', guidance: 'Dedicar tiempo a un proyecto grande de 3D o producción masiva de IA.' },
            { day: 'sunday', name: 'Domingo', energy: 'Baja', primary: 'Descanso y Planificación Semanal', secondary: 'Gimnasio: Movilidad/Estiramiento', guidance: 'Día para la recarga emocional y la planificación de la semana siguiente.' }
        ];
        
        // Achievements definitions
        this.achievements = [
            { id: 'first_day', name: 'Primer Paso', icon: '🎯', description: 'Completar tu primer día', condition: (stats) => stats.daysCompleted >= 1 },
            { id: 'week_warrior', name: 'Guerrero Semanal', icon: '🔥', description: '7 días consecutivos', condition: (stats) => stats.currentStreak >= 7 },
            { id: 'consistency_king', name: 'Rey de la Consistencia', icon: '👑', description: '30 días consecutivos', condition: (stats) => stats.currentStreak >= 30 },
            { id: 'all_blocks', name: 'Jornada Completa', icon: '✨', description: 'Completar los 5 bloques en un día', condition: (stats) => stats.blocksCompletedToday >= 5 },
            { id: 'early_bird', name: 'Madrugador', icon: '🌅', description: 'Iniciar Bloque 1 antes de las 7am', condition: (stats) => stats.earlyStarts >= 1 },
            { id: 'perfectionist', name: 'Perfección Imperfecta', icon: '💯', description: 'Alcanzar 100% en todas las áreas semanales', condition: (stats) => stats.weeklyPerfect >= 1 },
            { id: 'focus_master', name: 'Maestro del Foco', icon: '🧘', description: 'Usar Modo Foco 10 veces', condition: (stats) => stats.focusModeUses >= 10 },
            { id: 'note_taker', name: 'Cronista', icon: '📝', description: 'Escribir notas en 20 bloques', condition: (stats) => stats.notesWritten >= 20 }
        ];
        
        this.init();
    }
    
    // ==========================================
    // Initialization
    // ==========================================
    
    init() {
        this.loadState();
        this.setupDate();
        this.generateBlocksHTML();
        this.generateWeeklyPlanHTML();
        this.setupBlockTimers();
        this.setupPresencePractice();
        this.setupWeeklyTracking();
        this.setupNotifications();
        this.setupModals();
        this.setupThemeToggle();
        this.setupFloatingWidget();
        this.highlightActiveDay();
        this.updateAchievementsBanner();
        this.checkAndShowAchievements();
        
        // Auto-save every 10 seconds
        setInterval(() => this.saveState(), 10000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => this.saveState());
        
        // Check for Sunday (weekly review reminder)
        if (new Date().getDay() === 0) {
            setTimeout(() => {
                this.showNotification('info', 'Revisión Semanal', 'Es domingo. ¿Quieres realizar tu revisión semanal guiada?');
            }, 5000);
        }
    }
    
    // ==========================================
    // HTML Generation
    // ==========================================
    
    generateBlocksHTML() {
        const grid = document.getElementById('blocks-grid');
        grid.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const config = this.blockConfig[i];
            const energyClass = this.getEnergyClass(config.energyLevel);
            
            const blockHTML = `
                <div class="block-card" data-block="${i}">
                    <div class="block-header">
                        <h3 class="block-title">${config.name}</h3>
                        <div class="block-actions">
                            <button class="btn-block-action" data-action="pomodoro" data-block="${i}" title="Modo Pomodoro">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </button>
                            <button class="btn-block-action" data-action="focus" data-block="${i}" title="Modo Foco">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                        </div>
                        <span class="energy-tag ${energyClass}">${config.energyLevel}</span>
                    </div>
                    <p class="block-time">${config.targetMinutes} min aprox · ${config.energyLevel}</p>
                    <input type="text" class="block-task-input" data-block="${i}" placeholder="¿Qué harás en este bloque?" />
                    <div class="pomodoro-indicator hidden" id="pomodoro-${i}">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="pomodoro-text">Modo Pomodoro: <span id="pomodoro-count-${i}">0</span>/4</span>
                    </div>
                    <div class="timer-display" id="timer-${i}">00:00</div>
                    <div class="block-controls">
                        <button class="btn-block btn-start" data-action="start" data-block="${i}">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Iniciar
                        </button>
                        <button class="btn-block btn-pause hidden" data-action="pause" data-block="${i}">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Pausar
                        </button>
                        <button class="btn-block btn-reset" data-action="reset" data-block="${i}">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="block-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-${i}"></div>
                        </div>
                    </div>
                    <div class="block-notes">
                        <div class="notes-header">
                            <p class="notes-label">Notas del bloque</p>
                            <button class="btn-toggle-notes" data-block="${i}">Mostrar/Ocultar</button>
                        </div>
                        <textarea class="notes-textarea hidden" id="notes-${i}" data-block="${i}" placeholder="¿Qué lograste? ¿Cómo te sentiste?"></textarea>
                    </div>
                </div>
            `;
            
            grid.insertAdjacentHTML('beforeend', blockHTML);
        }
    }
    
    generateWeeklyPlanHTML() {
        const grid = document.getElementById('weekly-grid');
        grid.innerHTML = '';
        
        this.weeklyPlan.forEach(day => {
            const energyClass = this.getEnergyClass(day.energy);
            const dayHTML = `
                <div class="day-card" data-day="${day.day}">
                    <div class="day-header">
                        <h3 class="day-name">${day.name}</h3>
                        <span class="energy-tag ${energyClass}">${day.energy}</span>
                    </div>
                    <div class="day-content">
                        <div class="focus-item">
                            <p class="focus-label">Foco Principal:</p>
                            <p class="focus-text">${day.primary}</p>
                        </div>
                        <div class="focus-item">
                            <p class="focus-label">Foco Secundario:</p>
                            <p class="focus-text">${day.secondary}</p>
                        </div>
                        <p class="day-guidance">${day.guidance}</p>
                    </div>
                </div>
            `;
            
            grid.insertAdjacentHTML('beforeend', dayHTML);
        });
    }
    
    getEnergyClass(energy) {
        const mapping = {
            'Alta': 'energy-high',
            'Media-Alta': 'energy-medium-high',
            'Media': 'energy-medium',
            'Media-Baja': 'energy-medium-low',
            'Baja': 'energy-low'
        };
        return mapping[energy] || 'energy-medium';
    }
    
    // ==========================================
    // Date & Day Management
    // ==========================================
    
    setupDate() {
        const dateEl = document.getElementById('current-date');
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('es-ES', options);
        dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
    
    highlightActiveDay() {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date().getDay();
        const todayName = dayNames[today];
        
        document.querySelectorAll('.day-card').forEach(card => {
            if (card.dataset.day === todayName) {
                card.classList.add('active');
            }
        });
    }
    
    // ==========================================
    // Block Timer Management
    // ==========================================
    
    setupBlockTimers() {
        for (let i = 1; i <= 5; i++) {
            this.timers[i] = {
                seconds: 0,
                isRunning: false,
                targetMinutes: this.blockConfig[i].targetMinutes,
                task: '',
                notes: '',
                pomodoroMode: false,
                pomodoroCount: 0,
                pomodoroPhase: 'work', // 'work' or 'break'
                startTime: null
            };
            
            this.setupBlockControls(i);
            this.setupTaskInput(i);
            this.setupNotesToggle(i);
        }
    }
    
    setupBlockControls(blockNum) {
        const startBtn = document.querySelector(`[data-action="start"][data-block="${blockNum}"]`);
        const pauseBtn = document.querySelector(`[data-action="pause"][data-block="${blockNum}"]`);
        const resetBtn = document.querySelector(`[data-action="reset"][data-block="${blockNum}"]`);
        const pomodoroBtn = document.querySelector(`[data-action="pomodoro"][data-block="${blockNum}"]`);
        const focusBtn = document.querySelector(`[data-action="focus"][data-block="${blockNum}"]`);
        
        startBtn.addEventListener('click', () => this.startBlock(blockNum));
        pauseBtn.addEventListener('click', () => this.pauseBlock(blockNum));
        resetBtn.addEventListener('click', () => this.resetBlock(blockNum));
        pomodoroBtn.addEventListener('click', () => this.togglePomodoro(blockNum));
        focusBtn.addEventListener('click', () => this.enterFocusMode(blockNum));
    }
    
    setupTaskInput(blockNum) {
        const input = document.querySelector(`.block-task-input[data-block="${blockNum}"]`);
        input.addEventListener('change', (e) => {
            this.timers[blockNum].task = e.target.value;
            this.saveState();
        });
        input.addEventListener('blur', (e) => {
            this.timers[blockNum].task = e.target.value;
            this.saveState();
        });
    }
    
    setupNotesToggle(blockNum) {
        const toggleBtn = document.querySelector(`.btn-toggle-notes[data-block="${blockNum}"]`);
        const textarea = document.querySelector(`#notes-${blockNum}`);
        
        toggleBtn.addEventListener('click', () => {
            textarea.classList.toggle('hidden');
        });
        
        textarea.addEventListener('change', (e) => {
            this.timers[blockNum].notes = e.target.value;
            this.saveState();
            
            // Count notes written for achievement
            const state = this.loadStateObject();
            if (!state.stats) state.stats = {};
            state.stats.notesWritten = (state.stats.notesWritten || 0) + 1;
            localStorage.setItem('executionDashboardPro', JSON.stringify(state));
        });
    }
    
    startBlock(blockNum) {
        // Stop any other running blocks
        for (let i = 1; i <= 5; i++) {
            if (i !== blockNum && this.timers[i].isRunning) {
                this.pauseBlock(i);
            }
        }
        
        this.timers[blockNum].isRunning = true;
        this.timers[blockNum].startTime = new Date();
        
        // Update UI
        const blockCard = document.querySelector(`.block-card[data-block="${blockNum}"]`);
        const startBtn = blockCard.querySelector('.btn-start');
        const pauseBtn = blockCard.querySelector('.btn-pause');
        
        blockCard.classList.add('active');
        if (this.timers[blockNum].pomodoroMode) {
            blockCard.classList.add('pomodoro-mode');
        }
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        
        // Start interval
        this.intervals[blockNum] = setInterval(() => {
            this.timers[blockNum].seconds++;
            this.updateTimerDisplay(blockNum);
            this.updateProgress(blockNum);
            this.updateFloatingWidget(blockNum);
            
            // Pomodoro check
            if (this.timers[blockNum].pomodoroMode) {
                this.checkPomodoroInterval(blockNum);
            }
            
            // Check if target reached
            const targetSeconds = this.timers[blockNum].targetMinutes * 60;
            if (!this.timers[blockNum].pomodoroMode && this.timers[blockNum].seconds === targetSeconds) {
                this.onBlockComplete(blockNum);
            }
        }, 1000);
        
        // Show floating widget
        this.showFloatingWidget(blockNum);
        
        this.saveState();
    }
    
    pauseBlock(blockNum) {
        this.timers[blockNum].isRunning = false;
        clearInterval(this.intervals[blockNum]);
        
        // Update UI
        const blockCard = document.querySelector(`.block-card[data-block="${blockNum}"]`);
        const startBtn = blockCard.querySelector('.btn-start');
        const pauseBtn = blockCard.querySelector('.btn-pause');
        
        blockCard.classList.remove('active');
        blockCard.classList.remove('pomodoro-mode');
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        
        // Hide floating widget if this was the active block
        this.hideFloatingWidget();
        
        this.saveState();
    }
    
    resetBlock(blockNum) {
        this.pauseBlock(blockNum);
        this.timers[blockNum].seconds = 0;
        this.timers[blockNum].pomodoroCount = 0;
        this.timers[blockNum].pomodoroPhase = 'work';
        this.updateTimerDisplay(blockNum);
        this.updateProgress(blockNum);
        this.updatePomodoroDisplay(blockNum);
        this.saveState();
    }
    
    updateTimerDisplay(blockNum) {
        const seconds = this.timers[blockNum].seconds;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const display = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        const timerEl = document.getElementById(`timer-${blockNum}`);
        if (timerEl) {
            timerEl.textContent = display;
        }
        
        // Update focus mode if active
        if (this.focusModeActive) {
            const focusTimer = document.getElementById('focus-timer-large');
            if (focusTimer) {
                focusTimer.textContent = display;
            }
        }
    }
    
    updateProgress(blockNum) {
        const seconds = this.timers[blockNum].seconds;
        let targetSeconds;
        
        if (this.timers[blockNum].pomodoroMode) {
            targetSeconds = this.timers[blockNum].pomodoroPhase === 'work' ? 1500 : 300; // 25 or 5 min
        } else {
            targetSeconds = this.timers[blockNum].targetMinutes * 60;
        }
        
        const percentage = Math.min((seconds / targetSeconds) * 100, 100);
        
        const progressEl = document.getElementById(`progress-${blockNum}`);
        if (progressEl) {
            progressEl.style.width = `${percentage}%`;
        }
        
        // Update focus mode if active
        if (this.focusModeActive) {
            const focusProgress = document.getElementById('focus-progress-fill');
            if (focusProgress) {
                focusProgress.style.width = `${percentage}%`;
            }
        }
    }
    
    onBlockComplete(blockNum) {
        this.pauseBlock(blockNum);
        
        this.showNotification(
            'success',
            '¡Bloque Completado!',
            `Has completado el ${this.blockConfig[blockNum].name}. ¡Excelente trabajo!`
        );
        
        this.playCompletionSound();
        
        // Update stats
        this.updateDailyStats();
        this.checkAndShowAchievements();
        
        // Suggest next block
        if (blockNum < 5) {
            setTimeout(() => {
                this.showNotification(
                    'info',
                    'Siguiente Bloque',
                    `¿Listo para comenzar el Bloque ${blockNum + 1}?`
                );
            }, 3000);
        }
    }
    
    // ==========================================
    // Pomodoro Mode
    // ==========================================
    
    togglePomodoro(blockNum) {
        this.timers[blockNum].pomodoroMode = !this.timers[blockNum].pomodoroMode;
        
        const indicator = document.getElementById(`pomodoro-${blockNum}`);
        const blockCard = document.querySelector(`.block-card[data-block="${blockNum}"]`);
        
        if (this.timers[blockNum].pomodoroMode) {
            indicator.classList.remove('hidden');
            this.showNotification('info', 'Modo Pomodoro Activado', 'Trabajarás en sesiones de 25 min con descansos de 5 min');
        } else {
            indicator.classList.add('hidden');
            blockCard.classList.remove('pomodoro-mode');
            this.timers[blockNum].pomodoroCount = 0;
            this.timers[blockNum].pomodoroPhase = 'work';
        }
        
        this.updatePomodoroDisplay(blockNum);
        this.saveState();
    }
    
    checkPomodoroInterval(blockNum) {
        const phase = this.timers[blockNum].pomodoroPhase;
        const targetSeconds = phase === 'work' ? 1500 : 300; // 25 or 5 min
        
        if (this.timers[blockNum].seconds >= targetSeconds) {
            this.timers[blockNum].seconds = 0;
            
            if (phase === 'work') {
                // Work phase complete, start break
                this.timers[blockNum].pomodoroPhase = 'break';
                this.timers[blockNum].pomodoroCount++;
                this.showNotification('success', 'Pomodoro Completado!', 'Toma un descanso de 5 minutos');
                this.playCompletionSound();
            } else {
                // Break complete, start work
                this.timers[blockNum].pomodoroPhase = 'work';
                
                if (this.timers[blockNum].pomodoroCount >= 4) {
                    // 4 pomodoros complete
                    this.pauseBlock(blockNum);
                    this.showNotification('success', '¡Ciclo Pomodoro Completo!', 'Has completado 4 pomodoros. Toma un descanso largo de 15-30 min');
                    this.timers[blockNum].pomodoroCount = 0;
                } else {
                    this.showNotification('info', 'Descanso Terminado', `Iniciando pomodoro ${this.timers[blockNum].pomodoroCount + 1}/4`);
                }
            }
            
            this.updatePomodoroDisplay(blockNum);
        }
    }
    
    updatePomodoroDisplay(blockNum) {
        const countEl = document.getElementById(`pomodoro-count-${blockNum}`);
        if (countEl) {
            countEl.textContent = this.timers[blockNum].pomodoroCount;
        }
    }
    
    // ==========================================
    // Focus Mode
    // ==========================================
    
    enterFocusMode(blockNum) {
        if (!this.timers[blockNum].isRunning) {
            this.startBlock(blockNum);
        }
        
        this.focusModeActive = true;
        const focusMode = document.getElementById('focus-mode');
        focusMode.classList.remove('hidden');
        
        // Update focus mode content
        document.getElementById('focus-block-name').textContent = this.blockConfig[blockNum].name;
        document.getElementById('focus-task-name').textContent = this.timers[blockNum].task || 'Sin tarea asignada';
        
        // Update pomodoro info if applicable
        if (this.timers[blockNum].pomodoroMode) {
            const pomodoroInfo = document.getElementById('focus-pomodoro-info');
            pomodoroInfo.textContent = `Pomodoro ${this.timers[blockNum].pomodoroCount + 1}/4 - Fase: ${this.timers[blockNum].pomodoroPhase === 'work' ? 'Trabajo' : 'Descanso'}`;
        }
        
        // Setup exit button
        document.getElementById('exit-focus').onclick = () => this.exitFocusMode();
        document.getElementById('focus-pause').onclick = () => {
            this.pauseBlock(blockNum);
            this.exitFocusMode();
        };
        
        // Track focus mode usage for achievement
        const state = this.loadStateObject();
        if (!state.stats) state.stats = {};
        state.stats.focusModeUses = (state.stats.focusModeUses || 0) + 1;
        localStorage.setItem('executionDashboardPro', JSON.stringify(state));
        
        this.checkAndShowAchievements();
    }
    
    exitFocusMode() {
        this.focusModeActive = false;
        const focusMode = document.getElementById('focus-mode');
        focusMode.classList.add('hidden');
    }
    
    // ==========================================
    // Floating Widget
    // ==========================================
    
    setupFloatingWidget() {
        const widget = document.getElementById('floating-widget');
        const minimizeBtn = document.getElementById('minimize-widget');
        
        minimizeBtn.addEventListener('click', () => {
            widget.classList.toggle('minimized');
        });
        
        // Make widget draggable
        this.makeDraggable(widget);
    }
    
    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.widget-header');
        
        header.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    showFloatingWidget(blockNum) {
        const widget = document.getElementById('floating-widget');
        widget.classList.remove('hidden');
        this.updateFloatingWidget(blockNum);
    }
    
    hideFloatingWidget() {
        const widget = document.getElementById('floating-widget');
        widget.classList.add('hidden');
    }
    
    updateFloatingWidget(blockNum) {
        const widget = document.getElementById('floating-widget');
        if (widget.classList.contains('hidden')) return;
        
        document.getElementById('widget-block-name').textContent = this.blockConfig[blockNum].name;
        document.getElementById('widget-task').textContent = this.timers[blockNum].task || 'Sin tarea asignada';
        
        const seconds = this.timers[blockNum].seconds;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        document.getElementById('widget-timer').textContent = display;
    }
    
    // Continue in next part...
    // ==========================================
    // Presence Practice
    // ==========================================
    
    setupPresencePractice() {
        const startBtn = document.getElementById('start-practice');
        startBtn.addEventListener('click', () => this.startPresencePractice());
    }
    
    startPresencePractice() {
        const timerEl = document.getElementById('practice-timer');
        const breathingCircle = document.querySelector('.breathing-circle');
        const breathingText = document.getElementById('breathing-text');
        const startBtn = document.getElementById('start-practice');
        
        let totalSeconds = 180; // 3 minutes
        let breathCycle = 0;
        const breathPatterns = [
            { text: 'Inhala profundamente...', class: 'inhale', duration: 4000 },
            { text: 'Sostén...', class: 'hold', duration: 4000 },
            { text: 'Exhala lentamente...', class: 'exhale', duration: 4000 },
            { text: 'Pausa...', class: 'pause', duration: 4000 }
        ];
        
        startBtn.disabled = true;
        
        this.practiceInterval = setInterval(() => {
            totalSeconds--;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            timerEl.textContent = `Tiempo restante: ${minutes}:${String(seconds).padStart(2, '0')}`;
            
            if (totalSeconds <= 0) {
                this.stopPresencePractice();
                this.showNotification('success', 'Práctica Completada', 'Has completado la práctica de presencia. ¿Te sientes más centrado?');
            }
        }, 1000);
        
        const breathingCycle = () => {
            const pattern = breathPatterns[breathCycle % breathPatterns.length];
            breathingText.textContent = pattern.text;
            
            breathingCircle.className = 'breathing-circle';
            setTimeout(() => {
                breathingCircle.classList.add(pattern.class);
            }, 50);
            
            breathCycle++;
        };
        
        breathingCycle();
        this.breathingInterval = setInterval(breathingCycle, 4000);
        
        this.showNotification('info', 'Práctica Iniciada', 'Sigue las instrucciones de respiración. 3 minutos para recuperar tu presencia.');
    }
    
    stopPresencePractice() {
        clearInterval(this.practiceInterval);
        clearInterval(this.breathingInterval);
        
        const timerEl = document.getElementById('practice-timer');
        const breathingCircle = document.querySelector('.breathing-circle');
        const breathingText = document.getElementById('breathing-text');
        const startBtn = document.getElementById('start-practice');
        
        timerEl.textContent = '';
        breathingText.textContent = 'Inhala...';
        breathingCircle.className = 'breathing-circle';
        startBtn.disabled = false;
    }
    
    // ==========================================
    // Weekly Progress Tracking
    // ==========================================
    
    setupWeeklyTracking() {
        const inputs = document.querySelectorAll('.progress-input');
        
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const area = e.target.dataset.area;
                let value = parseInt(e.target.value) || 0;
                value = Math.max(0, Math.min(100, value));
                e.target.value = value;
                
                this.updateCircularProgress(area, value);
                this.saveState();
                
                // Check for 100% achievement
                this.checkPerfectWeek();
            });
        });
    }
    
    updateCircularProgress(area, percentage) {
        const circle = document.querySelector(`.circular-progress[data-area="${area}"] .progress-ring-circle`);
        const percentageText = document.querySelector(`.circular-progress[data-area="${area}"] .progress-percentage`);
        
        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDashoffset = offset;
        percentageText.textContent = `${percentage}%`;
    }
    
    checkPerfectWeek() {
        const inputs = document.querySelectorAll('.progress-input');
        const allPerfect = Array.from(inputs).every(input => parseInt(input.value) === 100);
        
        if (allPerfect) {
            const state = this.loadStateObject();
            if (!state.stats) state.stats = {};
            state.stats.weeklyPerfect = (state.stats.weeklyPerfect || 0) + 1;
            localStorage.setItem('executionDashboardPro', JSON.stringify(state));
            
            this.showNotification('success', '¡Semana Perfecta!', '100% en todas las áreas. ¡Increíble constancia!');
            this.checkAndShowAchievements();
        }
    }
    
    // ==========================================
    // Modals
    // ==========================================
    
    setupModals() {
        // Stats modal
        document.getElementById('open-stats').addEventListener('click', () => this.openStatsModal());
        document.getElementById('close-stats-modal').addEventListener('click', () => this.closeStatsModal());
        
        // Weekly review modal
        document.getElementById('open-weekly-review').addEventListener('click', () => this.openWeeklyReviewModal());
        document.getElementById('close-review-modal').addEventListener('click', () => this.closeWeeklyReviewModal());
        
        // Export buttons
        document.getElementById('export-csv').addEventListener('click', () => this.exportToCSV());
        document.getElementById('export-report').addEventListener('click', () => this.generateWeeklyReport());
        
        // Close modal on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }
    
    // ==========================================
    // Statistics Modal
    // ==========================================
    
    openStatsModal() {
        const modal = document.getElementById('stats-modal');
        modal.classList.remove('hidden');
        
        this.renderStatistics();
        this.renderActivityHeatmap();
        this.renderCharts();
        this.renderAchievements();
    }
    
    closeStatsModal() {
        document.getElementById('stats-modal').classList.add('hidden');
    }
    
    renderStatistics() {
        const state = this.loadStateObject();
        const stats = this.calculateStats(state);
        
        document.getElementById('current-streak').textContent = `${stats.currentStreak} días`;
        document.getElementById('total-hours').textContent = `${Math.round(stats.totalHours)}h`;
        document.getElementById('consistency-rate').textContent = `${stats.consistencyRate}%`;
    }
    
    renderActivityHeatmap() {
        const state = this.loadStateObject();
        const container = document.getElementById('activity-heatmap');
        container.innerHTML = '';
        
        // Generate last 30 days
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayData = state.history?.[dateStr] || {};
            const blocksCompleted = dayData.blocksCompleted || 0;
            
            let level = 0;
            if (blocksCompleted >= 5) level = 4;
            else if (blocksCompleted >= 4) level = 3;
            else if (blocksCompleted >= 3) level = 2;
            else if (blocksCompleted >= 1) level = 1;
            
            const dayEl = document.createElement('div');
            dayEl.className = `heatmap-day level-${level}`;
            dayEl.title = `${dateStr}: ${blocksCompleted} bloques`;
            container.appendChild(dayEl);
        }
    }
    
    renderCharts() {
        // Area distribution chart
        const areaCtx = document.getElementById('area-distribution-chart').getContext('2d');
        const areas = ['3d', 'ia', 'cmm', 'trading', 'gimnasio', 'lectura'];
        const values = areas.map(area => {
            const input = document.querySelector(`.progress-input[data-area="${area}"]`);
            return parseInt(input?.value || 0);
        });
        
        new Chart(areaCtx, {
            type: 'radar',
            data: {
                labels: ['Impresión 3D', 'Contenido IA', 'CMM', 'Trading', 'Gimnasio', 'Lectura'],
                datasets: [{
                    label: 'Progreso Semanal',
                    data: values,
                    backgroundColor: 'rgba(71, 123, 255, 0.2)',
                    borderColor: '#477BFF',
                    pointBackgroundColor: '#477BFF',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#477BFF'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#A1A1AA'
                        },
                        grid: {
                            color: '#1E1E1E'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#E4E4E7'
                        }
                    }
                }
            }
        });
        
        // Weekly trend chart
        const trendCtx = document.getElementById('weekly-trend-chart').getContext('2d');
        const state = this.loadStateObject();
        const last7Days = [];
        const last7DaysData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
            
            last7Days.push(dayName);
            const dayData = state.history?.[dateStr] || {};
            last7DaysData.push(dayData.blocksCompleted || 0);
        }
        
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Bloques Completados',
                    data: last7DaysData,
                    borderColor: '#477BFF',
                    backgroundColor: 'rgba(71, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            color: '#A1A1AA',
                            stepSize: 1
                        },
                        grid: {
                            color: '#1E1E1E'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#A1A1AA'
                        },
                        grid: {
                            color: '#1E1E1E'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#E4E4E7'
                        }
                    }
                }
            }
        });
    }
    
    renderAchievements() {
        const grid = document.getElementById('achievements-grid');
        grid.innerHTML = '';
        
        const state = this.loadStateObject();
        const stats = this.calculateStats(state);
        
        this.achievements.forEach(achievement => {
            const unlocked = achievement.condition(stats);
            
            const badgeHTML = `
                <div class="achievement-badge ${unlocked ? '' : 'locked'}">
                    <div class="achievement-icon">${unlocked ? achievement.icon : '🔒'}</div>
                    <p class="achievement-name">${achievement.name}</p>
                </div>
            `;
            
            grid.insertAdjacentHTML('beforeend', badgeHTML);
        });
    }
    
    // ==========================================
    // Weekly Review Modal
    // ==========================================
    
    openWeeklyReviewModal() {
        const modal = document.getElementById('weekly-review-modal');
        modal.classList.remove('hidden');
        
        this.renderWeeklyReview();
    }
    
    closeWeeklyReviewModal() {
        document.getElementById('weekly-review-modal').classList.add('hidden');
    }
    
    renderWeeklyReview() {
        const body = document.getElementById('review-modal-body');
        
        const questions = [
            { title: '¿Qué lograste esta semana?', key: 'achievements', placeholder: 'Lista tus principales logros y avances...' },
            { title: '¿Qué obstáculos enfrentaste?', key: 'obstacles', placeholder: 'Identifica los desafíos y cómo los superaste...' },
            { title: '¿Qué aprendiste?', key: 'learnings', placeholder: 'Insights, lecciones, descubrimientos...' },
            { title: '¿Qué ajustarás para la próxima semana?', key: 'adjustments', placeholder: 'Mejoras, cambios de estrategia, nuevos enfoques...' },
            { title: 'Intención para la próxima semana', key: 'intention', placeholder: 'Tu compromiso principal para los próximos 7 días...' }
        ];
        
        let html = '';
        questions.forEach((q, index) => {
            html += `
                <div class="review-step">
                    <h3 class="review-step-title">${index + 1}. ${q.title}</h3>
                    <p class="review-step-description">Reflexiona profundamente. No hay respuestas incorrectas.</p>
                    <textarea class="review-textarea" id="review-${q.key}" placeholder="${q.placeholder}"></textarea>
                </div>
            `;
        });
        
        html += `
            <div class="review-actions">
                <button class="btn-secondary" onclick="dashboard.closeWeeklyReviewModal()">Cancelar</button>
                <button class="btn-primary" onclick="dashboard.saveWeeklyReview()">Guardar Revisión</button>
            </div>
        `;
        
        body.innerHTML = html;
        
        // Load previous review if exists
        const state = this.loadStateObject();
        if (state.weeklyReview) {
            questions.forEach(q => {
                const textarea = document.getElementById(`review-${q.key}`);
                if (textarea && state.weeklyReview[q.key]) {
                    textarea.value = state.weeklyReview[q.key];
                }
            });
        }
    }
    
    saveWeeklyReview() {
        const state = this.loadStateObject();
        state.weeklyReview = {
            date: new Date().toISOString(),
            achievements: document.getElementById('review-achievements').value,
            obstacles: document.getElementById('review-obstacles').value,
            learnings: document.getElementById('review-learnings').value,
            adjustments: document.getElementById('review-adjustments').value,
            intention: document.getElementById('review-intention').value
        };
        
        localStorage.setItem('executionDashboardPro', JSON.stringify(state));
        
        this.showNotification('success', 'Revisión Guardada', 'Tu reflexión semanal ha sido guardada exitosamente');
        this.closeWeeklyReviewModal();
    }
    
    // ==========================================
    // Export Functions
    // ==========================================
    
    exportToCSV() {
        const state = this.loadStateObject();
        let csv = 'Fecha,Bloque 1,Bloque 2,Bloque 3,Bloque 4,Bloque 5,Total Bloques,Total Minutos\n';
        
        if (state.history) {
            Object.keys(state.history).sort().forEach(date => {
                const day = state.history[date];
                const blocks = day.blocks || {};
                const row = [
                    date,
                    Math.round((blocks[1] || 0) / 60),
                    Math.round((blocks[2] || 0) / 60),
                    Math.round((blocks[3] || 0) / 60),
                    Math.round((blocks[4] || 0) / 60),
                    Math.round((blocks[5] || 0) / 60),
                    day.blocksCompleted || 0,
                    Math.round((day.totalMinutes || 0))
                ];
                csv += row.join(',') + '\n';
            });
        }
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ejecucion-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        this.showNotification('success', 'CSV Exportado', 'Tu historial ha sido descargado');
    }
    
    generateWeeklyReport() {
        const state = this.loadStateObject();
        const stats = this.calculateStats(state);
        
        const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Reporte Semanal - Dashboard de Ejecución</title>
                <style>
                    body { font-family: 'Inter', sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
                    h1 { color: #477BFF; }
                    .stat { display: inline-block; margin: 20px; padding: 20px; border: 2px solid #477BFF; border-radius: 12px; }
                    .stat-value { font-size: 32px; font-weight: bold; color: #477BFF; }
                    .stat-label { font-size: 14px; color: #666; }
                    .area { margin: 20px 0; }
                    .progress-bar { height: 24px; background: #eee; border-radius: 12px; overflow: hidden; }
                    .progress-fill { height: 100%; background: #477BFF; transition: width 0.3s; }
                </style>
            </head>
            <body>
                <h1>📊 Reporte Semanal de Ejecución</h1>
                <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                <h2>Estadísticas Generales</h2>
                <div class="stat">
                    <div class="stat-value">${stats.currentStreak}</div>
                    <div class="stat-label">Días Consecutivos</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${Math.round(stats.totalHours)}</div>
                    <div class="stat-label">Horas Totales</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${stats.consistencyRate}%</div>
                    <div class="stat-label">Consistencia</div>
                </div>
                
                <h2>Progreso por Área</h2>
                ${this.generateAreaProgressHTML()}
                
                <h2>Logros Desbloqueados</h2>
                ${this.generateAchievementsHTML(stats)}
                
                <h2>Revisión Semanal</h2>
                ${this.generateWeeklyReviewHTML(state)}
                
                <hr>
                <p style="text-align: center; color: #666;">
                    <em>"Acción Imperfecta > Parálisis Perfecta"</em><br>
                    Dashboard de Ejecución Constante Pro | 2025
                </p>
            </body>
            </html>
        `;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-semanal-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        
        this.showNotification('success', 'Reporte Generado', 'Tu reporte semanal ha sido descargado');
    }
    
    generateAreaProgressHTML() {
        const areas = [
            { key: '3d', name: 'Impresión 3D' },
            { key: 'ia', name: 'Contenido con IA' },
            { key: 'cmm', name: 'CMM' },
            { key: 'trading', name: 'Trading' },
            { key: 'gimnasio', name: 'Gimnasio' },
            { key: 'lectura', name: 'Lectura' }
        ];
        
        return areas.map(area => {
            const input = document.querySelector(`.progress-input[data-area="${area.key}"]`);
            const value = parseInt(input?.value || 0);
            return `
                <div class="area">
                    <strong>${area.name}:</strong> ${value}%
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${value}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    generateAchievementsHTML(stats) {
        const unlocked = this.achievements.filter(a => a.condition(stats));
        if (unlocked.length === 0) {
            return '<p>Aún no has desbloqueado logros. ¡Sigue ejecutando!</p>';
        }
        
        return '<ul>' + unlocked.map(a => `<li>${a.icon} <strong>${a.name}</strong>: ${a.description}</li>`).join('') + '</ul>';
    }
    
    generateWeeklyReviewHTML(state) {
        if (!state.weeklyReview) {
            return '<p>No has completado una revisión semanal aún.</p>';
        }
        
        const review = state.weeklyReview;
        return `
            <p><strong>Logros:</strong> ${review.achievements || 'N/A'}</p>
            <p><strong>Obstáculos:</strong> ${review.obstacles || 'N/A'}</p>
            <p><strong>Aprendizajes:</strong> ${review.learnings || 'N/A'}</p>
            <p><strong>Ajustes:</strong> ${review.adjustments || 'N/A'}</p>
            <p><strong>Intención:</strong> ${review.intention || 'N/A'}</p>
        `;
    }
    
    // ==========================================
    // Theme Toggle
    // ==========================================
    
    setupThemeToggle() {
        const btn = document.getElementById('toggle-theme');
        const icon = document.getElementById('theme-icon');
        
        // Load theme from state
        const state = this.loadStateObject();
        this.theme = state.theme || 'dark';
        this.applyTheme();
        
        btn.addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme();
            this.saveState();
        });
    }
    
    applyTheme() {
        const body = document.body;
        const icon = document.getElementById('theme-icon');
        
        if (this.theme === 'light') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
        }
    }
    
    // ==========================================
    // Achievements System
    // ==========================================
    
    updateAchievementsBanner() {
        const banner = document.getElementById('achievements-banner');
        const state = this.loadStateObject();
        const stats = this.calculateStats(state);
        
        const recentUnlocked = this.achievements.filter(a => a.condition(stats)).slice(-3);
        
        if (recentUnlocked.length === 0) {
            banner.style.display = 'none';
            return;
        }
        
        banner.innerHTML = '';
        recentUnlocked.forEach(achievement => {
            const badgeHTML = `
                <div class="achievement-badge">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <p class="achievement-name">${achievement.name}</p>
                </div>
            `;
            banner.insertAdjacentHTML('beforeend', badgeHTML);
        });
        
        banner.style.display = 'flex';
    }
    
    checkAndShowAchievements() {
        const state = this.loadStateObject();
        const stats = this.calculateStats(state);
        
        if (!state.unlockedAchievements) {
            state.unlockedAchievements = [];
        }
        
        this.achievements.forEach(achievement => {
            if (achievement.condition(stats) && !state.unlockedAchievements.includes(achievement.id)) {
                state.unlockedAchievements.push(achievement.id);
                this.showNotification(
                    'success',
                    `🎉 ¡Logro Desbloqueado!`,
                    `${achievement.icon} ${achievement.name}: ${achievement.description}`
                );
                localStorage.setItem('executionDashboardPro', JSON.stringify(state));
            }
        });
        
        this.updateAchievementsBanner();
    }
    
    // ==========================================
    // Statistics Calculation
    // ==========================================
    
    calculateStats(state) {
        const stats = {
            currentStreak: 0,
            totalHours: 0,
            consistencyRate: 0,
            blocksCompletedToday: 0,
            earlyStarts: 0,
            weeklyPerfect: 0,
            focusModeUses: 0,
            notesWritten: 0,
            daysCompleted: 0
        };
        
        // Load saved stats
        if (state.stats) {
            Object.assign(stats, state.stats);
        }
        
        // Calculate from history
        if (state.history) {
            const dates = Object.keys(state.history).sort();
            
            // Total days completed
            stats.daysCompleted = dates.length;
            
            // Total hours
            dates.forEach(date => {
                const day = state.history[date];
                stats.totalHours += (day.totalMinutes || 0) / 60;
            });
            
            // Current streak
            let streak = 0;
            const today = new Date();
            for (let i = 0; i < 365; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                if (state.history[dateStr] && (state.history[dateStr].blocksCompleted || 0) >= 3) {
                    streak++;
                } else {
                    break;
                }
            }
            stats.currentStreak = streak;
            
            // Consistency rate (last 30 days)
            let daysWithProgress = 0;
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                if (state.history[dateStr] && (state.history[dateStr].blocksCompleted || 0) >= 3) {
                    daysWithProgress++;
                }
            }
            stats.consistencyRate = Math.round((daysWithProgress / 30) * 100);
            
            // Blocks completed today
            const todayStr = today.toISOString().split('T')[0];
            if (state.history[todayStr]) {
                stats.blocksCompletedToday = state.history[todayStr].blocksCompleted || 0;
            }
        }
        
        return stats;
    }
    
    updateDailyStats() {
        const state = this.loadStateObject();
        const today = new Date().toISOString().split('T')[0];
        
        if (!state.history) state.history = {};
        if (!state.history[today]) state.history[today] = { blocks: {}, blocksCompleted: 0, totalMinutes: 0 };
        
        // Count completed blocks
        let completed = 0;
        let totalMinutes = 0;
        
        for (let i = 1; i <= 5; i++) {
            const seconds = this.timers[i].seconds;
            const targetSeconds = this.timers[i].targetMinutes * 60;
            
            state.history[today].blocks[i] = seconds;
            totalMinutes += seconds / 60;
            
            if (seconds >= targetSeconds * 0.8) { // 80% threshold
                completed++;
            }
        }
        
        state.history[today].blocksCompleted = completed;
        state.history[today].totalMinutes = totalMinutes;
        
        localStorage.setItem('executionDashboardPro', JSON.stringify(state));
    }
    
    // ==========================================
    // Notifications
    // ==========================================
    
    setupNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    showNotification(type, title, message) {
        const container = document.getElementById('notification-container');
        
        const icons = {
            success: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            warning: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
            info: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon" style="color: var(--${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'primary'}-500)">
                ${icons[type]}
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                tag: 'execution-dashboard'
            });
        }
    }
    
    playCompletionSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    // ==========================================
    // State Management
    // ==========================================
    
    saveState() {
        const state = {
            timers: {},
            weeklyProgress: {},
            theme: this.theme,
            lastSaved: new Date().toISOString()
        };
        
        for (let i = 1; i <= 5; i++) {
            state.timers[i] = {
                seconds: this.timers[i].seconds,
                isRunning: this.timers[i].isRunning,
                task: this.timers[i].task,
                notes: this.timers[i].notes,
                pomodoroMode: this.timers[i].pomodoroMode,
                pomodoroCount: this.timers[i].pomodoroCount
            };
        }
        
        document.querySelectorAll('.progress-input').forEach(input => {
            const area = input.dataset.area;
            state.weeklyProgress[area] = parseInt(input.value) || 0;
        });
        
        // Merge with existing state
        const existingState = this.loadStateObject();
        const merged = { ...existingState, ...state };
        
        localStorage.setItem('executionDashboardPro', JSON.stringify(merged));
    }
    
    loadStateObject() {
        const savedState = localStorage.getItem('executionDashboardPro');
        return savedState ? JSON.parse(savedState) : {};
    }
    
    loadState() {
        const state = this.loadStateObject();
        
        if (!state || !state.lastSaved) return;
        
        const lastSaved = new Date(state.lastSaved);
        const today = new Date();
        const isSameDay = lastSaved.toDateString() === today.toDateString();
        
        if (!isSameDay) {
            this.showNotification('info', 'Nuevo Día', '¡Buen día! Tus bloques se han reiniciado para hoy.');
            
            if (state.weeklyProgress) {
                Object.keys(state.weeklyProgress).forEach(area => {
                    const input = document.querySelector(`.progress-input[data-area="${area}"]`);
                    if (input) {
                        input.value = state.weeklyProgress[area];
                        this.updateCircularProgress(area, state.weeklyProgress[area]);
                    }
                });
            }
            
            return;
        }
        
        // Restore timer states
        if (state.timers) {
            for (let i = 1; i <= 5; i++) {
                if (state.timers[i]) {
                    this.timers[i].seconds = state.timers[i].seconds || 0;
                    this.timers[i].task = state.timers[i].task || '';
                    this.timers[i].notes = state.timers[i].notes || '';
                    this.timers[i].pomodoroMode = state.timers[i].pomodoroMode || false;
                    this.timers[i].pomodoroCount = state.timers[i].pomodoroCount || 0;
                    
                    // Update UI
                    const taskInput = document.querySelector(`.block-task-input[data-block="${i}"]`);
                    if (taskInput) taskInput.value = this.timers[i].task;
                    
                    const notesTextarea = document.getElementById(`notes-${i}`);
                    if (notesTextarea) notesTextarea.value = this.timers[i].notes;
                    
                    if (this.timers[i].pomodoroMode) {
                        const indicator = document.getElementById(`pomodoro-${i}`);
                        if (indicator) indicator.classList.remove('hidden');
                        this.updatePomodoroDisplay(i);
                    }
                    
                    this.updateTimerDisplay(i);
                    this.updateProgress(i);
                    
                    if (state.timers[i].isRunning) {
                        const blockCard = document.querySelector(`.block-card[data-block="${i}"]`);
                        if (blockCard) blockCard.classList.add('active');
                    }
                }
            }
        }
        
        // Restore weekly progress
        if (state.weeklyProgress) {
            Object.keys(state.weeklyProgress).forEach(area => {
                const input = document.querySelector(`.progress-input[data-area="${area}"]`);
                if (input) {
                    input.value = state.weeklyProgress[area];
                    this.updateCircularProgress(area, state.weeklyProgress[area]);
                }
            });
        }
        
        // Apply theme
        if (state.theme) {
            this.theme = state.theme;
            this.applyTheme();
        }
        
        this.showNotification('info', 'Estado Restaurado', 'Se ha restaurado tu progreso del día.');
    }
}

// ==========================================
// Initialize Dashboard
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new ExecutionDashboardPro();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const blockNum = parseInt(e.key);
            window.dashboard.startBlock(blockNum);
        }
        
        if (e.altKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            if (confirm('¿Estás seguro de que quieres reiniciar todos los bloques?')) {
                for (let i = 1; i <= 5; i++) {
                    window.dashboard.resetBlock(i);
                }
            }
        }
        
        if (e.altKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            window.dashboard.startPresencePractice();
        }
        
        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            window.dashboard.openStatsModal();
        }
        
        if (e.altKey && e.key.toLowerCase() === 'w') {
            e.preventDefault();
            window.dashboard.openWeeklyReviewModal();
        }
    });
    
    // Welcome message
    setTimeout(() => {
        window.dashboard.showNotification(
            'info',
            'Bienvenido a tu Dashboard Pro',
            'Todas las funcionalidades están activas. Usa Alt+S para estadísticas, Alt+W para revisión semanal. ¡Acción Imperfecta!'
        );
    }, 1000);
});

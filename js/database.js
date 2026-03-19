/**
 * ========================================
 * Database Module - Google Sheets
 * Proyecto Manglar Uno
 * ========================================
 */

const Database = {
    // URLs de las hojas de cálculo publicadas
    urls: {
        usuarios: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQP3HRn9UADHnnQkckKluEg7jObX46PBAe7ucPUJh8hicSqChAUHouWbJXjo3S0MAorIxOy01dVwSs/pub?gid=1857824058&single=true&output=csv',
        evaluaciones: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQP3HRn9UADHnnQkckKluEg7jObX46PBAe7ucPUJh8hicSqChAUHouWbJXjo3S0MAorIxOy01dVwSs/pub?gid=0&single=true&output=csv'
    },
    
    // Cache de datos
    cache: {
        usuarios: null,
        evaluaciones: null,
        lastFetch: 0
    },
    
    // Tiempo de cache (5 minutos)
    cacheTime: 5 * 60 * 1000,
    
    /**
     * Parsear CSV a array de objetos
     */
    parseCSV(text) {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        return lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const obj = {};
            
            headers.forEach((header, index) => {
                let value = values[index] || '';
                
                // Convertir tipos
                if (value === 'TRUE') value = true;
                else if (value === 'FALSE') value = false;
                else if (!isNaN(value) && value !== '') value = Number(value);
                
                obj[header] = value;
            });
            
            return obj;
        });
    },
    
    /**
     * Parsear una línea de CSV (maneja comas dentro de comillas)
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    },
    
    /**
     * Obtener datos de una hoja
     */
    async fetch(sheet) {
        // Verificar cache
        const now = Date.now();
        if (this.cache[sheet] && (now - this.cache.lastFetch) < this.cacheTime) {
            console.log(`📊 [CACHE] ${sheet}`);
            return this.cache[sheet];
        }
        
        try {
            console.log(`📊 [FETCH] ${sheet}...`);
            const response = await fetch(this.urls[sheet]);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const text = await response.text();
            const data = this.parseCSV(text);
            
            // Actualizar cache
            this.cache[sheet] = data;
            this.cache.lastFetch = now;
            
            console.log(`✅ [OK] ${sheet}: ${data.length} registros`);
            return data;
        } catch (error) {
            console.error(`❌ [ERROR] ${sheet}:`, error);
            
            // Si hay cache, usarlo aunque esté viejo
            if (this.cache[sheet]) {
                console.log(`⚠️ [FALLBACK] Usando cache viejo para ${sheet}`);
                return this.cache[sheet];
            }
            
            throw error;
        }
    },
    
    /**
     * Obtener todos los usuarios
     */
    async getUsuarios() {
        return await this.fetch('usuarios');
    },
    
    /**
     * Obtener usuario por email
     */
    async getUsuarioByEmail(email) {
        const usuarios = await this.getUsuarios();
        return usuarios.find(u => u.correo === email.toLowerCase());
    },
    
    /**
     * Validar credenciales de usuario
     */
    async validateUser(email, pin) {
        const usuario = await this.getUsuarioByEmail(email);
        
        if (!usuario) {
            return null;
        }
        
        // Convertir pin a número para comparación
        const pinNum = typeof pin === 'string' ? parseInt(pin) : pin;
        const usuarioPin = typeof usuario.pin === 'string' ? parseInt(usuario.pin) : usuario.pin;
        
        if (usuarioPin !== pinNum) {
            return null;
        }
        
        // Retornar usuario sin el pin
        const { pin: _, ...userSafe } = usuario;
        return userSafe;
    },
    
    /**
     * Obtener evaluaciones de un estudiante
     */
    async getEvaluaciones(estudiante) {
        const evaluaciones = await this.fetch('evaluaciones');
        return evaluaciones.filter(e => 
            e.estudiante && e.estudiante.toLowerCase() === estudiante.toLowerCase()
        );
    },
    
    /**
     * Obtener evaluaciones pendientes (Próximas Entregas)
     */
    async getEvaluacionesPendientes(estudiante) {
        const evaluaciones = await this.getEvaluaciones(estudiante);
        return evaluaciones.filter(e => e.estado === 'Pendiente');
    },
    
    /**
     * Obtener evaluaciones calificadas (Últimas Notas)
     */
    async getEvaluacionesCalificadas(estudiante) {
        const evaluaciones = await this.getEvaluaciones(estudiante);
        return evaluaciones.filter(e => e.estado === 'Calificado' && e.nota);
    },
    
    /**
     * Calcular promedio de un estudiante
     */
    async calcularPromedio(estudiante) {
        const calificadas = await this.getEvaluacionesCalificadas(estudiante);
        
        if (calificadas.length === 0) {
            return 0;
        }
        
        const suma = calificadas.reduce((acc, e) => acc + (parseFloat(e.nota) || 0), 0);
        return suma / calificadas.length;
    },
    
    /**
     * Limpiar cache
     */
    clearCache() {
        this.cache = {
            usuarios: null,
            evaluaciones: null,
            lastFetch: 0
        };
        console.log('🗑️ [CACHE] Limpizado');
    },
    
    /**
     * Forzar refresh de datos
     */
    async refresh() {
        this.clearCache();
        await Promise.all([
            this.fetch('usuarios'),
            this.fetch('evaluaciones')
        ]);
        console.log('✅ [REFRESH] Datos actualizados');
    }
};

// Exportar para uso global
window.Database = Database;

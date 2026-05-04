import { generateWeeklyNutritionPlan, getMealRecommendationsForDay } from './trainingNutritionSync';
import { generateDailyMenu, calculateMacroDifference, getMacroTargets, generateShoppingList } from './menuGenerator';
import { trainingPhases } from '@/data/trainingPlan';

export interface PDFExportOptions {
  phase: number;
  week: number;
  includeShoppingList: boolean;
  includeEquivalences: boolean;
}

/**
 * Generar contenido HTML para PDF del plan semanal
 */
export function generateWeeklyPlanHTML(options: PDFExportOptions): string {
  const { phase, week, includeShoppingList, includeEquivalences } = options;
  const weeklyPlan = generateWeeklyNutritionPlan(phase, week);
  const phaseData = trainingPhases[phase - 1];
  const macroTargets = getMacroTargets(phase);

  let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Plan Bombero CM - Semana ${week} - Fase ${phase}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 20px;
        }
        
        .page-break {
          page-break-after: always;
          margin-bottom: 40px;
        }
        
        .header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .phase-info {
          background: #f5f5f5;
          border-left: 4px solid #ff6b35;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        
        .phase-info h3 {
          color: #ff6b35;
          margin-bottom: 8px;
        }
        
        .weekly-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .summary-card {
          background: #f9f9f9;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
        }
        
        .summary-card .label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .summary-card .value {
          font-size: 24px;
          font-weight: bold;
          color: #1a1a1a;
        }
        
        .day-section {
          margin-bottom: 40px;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .day-header {
          background: #ff6b35;
          color: white;
          padding: 15px;
          font-size: 18px;
          font-weight: bold;
        }
        
        .day-content {
          padding: 20px;
        }
        
        .intensity-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        
        .intensity-very-high {
          background: #ffebee;
          color: #c62828;
        }
        
        .intensity-high {
          background: #fff3e0;
          color: #e65100;
        }
        
        .intensity-moderate {
          background: #fffde7;
          color: #f57f17;
        }
        
        .intensity-light {
          background: #e3f2fd;
          color: #1565c0;
        }
        
        .intensity-rest {
          background: #e8f5e9;
          color: #2e7d32;
        }
        
        .training-focus {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          font-size: 14px;
        }
        
        .macros-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .macro-box {
          background: #f9f9f9;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 4px;
          text-align: center;
        }
        
        .macro-box .label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        
        .macro-box .value {
          font-size: 18px;
          font-weight: bold;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #1a1a1a;
          margin-top: 20px;
          margin-bottom: 12px;
          border-bottom: 2px solid #ff6b35;
          padding-bottom: 8px;
        }
        
        .recommendation-box {
          background: #f0f7ff;
          border-left: 4px solid #2196f3;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .recommendation-box.post {
          background: #f0fff4;
          border-left-color: #4caf50;
        }
        
        .recommendation-box.hydration {
          background: #e0f2f1;
          border-left-color: #009688;
        }
        
        .meals-list {
          margin-top: 15px;
        }
        
        .meal-item {
          background: white;
          border: 1px solid #e0e0e0;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .meal-time {
          font-weight: bold;
          color: #ff6b35;
          margin-bottom: 6px;
        }
        
        .meal-foods {
          margin-left: 12px;
          font-size: 12px;
          color: #555;
        }
        
        .meal-foods li {
          list-style: none;
          margin-bottom: 3px;
        }
        
        .meal-foods li:before {
          content: "• ";
          color: #ff6b35;
          font-weight: bold;
        }
        
        .shopping-list {
          margin-top: 20px;
        }
        
        .shopping-list h4 {
          font-size: 14px;
          margin-bottom: 10px;
          color: #1a1a1a;
        }
        
        .shopping-items {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        
        .shopping-item {
          background: #f9f9f9;
          border: 1px solid #ddd;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
        }
        
        .equivalences-section {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
        }
        
        .equivalences-section h3 {
          color: #1a1a1a;
          margin-bottom: 15px;
          font-size: 16px;
        }
        
        .equivalence-group {
          background: white;
          border: 1px solid #ddd;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .equivalence-group h4 {
          color: #ff6b35;
          margin-bottom: 8px;
          font-size: 12px;
        }
        
        .equivalence-group p {
          color: #555;
          line-height: 1.5;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        
        @media print {
          body {
            padding: 0;
          }
          .page-break {
            page-break-after: always;
          }
        }
      </style>
    </head>
    <body>
  `;

  // Header
  html += `
    <div class="header">
      <h1>🔥 Plan Bombero CM</h1>
      <p>Semana ${week} - ${phaseData.name}</p>
      <p>${phaseData.weeks}</p>
    </div>
  `;

  // Phase Info
  html += `
    <div class="phase-info">
      <h3>Objetivo de la Fase</h3>
      <p>${phaseData.objective}</p>
    </div>
  `;

  // Weekly Summary
  const weeklyPlanData = generateWeeklyNutritionPlan(phase, week);
  html += `
    <div class="weekly-summary">
      <div class="summary-card">
        <div class="label">Calorías Totales</div>
        <div class="value">${weeklyPlanData.totalWeeklyKcal}</div>
        <div class="label" style="margin-top: 8px; font-size: 11px;">${weeklyPlanData.averageDailyKcal}/día</div>
      </div>
      <div class="summary-card">
        <div class="label">Proteína</div>
        <div class="value">${weeklyPlanData.totalWeeklyProtein}g</div>
      </div>
      <div class="summary-card">
        <div class="label">Carbohidratos</div>
        <div class="value">${weeklyPlanData.totalWeeklyCarbs}g</div>
      </div>
      <div class="summary-card">
        <div class="label">Grasas</div>
        <div class="value">${weeklyPlanData.totalWeeklyFat}g</div>
      </div>
    </div>
  `;

  // Daily Plans
  weeklyPlanData.days.forEach((day, idx) => {
    const mealRecs = getMealRecommendationsForDay(phase, day.dayName);
    const dailyMenu = generateDailyMenu({ phase, dayOfWeek: day.dayName });
    const shoppingList = generateShoppingList(dailyMenu);

    const intensityClass = `intensity-${day.training.intensity}`;
    const intensityLabel = {
      'very-high': '🔥 Muy Intenso',
      'high': '💪 Intenso',
      'moderate': '⚡ Moderado',
      'light': '🟢 Ligero',
      'rest': '😴 Descanso',
    }[day.training.intensity] || 'Entrenamiento';

    html += `
      <div class="day-section">
        <div class="day-header">${day.dayName}</div>
        <div class="day-content">
          <span class="intensity-badge ${intensityClass}">${intensityLabel}</span>
          
          <div class="training-focus">
            <strong>Enfoque:</strong> ${day.training.focus}
          </div>
          
          <div class="section-title">📊 Macronutrientes</div>
          <div class="macros-grid">
            <div class="macro-box">
              <div class="label">Calorías</div>
              <div class="value">${day.recommendedKcal}</div>
            </div>
            <div class="macro-box">
              <div class="label">Proteína</div>
              <div class="value" style="color: #d32f2f;">${day.recommendedProtein}g</div>
            </div>
            <div class="macro-box">
              <div class="label">Carbos</div>
              <div class="value" style="color: #388e3c;">${day.recommendedCarbs}g</div>
            </div>
            <div class="macro-box">
              <div class="label">Grasas</div>
              <div class="value" style="color: #f57c00;">${day.recommendedFat}g</div>
            </div>
          </div>
          
          <div class="section-title">🍽️ Pre-Entreno</div>
          <div class="recommendation-box">
            <strong>${mealRecs.preWorkout.recommendation}</strong>
            <div style="margin-top: 8px; font-size: 12px;">
              ⏰ ${mealRecs.preWorkout.timing} | 
              🎯 ${mealRecs.preWorkout.kcalTarget} kcal | 
              P: ${mealRecs.preWorkout.proteinTarget}g | 
              C: ${mealRecs.preWorkout.carbsTarget}g
            </div>
          </div>
          
          <div class="section-title">🏃 Post-Entreno</div>
          <div class="recommendation-box post">
            <strong>${mealRecs.postWorkout.recommendation}</strong>
            <div style="margin-top: 8px; font-size: 12px;">
              ⏰ ${mealRecs.postWorkout.timing} | 
              🎯 ${mealRecs.postWorkout.kcalTarget} kcal | 
              P: ${mealRecs.postWorkout.proteinTarget}g | 
              C: ${mealRecs.postWorkout.carbsTarget}g
            </div>
          </div>
          
          <div class="section-title">💧 Hidratación</div>
          <div class="recommendation-box hydration">
            <strong>${mealRecs.hydration.recommendation}</strong>
          </div>
          
          <div class="section-title">📋 Menú del Día</div>
          <div class="meals-list">
            ${dailyMenu.meals.map(meal => `
              <div class="meal-item">
                <div class="meal-time">${meal.time} - ${meal.name}</div>
                <ul class="meal-foods">
                  ${meal.foods.map(food => `<li>${food.name} (${food.serving})</li>`).join('')}
                </ul>
                <div style="margin-top: 6px; font-size: 11px; color: #999;">
                  ${Math.round(meal.totalKcal)} kcal | P: ${Math.round(meal.totalProtein)}g | C: ${Math.round(meal.totalCarbs)}g | F: ${Math.round(meal.totalFat)}g
                </div>
              </div>
            `).join('')}
          </div>
          
          ${includeShoppingList ? `
            <div class="shopping-list">
              <h4>🛒 Lista de Compra para Este Día</h4>
              <div class="shopping-items">
                ${Object.entries(shoppingList).map(([item, qty]) => `
                  <div class="shopping-item">
                    <span>${item}</span>
                    <span style="font-weight: bold;">${qty}x</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Page break after each day except the last
    if (idx < weeklyPlanData.days.length - 1) {
      html += '<div class="page-break"></div>';
    }
  });

  // Equivalences Section
  if (includeEquivalences) {
    html += `
      <div class="page-break"></div>
      <div class="equivalences-section">
        <h3>📊 Tabla de Equivalencias de Alimentos</h3>
        <p style="margin-bottom: 15px; color: #666; font-size: 13px;">
          Intercambia alimentos manteniendo los macronutrientes. Usa esta tabla para adaptar el menú a tus preferencias y disponibilidad.
        </p>
        
        <div class="equivalence-group">
          <h4>PROTEÍNA (100g)</h4>
          <p>100g Pechuga pollo = 100g Pavo = 1 lata atún (160g) = 120g Tofu = 4 claras huevo = 150g Merluza</p>
        </div>
        
        <div class="equivalence-group">
          <h4>CARBOHIDRATOS (100g crudo)</h4>
          <p>100g Arroz = 100g Pasta = 400g Patata cocida = 100g Avena = 120g Pan integral = 200g Lentejas cocidas = 200g Garbanzos cocidos</p>
        </div>
        
        <div class="equivalence-group">
          <h4>GRASAS (15ml aceite)</h4>
          <p>15ml Aceite oliva = 15g Frutos secos = 15g Mantequilla cacahuete = 1/3 Aguacate mediano = 60ml Leche entera</p>
        </div>
        
        <div class="equivalence-group">
          <h4>VERDURAS (sin límite)</h4>
          <p>Brócoli, espinacas, ensalada, zanahoria, calabacín, tomate. Puedes comer cantidades ilimitadas. No cuentan en macros.</p>
        </div>
      </div>
    `;
  }

  // Footer
  html += `
    <div class="footer">
      <p>Plan Bombero CM - Oposición Comunidad de Madrid</p>
      <p>Generado: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p>Diseñado con criterio de alto rendimiento, prevención de lesiones y periodización avanzada</p>
    </div>
  `;

  html += `
    </body>
    </html>
  `;

  return html;
}

/**
 * Descargar PDF usando html2pdf
 */
export async function downloadWeeklyPlanPDF(options: PDFExportOptions) {
  const html = generateWeeklyPlanHTML(options);

  // Crear elemento temporal
  const element = document.createElement('div');
  element.innerHTML = html;

  // Usar html2pdf si está disponible, si no usar método alternativo
  try {
    // Intentar usar html2pdf si está disponible
    if ((window as any).html2pdf) {
      (window as any).html2pdf().set({
        margin: 10,
        filename: `plan-bombero-fase${options.phase}-semana${options.week}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      }).from(element).save();
    } else {
      // Fallback: abrir en nueva ventana para imprimir
      const newWindow = window.open('', '', 'width=800,height=600');
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
        newWindow.print();
      }
    }
  } catch (error) {
    console.error('Error al generar PDF:', error);
    // Fallback: abrir en nueva ventana
    const newWindow = window.open('', '', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.print();
    }
  }
}

/**
 * Generar blob de PDF para descarga
 */
export function generatePDFBlob(options: PDFExportOptions): Blob {
  const html = generateWeeklyPlanHTML(options);
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

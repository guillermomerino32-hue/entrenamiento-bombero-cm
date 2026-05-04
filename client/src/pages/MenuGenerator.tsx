import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { trainingPhases } from '@/data/trainingPlan';
import {
  generateDailyMenu,
  getMacroTargets,
  calculateMacroDifference,
  generateShoppingList,
  exportMenuAsText,
  suggestFoodSwaps,
} from '@/lib/menuGenerator';
import { ChefHat, RefreshCw, Download, ShoppingCart, TrendingUp } from 'lucide-react';

export default function MenuGenerator() {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedDay, setSelectedDay] = useState('LUNES');
  const [currentMenu, setCurrentMenu] = useState(generateDailyMenu({ phase: 1, dayOfWeek: 'LUNES' }));
  const [preferences, setPreferences] = useState({
    vegetarian: false,
    excludeFoods: [] as string[],
  });

  const phase = trainingPhases[selectedPhase];
  const macroTargets = getMacroTargets(selectedPhase + 1);
  const macroDiff = calculateMacroDifference(
    {
      kcal: currentMenu.totalKcal,
      protein: currentMenu.totalProtein,
      carbs: currentMenu.totalCarbs,
      fat: currentMenu.totalFat,
    },
    macroTargets
  );

  const handleGenerateMenu = () => {
    const newMenu = generateDailyMenu({
      phase: selectedPhase + 1,
      dayOfWeek: selectedDay,
      preferences,
    });
    setCurrentMenu(newMenu);
  };

  const handleExportMenu = () => {
    const text = exportMenuAsText(currentMenu);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `menu-${currentMenu.dayOfWeek}-${currentMenu.date}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shoppingList = generateShoppingList(currentMenu);

  const getMacroColor = (diff: number) => {
    if (Math.abs(diff) < 5) return 'text-green-400';
    if (Math.abs(diff) < 15) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Generador de Menús</h1>
            </div>
            <div className="flex gap-2">
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                🏠 Inicio
              </a>
              <a href="/progress-tracker" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📈 Progreso
              </a>
              <a href="/weekly-plan" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📅 Plan
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Crea menús diarios automáticos con macronutrientes precisos</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phase Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trainingPhases.map((p, idx) => (
                  <Button
                    key={p.id}
                    variant={selectedPhase === idx ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedPhase(idx);
                      handleGenerateMenu();
                    }}
                    className="w-full justify-start text-left h-auto flex-col items-start p-3"
                  >
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs opacity-70">{p.weeks}</div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Day Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Día de la Semana</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {phase.days.map(day => (
                  <Button
                    key={day.id}
                    variant={selectedDay === day.name ? 'default' : 'outline'}
                    onClick={() => setSelectedDay(day.name)}
                    className="w-full justify-start"
                    size="sm"
                  >
                    {day.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preferencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="vegetarian"
                    checked={preferences.vegetarian}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, vegetarian: checked as boolean })
                    }
                  />
                  <label htmlFor="vegetarian" className="text-sm cursor-pointer">
                    Vegetariano
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={handleGenerateMenu} className="w-full" size="lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                Generar Menú
              </Button>
              <Button onClick={handleExportMenu} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>

          {/* Right Panel - Menu Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Macro Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Macronutrientes</CardTitle>
                <CardDescription>Comparación con objetivos de la fase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-2">CALORÍAS</div>
                    <div className="text-2xl font-bold text-foreground">{currentMenu.totalKcal}</div>
                    <div className={`text-xs mt-2 ${getMacroColor(macroDiff.kcal.percent)}`}>
                      {macroDiff.kcal.value > 0 ? '+' : ''}{Math.round(macroDiff.kcal.percent)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Objetivo: {macroTargets.kcal}</div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-2">PROTEÍNA</div>
                    <div className="text-2xl font-bold text-red-400">{Math.round(currentMenu.totalProtein)}g</div>
                    <div className={`text-xs mt-2 ${getMacroColor(macroDiff.protein.percent)}`}>
                      {macroDiff.protein.value > 0 ? '+' : ''}{Math.round(macroDiff.protein.percent)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Objetivo: {macroTargets.protein}g</div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-2">CARBOS</div>
                    <div className="text-2xl font-bold text-green-400">{Math.round(currentMenu.totalCarbs)}g</div>
                    <div className={`text-xs mt-2 ${getMacroColor(macroDiff.carbs.percent)}`}>
                      {macroDiff.carbs.value > 0 ? '+' : ''}{Math.round(macroDiff.carbs.percent)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Objetivo: {macroTargets.carbs}g</div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-2">GRASAS</div>
                    <div className="text-2xl font-bold text-yellow-400">{Math.round(currentMenu.totalFat)}g</div>
                    <div className={`text-xs mt-2 ${getMacroColor(macroDiff.fat.percent)}`}>
                      {macroDiff.fat.value > 0 ? '+' : ''}{Math.round(macroDiff.fat.percent)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Objetivo: {macroTargets.fat}g</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meals Tabs */}
            <Tabs defaultValue="meals" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="meals">Comidas</TabsTrigger>
                <TabsTrigger value="shopping">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Compra
                </TabsTrigger>
                <TabsTrigger value="equivalences">Intercambios</TabsTrigger>
              </TabsList>

              {/* Meals Tab */}
              <TabsContent value="meals" className="space-y-4">
                {currentMenu.meals.map((meal, idx) => (
                  <Card key={idx} className="border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{meal.time}</CardTitle>
                          <CardDescription>{meal.name}</CardDescription>
                        </div>
                        <Badge variant="outline">{meal.mealType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {meal.foods.map((food, foodIdx) => (
                          <div key={foodIdx} className="flex items-center justify-between text-sm bg-background/50 p-2 rounded">
                            <span className="text-foreground">{food.name}</span>
                            <span className="text-xs text-muted-foreground">{food.serving}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border/50 pt-3 grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground">kcal</div>
                          <div className="font-bold text-foreground">{Math.round(meal.totalKcal)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">P</div>
                          <div className="font-bold text-red-400">{Math.round(meal.totalProtein)}g</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">C</div>
                          <div className="font-bold text-green-400">{Math.round(meal.totalCarbs)}g</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">F</div>
                          <div className="font-bold text-yellow-400">{Math.round(meal.totalFat)}g</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Shopping List Tab */}
              <TabsContent value="shopping">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lista de Compra</CardTitle>
                    <CardDescription>Alimentos necesarios para este menú</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(shoppingList).map(([item, qty], idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-sm text-foreground">{item}</span>
                          <Badge variant="secondary">{qty}x</Badge>
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => {
                      const list = Object.entries(shoppingList)
                        .map(([item, qty]) => `${qty}x ${item}`)
                        .join('\n');
                      const element = document.createElement('a');
                      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(list));
                      element.setAttribute('download', `lista-compra-${currentMenu.date}.txt`);
                      element.style.display = 'none';
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }} className="w-full mt-4">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Lista
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Equivalences Tab */}
              <TabsContent value="equivalences">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tabla de Equivalencias</CardTitle>
                    <CardDescription>Intercambia alimentos manteniendo los macros</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="font-bold text-sm mb-2 text-blue-400">Proteína (100g)</h4>
                      <p className="text-sm text-muted-foreground">
                        100g Pechuga pollo = 100g Pavo = 1 lata atún = 120g Tofu = 4 claras huevo
                      </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <h4 className="font-bold text-sm mb-2 text-green-400">Carbohidratos (100g crudo)</h4>
                      <p className="text-sm text-muted-foreground">
                        100g Arroz = 100g Pasta = 400g Patata cocida = 100g Avena = 120g Pan integral = 200g Lentejas
                      </p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <h4 className="font-bold text-sm mb-2 text-yellow-400">Grasas (15ml aceite)</h4>
                      <p className="text-sm text-muted-foreground">
                        15ml Aceite oliva = 15g Frutos secos = 15g Mantequilla cacahuete = 1/3 Aguacate
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

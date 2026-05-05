import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, ChefHat, Flame, Zap, Droplet, Plus } from 'lucide-react';
import { recipes } from '@/data/recipeDatabase';

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'pre-workout' | 'post-workout';

export default function RecipeLibrary() {
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: '🌅 Desayuno',
    lunch: '🍽️ Comida',
    snack: '🥜 Snack',
    dinner: '🌙 Cena',
    'pre-workout': '⚡ Pre-entreno',
    'post-workout': '💪 Post-entreno',
  };

  const mealTypeColors: Record<MealType, string> = {
    breakfast: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    lunch: 'bg-green-500/10 border-green-500/30 text-green-400',
    snack: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    dinner: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    'pre-workout': 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    'post-workout': 'bg-red-500/10 border-red-500/30 text-red-400',
  };

  // Filtrar recetas
  const filteredRecipes = recipes
    .filter(recipe => recipe.mealType === selectedMealType)
    .filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const selectedRecipeData = selectedRecipe
    ? recipes.find(r => r.id === selectedRecipe)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Biblioteca de Recetas</h1>
            </div>
            <div className="flex gap-2">
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                🏠 Inicio
              </a>
              <a href="/weekly-plan" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                📅 Plan Semanal
              </a>
              <a href="/menu-generator" className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
                🍽️ Menús
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">Recetas detalladas organizadas por tipo de comida con información nutricional completa</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Meal Types & Search */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tipo de Comida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(Object.entries(mealTypeLabels) as [MealType, string][]).map(([type, label]) => (
                  <Button
                    key={type}
                    variant={selectedMealType === type ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedMealType(type);
                      setSelectedRecipe(null);
                    }}
                    className="w-full justify-start text-left h-auto flex-col items-start p-3"
                  >
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-xs opacity-70">
                      {recipes.filter(r => r.mealType === type).length} recetas
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Search */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Buscar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar receta o ingrediente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedRecipeData ? (
              // Recipe Detail View
              <div className="space-y-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRecipe(null)}
                  className="mb-4"
                >
                  ← Volver a lista
                </Button>

                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl">{selectedRecipeData.name}</CardTitle>
                        <CardDescription className="text-base mt-2">{selectedRecipeData.description}</CardDescription>
                      </div>
                      <Badge className={`${mealTypeColors[selectedRecipeData.mealType]} border`}>
                        {mealTypeLabels[selectedRecipeData.mealType]}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Nutritional Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Información Nutricional</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">CALORÍAS</div>
                          <div className="text-2xl font-bold text-foreground">{selectedRecipeData.kcal}</div>
                          <div className="text-xs text-muted-foreground mt-1">kcal</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">PROTEÍNA</div>
                          <div className="text-2xl font-bold text-red-400">{selectedRecipeData.protein}g</div>
                          <div className="text-xs text-muted-foreground mt-1">proteína</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">CARBOS</div>
                          <div className="text-2xl font-bold text-green-400">{selectedRecipeData.carbs}g</div>
                          <div className="text-xs text-muted-foreground mt-1">carbohidratos</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1">GRASAS</div>
                          <div className="text-2xl font-bold text-yellow-400">{selectedRecipeData.fat}g</div>
                          <div className="text-xs text-muted-foreground mt-1">grasas</div>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Ingredientes</h3>
                      <div className="bg-background/50 rounded-lg p-4 border border-border/50 space-y-2">
                        {selectedRecipeData.ingredients.map((ingredient, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-primary font-bold">•</span>
                            <span>{ingredient}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">Preparación</h3>
                      <div className="bg-background/50 rounded-lg p-4 border border-border/50 space-y-3">
                        {selectedRecipeData.instructions.map((instruction, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {idx + 1}
                            </div>
                            <p className="text-sm text-muted-foreground pt-0.5">{instruction}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedRecipeData.notes && (
                      <div>
                        <h3 className="font-bold text-lg mb-4">Notas</h3>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-muted-foreground">
                          💡 {selectedRecipeData.notes}
                        </div>
                      </div>
                    )}

                    {/* Timing */}
                    {selectedRecipeData.timing && (
                      <div>
                        <h3 className="font-bold text-lg mb-4">Timing Recomendado</h3>
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-sm text-muted-foreground">
                          ⏰ {selectedRecipeData.timing}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Recipe List View
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{mealTypeLabels[selectedMealType]}</h2>
                  <p className="text-muted-foreground">
                    {filteredRecipes.length} receta{filteredRecipes.length !== 1 ? 's' : ''} disponible{filteredRecipes.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {filteredRecipes.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No se encontraron recetas</p>
                      <p className="text-xs text-muted-foreground mt-2">Intenta con otro término de búsqueda</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredRecipes.map((recipe) => (
                      <Card
                        key={recipe.id}
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setSelectedRecipe(recipe.id)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{recipe.name}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{recipe.description}</p>

                              <div className="grid grid-cols-4 gap-3 mb-3">
                                <div className="text-xs">
                                  <div className="text-muted-foreground">Calorías</div>
                                  <div className="font-bold text-foreground">{recipe.kcal}</div>
                                </div>
                                <div className="text-xs">
                                  <div className="text-muted-foreground">Proteína</div>
                                  <div className="font-bold text-red-400">{recipe.protein}g</div>
                                </div>
                                <div className="text-xs">
                                  <div className="text-muted-foreground">Carbos</div>
                                  <div className="font-bold text-green-400">{recipe.carbs}g</div>
                                </div>
                                <div className="text-xs">
                                  <div className="text-muted-foreground">Grasas</div>
                                  <div className="font-bold text-yellow-400">{recipe.fat}g</div>
                                </div>
                              </div>

                              {recipe.timing && (
                                <div className="text-xs text-muted-foreground">
                                  ⏰ {recipe.timing}
                                </div>
                              )}
                            </div>

                            <div className="flex-shrink-0">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRecipe(recipe.id);
                                }}
                              >
                                Ver Receta
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

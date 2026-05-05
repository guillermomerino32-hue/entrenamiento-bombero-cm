import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MenuGenerator from "./pages/MenuGenerator";
import WeeklyPlan from "./pages/WeeklyPlan";
import ProgressTracker from "./pages/ProgressTracker";
import YearlyCalendar from "./pages/YearlyCalendar";
import CalendarExporter from "./pages/CalendarExporter";
import TrainingDetails from "./pages/TrainingDetails";
import RecipeLibrary from "./pages/RecipeLibrary";
import NotionSync from "./pages/NotionSync";


function Router() {
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/menu-generator"} component={MenuGenerator} />
      <Route path={"/weekly-plan"} component={WeeklyPlan} />
      <Route path={"/progress-tracker"} component={ProgressTracker} />
      <Route path={"/yearly-calendar"} component={YearlyCalendar} />
      <Route path={"/calendar-exporter"} component={CalendarExporter} />
      <Route path={"/training-details"} component={TrainingDetails} />
      <Route path={"/recipe-library"} component={RecipeLibrary} />
      <Route path={"/notion-sync"} component={NotionSync} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

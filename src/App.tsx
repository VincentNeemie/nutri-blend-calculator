import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Index from "./pages/Index";
import Ingredientes from "./pages/Ingredientes";
import CriarFormula from "./pages/CriarFormula";
import ListarFormulas from "./pages/ListarFormulas";
import EditarFormula from "./pages/EditarFormula";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ingredientes" element={<Ingredientes />} />
            <Route path="/criar-formula" element={<CriarFormula />} />
            <Route path="/listar-formulas" element={<ListarFormulas />} />
            <Route path="/editar-formula/:id" element={<EditarFormula />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

import React from 'react';
import MenuCard from '@/components/MenuCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Plus, FlaskRound, List } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="page-container flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Calculadora de Rações
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Crie e gerencie fórmulas de ração com facilidade, calculando automaticamente 
          os nutrientes e preços finais.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MenuCard 
          to="/ingredientes"
          title="Cadastrar Ingredientes"
          description="Adicione e gerencie os ingredientes disponíveis para suas fórmulas."
          icon={<Plus className="h-10 w-10" />}
        />
        
        <MenuCard 
          to="/criar-formula"
          title="Criar Nova Fórmula"
          description="Crie fórmulas de ração balanceadas a partir dos ingredientes cadastrados."
          icon={<FlaskRound className="h-10 w-10" />}
        />
        
        <MenuCard 
          to="/listar-formulas"
          title="Listar Fórmulas Salvas"
          description="Veja e gerencie todas as fórmulas que você já salvou."
          icon={<List className="h-10 w-10" />}
        />
      </div>
    </div>
  );
};

export default Index;

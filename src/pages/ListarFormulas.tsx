
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Formula, getFormulas, excluirFormula } from '@/utils/storage';
import FormulaItem from '@/components/FormulaItem';
import { useToast } from '@/components/ui/use-toast';

const ListarFormulas: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  
  // Carregar fórmulas
  const carregarFormulas = () => {
    const listaFormulas = getFormulas();
    setFormulas(listaFormulas);
  };
  
  useEffect(() => {
    carregarFormulas();
  }, []);
  
  const handleEditFormula = (formula: Formula) => {
    navigate(`/editar-formula/${formula.id}`);
  };
  
  const handleDeleteFormula = (id: string) => {
    excluirFormula(id);
    toast({
      title: "Fórmula excluída",
      description: "A fórmula foi excluída com sucesso."
    });
    carregarFormulas();
  };
  
  return (
    <div className="page-container">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar ao Menu Principal
      </Link>
      
      <h1 className="page-title">Fórmulas Salvas</h1>
      
      <div className="flex justify-end mb-6">
        <Button onClick={() => navigate('/criar-formula')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fórmula
        </Button>
      </div>
      
      {formulas.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">Nenhuma fórmula cadastrada ainda.</p>
          <Button onClick={() => navigate('/criar-formula')}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Fórmula
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formulas.map((formula) => (
            <FormulaItem 
              key={formula.id}
              formula={formula}
              onEdit={handleEditFormula}
              onDelete={handleDeleteFormula}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListarFormulas;

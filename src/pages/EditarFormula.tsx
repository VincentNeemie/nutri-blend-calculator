
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Formula, getFormulaPorId } from '@/utils/storage';
import FormulaForm from '@/components/FormulaForm';
import { useToast } from '@/components/ui/use-toast';

const EditarFormula: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formula, setFormula] = useState<Formula | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    if (id) {
      const formulaEncontrada = getFormulaPorId(id);
      if (formulaEncontrada) {
        setFormula(formulaEncontrada);
      } else {
        setNotFound(true);
        toast({
          title: "Fórmula não encontrada",
          description: "A fórmula que você está tentando editar não existe.",
          variant: "destructive"
        });
      }
    }
  }, [id, toast]);
  
  const handleSaveFormula = () => {
    toast({
      title: "Fórmula atualizada",
      description: "A fórmula foi atualizada com sucesso."
    });
    navigate('/listar-formulas');
  };
  
  const handleCancelForm = () => {
    navigate('/listar-formulas');
  };
  
  if (notFound) {
    return (
      <div className="page-container">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao Menu Principal
        </Link>
        
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Fórmula não encontrada</h1>
          <p className="text-gray-600 mb-4">A fórmula que você está tentando editar não existe ou foi removida.</p>
          <Button onClick={() => navigate('/listar-formulas')}>
            Ver Fórmulas Disponíveis
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar ao Menu Principal
      </Link>
      
      <h1 className="page-title">Editar Fórmula</h1>
      
      {formula ? (
        <div className="form-container">
          <FormulaForm
            formula={formula}
            onSave={handleSaveFormula}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-gray-500">Carregando fórmula...</p>
        </div>
      )}
    </div>
  );
};

export default EditarFormula;

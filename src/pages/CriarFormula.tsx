import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Formula, getFormulas } from '@/utils/storage';
import FormulaForm from '@/components/FormulaForm';
import { useToast } from '@/components/ui/use-toast';

const CriarFormula: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingFormula, setEditingFormula] = useState<Formula | undefined>(undefined);
  
  const handleSaveFormula = () => {
    toast({
      title: "Fórmula salva",
      description: "A fórmula foi salva com sucesso."
    });
    setEditingFormula(undefined);
    navigate('/listar-formulas');
  };
  
  const handleCancelForm = () => {
    setEditingFormula(undefined);
    navigate('/');  // Navigate back to the home page when cancel is clicked
  };
  
  return (
    <div className="page-container">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar ao Menu Principal
      </Link>
      
      <h1 className="page-title">Criar Nova Fórmula</h1>
      
      <div className="form-container">
        <FormulaForm
          formula={editingFormula}
          onSave={handleSaveFormula}
          onCancel={handleCancelForm}
        />
      </div>
    </div>
  );
};

export default CriarFormula;

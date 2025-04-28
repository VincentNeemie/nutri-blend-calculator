
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, Edit } from 'lucide-react';
import { Formula } from '@/utils/storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FormulaItemProps {
  formula: Formula;
  onEdit: (formula: Formula) => void;
  onDelete: (id: string) => void;
}

const FormulaItem: React.FC<FormulaItemProps> = ({
  formula,
  onEdit,
  onDelete
}) => {
  // Formatar a data
  const dataFormatada = new Date(formula.dataCriacao).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return (
    <div className="formula-card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{formula.nome}</h3>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(formula)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Fórmula</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir "{formula.nome}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(formula.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mb-2">
        Criado em: {dataFormatada}
      </div>
      
      <div className="text-xl text-primary font-medium mb-3">
        R$ {formula.precoFinal.toFixed(2)} / kg
      </div>
      
      <div className="text-sm text-gray-600">
        <div className="font-medium mb-1">Nutrientes:</div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
          {formula.nutrientesCalculados.map((nutriente, index) => (
            <li key={index} className="flex justify-between">
              <span>{nutriente.nome}:</span>
              <span className="font-medium">
                {nutriente.valor} {nutriente.unidade}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormulaItem;

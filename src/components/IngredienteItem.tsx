
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, Edit } from 'lucide-react';
import { Ingrediente } from '@/utils/storage';
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

interface IngredienteItemProps {
  ingrediente: Ingrediente;
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (id: string) => void;
}

const IngredienteItem: React.FC<IngredienteItemProps> = ({
  ingrediente,
  onEdit,
  onDelete
}) => {
  return (
    <div className="ingrediente-card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{ingrediente.nome}</h3>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(ingrediente)}
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
                <AlertDialogTitle>Excluir Ingrediente</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir "{ingrediente.nome}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(ingrediente.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="text-sm text-primary font-medium mb-2">
        R$ {ingrediente.preco.toFixed(2)} / kg
      </div>
      
      <div className="text-sm text-gray-600">
        <div className="font-medium mb-1">Nutrientes:</div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
          {ingrediente.nutrientes.map((nutriente, index) => (
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

export default IngredienteItem;

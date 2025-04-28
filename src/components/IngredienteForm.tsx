
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash, Plus } from 'lucide-react';
import { Ingrediente, Nutriente, salvarIngrediente, validarIngrediente } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

interface IngredienteFormProps {
  ingrediente?: Ingrediente;
  onSave: () => void;
  onCancel: () => void;
}

const IngredienteForm: React.FC<IngredienteFormProps> = ({ 
  ingrediente,
  onSave,
  onCancel
}) => {
  const isEditing = !!ingrediente;
  const { toast } = useToast();
  
  const [nome, setNome] = useState(ingrediente?.nome || '');
  const [preco, setPreco] = useState(ingrediente?.preco?.toString() || '');
  const [nutrientes, setNutrientes] = useState<Nutriente[]>(
    ingrediente?.nutrientes || [{ nome: '', valor: 0, unidade: 'g/kg' }]
  );
  
  const handleAddNutriente = () => {
    setNutrientes([...nutrientes, { nome: '', valor: 0, unidade: 'g/kg' }]);
  };
  
  const handleRemoveNutriente = (index: number) => {
    if (nutrientes.length <= 1) return;
    const novoNutrientes = [...nutrientes];
    novoNutrientes.splice(index, 1);
    setNutrientes(novoNutrientes);
  };
  
  const handleNutrienteChange = (index: number, campo: keyof Nutriente, valor: string | number) => {
    const novoNutrientes = [...nutrientes];
    novoNutrientes[index] = {
      ...novoNutrientes[index],
      [campo]: campo === 'valor' ? parseFloat(valor as string) || 0 : valor
    };
    setNutrientes(novoNutrientes);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoIngrediente: Ingrediente = {
      id: ingrediente?.id || `ingrediente_${Date.now()}`,
      nome,
      preco: parseFloat(preco),
      nutrientes: nutrientes.filter(n => n.nome.trim() !== '')
    };
    
    // Validar o ingrediente
    if (!validarIngrediente(novoIngrediente)) {
      toast({
        title: "Erro ao salvar",
        description: "Verifique se todos os campos estão preenchidos corretamente.",
        variant: "destructive"
      });
      return;
    }
    
    // Salvar o ingrediente
    salvarIngrediente(novoIngrediente);
    toast({
      title: isEditing ? "Ingrediente atualizado" : "Ingrediente adicionado",
      description: `${nome} foi ${isEditing ? 'atualizado' : 'adicionado'} com sucesso.`
    });
    onSave();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Ingrediente</Label>
          <Input 
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Milho, Farelo de Soja, etc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="preco">Preço por Kg (R$)</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            min="0"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Nutrientes</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddNutriente}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Nutriente
            </Button>
          </div>
          
          {nutrientes.map((nutriente, index) => (
            <div key={index} className="flex gap-3 items-start pt-2">
              <div className="flex-1">
                <Input
                  value={nutriente.nome}
                  onChange={(e) => handleNutrienteChange(index, 'nome', e.target.value)}
                  placeholder="Nome (ex: Proteína)"
                  required
                />
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={nutriente.valor}
                  onChange={(e) => handleNutrienteChange(index, 'valor', e.target.value)}
                  placeholder="Valor"
                  required
                />
              </div>
              <div className="w-24">
                <Input
                  value={nutriente.unidade}
                  onChange={(e) => handleNutrienteChange(index, 'unidade', e.target.value)}
                  placeholder="Unidade"
                  required
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                disabled={nutrientes.length <= 1}
                onClick={() => handleRemoveNutriente(index)}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEditing ? 'Atualizar' : 'Adicionar'} Ingrediente
        </Button>
      </div>
    </form>
  );
};

export default IngredienteForm;

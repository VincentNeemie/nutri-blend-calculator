
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Plus } from 'lucide-react';
import { 
  Ingrediente, 
  Nutriente, 
  getIngredientes,
  calcularNutrientes,
  calcularPrecoFinal,
  criarFormula,
  salvarFormula,
  Formula
} from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

interface FormulaFormProps {
  formula?: Formula;
  onSave: () => void;
  onCancel: () => void;
}

const FormulaForm: React.FC<FormulaFormProps> = ({ 
  formula,
  onSave,
  onCancel
}) => {
  const isEditing = !!formula;
  const { toast } = useToast();
  
  const [nome, setNome] = useState(formula?.nome || '');
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState<Ingrediente[]>([]);
  const [composicao, setComposicao] = useState<{ ingredienteId: string; porcentagem: number }[]>(
    formula?.composicao || [{ ingredienteId: '', porcentagem: 0 }]
  );
  const [nutrientesCalculados, setNutrientesCalculados] = useState<Nutriente[]>([]);
  const [precoFinal, setPrecoFinal] = useState(0);
  
  // Carregar ingredientes disponíveis
  useEffect(() => {
    const ingredientes = getIngredientes();
    setIngredientesDisponiveis(ingredientes);
    
    // Se estiver editando, calcule os valores iniciais
    if (formula) {
      recalcularFormula(formula.composicao, ingredientes);
    }
  }, [formula]);
  
  const recalcularFormula = (
    novaComposicao: { ingredienteId: string; porcentagem: number }[],
    ingredientes: Ingrediente[] = ingredientesDisponiveis
  ) => {
    // Filtra composição inválida
    const composicaoValida = novaComposicao.filter(
      c => c.ingredienteId && c.porcentagem > 0
    );
    
    if (composicaoValida.length === 0) {
      setNutrientesCalculados([]);
      setPrecoFinal(0);
      return;
    }
    
    // Calcula nutrientes
    const nutrientes = calcularNutrientes(ingredientes, composicaoValida);
    setNutrientesCalculados(nutrientes);
    
    // Calcula preço final
    const preco = calcularPrecoFinal(ingredientes, composicaoValida);
    setPrecoFinal(preco);
  };
  
  const handleAddIngrediente = () => {
    const novaComposicao = [...composicao, { ingredienteId: '', porcentagem: 0 }];
    setComposicao(novaComposicao);
  };
  
  const handleRemoveIngrediente = (index: number) => {
    if (composicao.length <= 1) return;
    
    const novaComposicao = [...composicao];
    novaComposicao.splice(index, 1);
    setComposicao(novaComposicao);
    
    // Recalcular
    recalcularFormula(novaComposicao);
  };
  
  const handleIngredienteChange = (index: number, campo: string, valor: string | number) => {
    const novaComposicao = [...composicao];
    
    if (campo === 'ingredienteId') {
      novaComposicao[index].ingredienteId = valor as string;
    } else if (campo === 'porcentagem') {
      novaComposicao[index].porcentagem = parseFloat(valor as string) || 0;
    }
    
    setComposicao(novaComposicao);
    
    // Recalcular
    recalcularFormula(novaComposicao);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se tem nome
    if (!nome.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "É necessário dar um nome para a fórmula.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar se tem ingredientes válidos
    const composicaoValida = composicao.filter(
      c => c.ingredienteId && c.porcentagem > 0
    );
    
    if (composicaoValida.length === 0) {
      toast({
        title: "Erro ao salvar",
        description: "Adicione pelo menos um ingrediente com porcentagem maior que zero.",
        variant: "destructive"
      });
      return;
    }
    
    // Criar/atualizar fórmula
    const novaFormula = criarFormula(nome, ingredientesDisponiveis, composicaoValida);
    
    // Se estiver editando, mantenha o ID original
    if (isEditing && formula) {
      novaFormula.id = formula.id;
    }
    
    // Salvar
    salvarFormula(novaFormula);
    
    toast({
      title: isEditing ? "Fórmula atualizada" : "Fórmula criada",
      description: `${nome} foi ${isEditing ? 'atualizada' : 'criada'} com sucesso.`
    });
    
    onSave();
  };
  
  const totalPorcentagem = composicao.reduce((total, item) => total + (item.porcentagem || 0), 0);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Fórmula</Label>
          <Input 
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Ração para Bovinos, Fase de Crescimento, etc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Composição</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddIngrediente}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Ingrediente
            </Button>
          </div>
          
          {ingredientesDisponiveis.length === 0 ? (
            <div className="p-4 text-center text-gray-500 border border-dashed rounded-md">
              Nenhum ingrediente cadastrado. Vá para "Cadastrar Ingredientes" primeiro.
            </div>
          ) : (
            <>
              {composicao.map((item, index) => (
                <div key={index} className="flex gap-3 items-start pt-2">
                  <div className="flex-1">
                    <Select
                      value={item.ingredienteId}
                      onValueChange={(value) => handleIngredienteChange(index, 'ingredienteId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ingrediente" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredientesDisponiveis.map((ingrediente) => (
                          <SelectItem key={ingrediente.id} value={ingrediente.id}>
                            {ingrediente.nome} - R$ {ingrediente.preco.toFixed(2)}/kg
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.porcentagem}
                        onChange={(e) => handleIngredienteChange(index, 'porcentagem', e.target.value)}
                        placeholder="Porcentagem"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    disabled={composicao.length <= 1}
                    onClick={() => handleRemoveIngrediente(index)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              
              <div className="flex justify-end text-sm font-medium">
                Total: {totalPorcentagem.toFixed(2)}%
                {totalPorcentagem !== 100 && (
                  <span className="ml-2 text-amber-600">
                    (O ideal é 100%)
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        
        {nutrientesCalculados.length > 0 && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-md border">
            <h3 className="font-medium">Composição Nutricional Calculada:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {nutrientesCalculados.map((nutriente, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{nutriente.nome}:</span>
                  <span className="font-medium">
                    {nutriente.valor} {nutriente.unidade}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-lg font-medium text-right text-primary pt-2 border-t mt-2">
              Preço Final: R$ {precoFinal.toFixed(2)}/kg
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEditing ? 'Atualizar' : 'Salvar'} Fórmula
        </Button>
      </div>
    </form>
  );
};

export default FormulaForm;

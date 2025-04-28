
// Tipos
export interface Nutriente {
  nome: string;
  valor: number;
  unidade: string;
}

export interface Ingrediente {
  id: string;
  nome: string;
  preco: number;
  nutrientes: Nutriente[];
}

export interface Formula {
  id: string;
  nome: string;
  composicao: {
    ingredienteId: string;
    porcentagem: number;
  }[];
  nutrientesCalculados: Nutriente[];
  precoFinal: number;
  dataCriacao: string;
}

// Operações para Ingredientes
export const getIngredientes = (): Ingrediente[] => {
  const ingredientes = localStorage.getItem('ingredientes');
  return ingredientes ? JSON.parse(ingredientes) : [];
};

export const salvarIngrediente = (ingrediente: Ingrediente): void => {
  const ingredientes = getIngredientes();
  
  // Se o ingrediente já existe, atualize-o
  const index = ingredientes.findIndex(i => i.id === ingrediente.id);
  if (index >= 0) {
    ingredientes[index] = ingrediente;
  } else {
    ingredientes.push(ingrediente);
  }
  
  localStorage.setItem('ingredientes', JSON.stringify(ingredientes));
};

export const excluirIngrediente = (id: string): void => {
  const ingredientes = getIngredientes();
  const novaLista = ingredientes.filter(i => i.id !== id);
  localStorage.setItem('ingredientes', JSON.stringify(novaLista));
  
  // Também verifique se este ingrediente está em alguma fórmula e remova-o
  const formulas = getFormulas();
  const formulasAtualizadas = formulas.map(formula => {
    return {
      ...formula,
      composicao: formula.composicao.filter(c => c.ingredienteId !== id)
    };
  });
  
  localStorage.setItem('formulas', JSON.stringify(formulasAtualizadas));
};

export const getIngredientePorId = (id: string): Ingrediente | undefined => {
  const ingredientes = getIngredientes();
  return ingredientes.find(i => i.id === id);
};

// Operações para Fórmulas
export const getFormulas = (): Formula[] => {
  const formulas = localStorage.getItem('formulas');
  return formulas ? JSON.parse(formulas) : [];
};

export const salvarFormula = (formula: Formula): void => {
  const formulas = getFormulas();
  
  // Se a fórmula já existe, atualize-a
  const index = formulas.findIndex(f => f.id === formula.id);
  if (index >= 0) {
    formulas[index] = formula;
  } else {
    formulas.push(formula);
  }
  
  localStorage.setItem('formulas', JSON.stringify(formulas));
};

export const excluirFormula = (id: string): void => {
  const formulas = getFormulas();
  const novaLista = formulas.filter(f => f.id !== id);
  localStorage.setItem('formulas', JSON.stringify(novaLista));
};

export const getFormulaPorId = (id: string): Formula | undefined => {
  const formulas = getFormulas();
  return formulas.find(f => f.id === id);
};

// Funções de validação movidas do arquivo calculos.ts
export const validarIngrediente = (ingrediente: Partial<Ingrediente>): boolean => {
  if (!ingrediente.nome || ingrediente.nome.trim() === '') return false;
  if (ingrediente.preco === undefined || isNaN(ingrediente.preco) || ingrediente.preco < 0) return false;
  if (!ingrediente.nutrientes || !Array.isArray(ingrediente.nutrientes) || ingrediente.nutrientes.length === 0) return false;
  
  // Verifica se todos os nutrientes são válidos
  return ingrediente.nutrientes.every(n => 
    n.nome && n.nome.trim() !== '' && 
    n.unidade && n.unidade.trim() !== '' &&
    n.valor !== undefined && !isNaN(n.valor) && n.valor >= 0
  );
};

// Funções de cálculo também necessárias
export const calcularNutrientes = (
  ingredientes: Ingrediente[], 
  composicao: { ingredienteId: string; porcentagem: number }[]
): Nutriente[] => {
  // Mapeia todos os nutrientes possíveis
  const todosNutrientes = new Map<string, { valor: number; unidade: string }>();
  
  // Para cada ingrediente na composição
  composicao.forEach(item => {
    const ingrediente = ingredientes.find(i => i.id === item.ingredienteId);
    if (!ingrediente) return;
    
    const fator = item.porcentagem / 100;
    
    // Para cada nutriente do ingrediente
    ingrediente.nutrientes.forEach(nutriente => {
      const valorProporcional = nutriente.valor * fator;
      
      if (todosNutrientes.has(nutriente.nome)) {
        const atual = todosNutrientes.get(nutriente.nome)!;
        // Certifique-se de que as unidades são compatíveis
        if (atual.unidade === nutriente.unidade) {
          atual.valor += valorProporcional;
        }
      } else {
        todosNutrientes.set(nutriente.nome, {
          valor: valorProporcional,
          unidade: nutriente.unidade
        });
      }
    });
  });
  
  // Converte o Map em array de Nutriente
  return Array.from(todosNutrientes.entries()).map(([nome, dados]) => ({
    nome,
    valor: parseFloat(dados.valor.toFixed(2)),
    unidade: dados.unidade
  }));
};

// Calcula o preço final da ração por kg
export const calcularPrecoFinal = (
  ingredientes: Ingrediente[],
  composicao: { ingredienteId: string; porcentagem: number }[]
): number => {
  let precoTotal = 0;
  
  composicao.forEach(item => {
    const ingrediente = ingredientes.find(i => i.id === item.ingredienteId);
    if (!ingrediente) return;
    
    // Preço proporcional à porcentagem do ingrediente
    const precoProporcional = (ingrediente.preco * item.porcentagem) / 100;
    precoTotal += precoProporcional;
  });
  
  return parseFloat(precoTotal.toFixed(2));
};

// Cria uma nova fórmula com base nos ingredientes e composição
export const criarFormula = (
  nome: string,
  ingredientes: Ingrediente[],
  composicao: { ingredienteId: string; porcentagem: number }[]
): Formula => {
  // Verificar se a soma das porcentagens é 100%
  const somaTotal = composicao.reduce((soma, item) => soma + item.porcentagem, 0);
  
  // Se não for 100%, ajuste proporcional
  if (somaTotal !== 100 && somaTotal > 0) {
    composicao = composicao.map(item => ({
      ...item,
      porcentagem: (item.porcentagem / somaTotal) * 100
    }));
  }
  
  // Calcula os nutrientes
  const nutrientesCalculados = calcularNutrientes(ingredientes, composicao);
  
  // Calcula o preço final
  const precoFinal = calcularPrecoFinal(ingredientes, composicao);
  
  // Gera um ID único
  const id = `formula_${Date.now()}`;
  
  return {
    id,
    nome,
    composicao,
    nutrientesCalculados,
    precoFinal,
    dataCriacao: new Date().toISOString()
  };
};

export const validarFormula = (formula: Partial<Formula>): boolean => {
  if (!formula.nome || formula.nome.trim() === '') return false;
  if (!formula.composicao || !Array.isArray(formula.composicao) || formula.composicao.length === 0) return false;
  
  // Verifica se a composição é válida
  return formula.composicao.every(c => 
    c.ingredienteId && c.ingredienteId.trim() !== '' && 
    c.porcentagem !== undefined && !isNaN(c.porcentagem) && c.porcentagem >= 0
  );
};

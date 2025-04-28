
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

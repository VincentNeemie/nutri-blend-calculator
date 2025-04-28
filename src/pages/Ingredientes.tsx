
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Ingrediente, getIngredientes, excluirIngrediente } from '@/utils/storage';
import IngredienteForm from '@/components/IngredienteForm';
import IngredienteItem from '@/components/IngredienteItem';
import { useToast } from '@/components/ui/use-toast';

const Ingredientes: React.FC = () => {
  const { toast } = useToast();
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState<Ingrediente | undefined>(undefined);
  
  // Carregar ingredientes
  const carregarIngredientes = () => {
    const listaIngredientes = getIngredientes();
    setIngredientes(listaIngredientes);
  };
  
  useEffect(() => {
    carregarIngredientes();
  }, []);
  
  const handleEditIngrediente = (ingrediente: Ingrediente) => {
    setEditingIngrediente(ingrediente);
    setShowForm(true);
  };
  
  const handleDeleteIngrediente = (id: string) => {
    excluirIngrediente(id);
    toast({
      title: "Ingrediente excluído",
      description: "O ingrediente foi excluído com sucesso."
    });
    carregarIngredientes();
  };
  
  const handleSaveIngrediente = () => {
    carregarIngredientes();
    setShowForm(false);
    setEditingIngrediente(undefined);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingIngrediente(undefined);
  };
  
  return (
    <div className="page-container">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar ao Menu Principal
      </Link>
      
      <h1 className="page-title">Cadastro de Ingredientes</h1>
      
      {showForm ? (
        <div className="form-container">
          <h2 className="text-xl font-semibold mb-4">
            {editingIngrediente ? 'Editar Ingrediente' : 'Novo Ingrediente'}
          </h2>
          <IngredienteForm
            ingrediente={editingIngrediente}
            onSave={handleSaveIngrediente}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Ingrediente
            </Button>
          </div>
          
          {ingredientes.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-gray-500 mb-4">Nenhum ingrediente cadastrado ainda.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Ingrediente
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredientes.map((ingrediente) => (
                <IngredienteItem 
                  key={ingrediente.id}
                  ingrediente={ingrediente}
                  onEdit={handleEditIngrediente}
                  onDelete={handleDeleteIngrediente}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Ingredientes;

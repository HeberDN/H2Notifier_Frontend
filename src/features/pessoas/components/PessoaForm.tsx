// src/features/pessoas/components/PessoaForm.tsx

import React, { useState } from 'react';
import { useCreatePessoa } from '../hooks/usePessoaData';
import { TipoPessoa } from '../../../types/Pessoa';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

const PessoaForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa | ''>(''); // Estado para o select
  const createPessoaMutation = useCreatePessoa();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !telefone || !tipoPessoa) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await createPessoaMutation.mutateAsync({
        nome,
        email,
        telefone,
        tipoPessoa: tipoPessoa as TipoPessoa, // Garante que o tipo está correto
      });
      // Limpa o formulário após o sucesso
      setNome('');
      setEmail('');
      setTelefone('');
      setTipoPessoa('');
    } catch (error) {
      // O erro já é tratado no hook useCreatePessoa com um alert
      console.error('Erro no formulário ao criar pessoa:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Cadastrar Nova Pessoa</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da pessoa"
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Ex: 41987654321"
            className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="tipoPessoa">Tipo de Pessoa</Label>
          <Select
            onValueChange={(value: TipoPessoa) => setTipoPessoa(value)}
            value={tipoPessoa}
          >
            <SelectTrigger className="w-full dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600">
              <SelectItem value={TipoPessoa.DEVEDOR}>DEVEDOR</SelectItem>
              <SelectItem value={TipoPessoa.COBRADOR}>COBRADOR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 flex justify-end mt-2">
          <Button type="submit" disabled={createPessoaMutation.isPending}>
            {createPessoaMutation.isPending ? 'Cadastrando...' : 'Cadastrar Pessoa'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PessoaForm;
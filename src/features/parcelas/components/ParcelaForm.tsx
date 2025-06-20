// src/features/parcelas/components/ParcelaForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputField from '../../../components/common/InputField'; // Seu componente de input
import { Parcela } from '../../../types/Parcela'; // Seu tipo de parcela

// Defina seu schema de validação com Zod
const parcelaSchema = z.object({
  valor: z.number().min(0.01, 'O valor deve ser maior que zero'),
  dataVencimento: z.string().min(1, 'A data de vencimento é obrigatória').regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
  status: z.enum(['PAGO', 'ABERTO', 'ATRASADO'], {
    errorMap: () => ({ message: 'Status inválido' }),
  }),
});

type ParcelaFormData = z.infer<typeof parcelaSchema>;

interface ParcelaFormProps {
  initialData?: Parcela;
  onSubmit: (data: ParcelaFormData) => void;
}

const ParcelaForm: React.FC<ParcelaFormProps> = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParcelaFormData>({
    resolver: zodResolver(parcelaSchema),
    defaultValues: initialData, // Preenche o formulário se houver dados iniciais
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        {initialData ? 'Editar Parcela' : 'Nova Parcela'}
      </h3>

      <InputField
        label="Valor"
        id="valor"
        type="number"
        register={register}
        error={errors.valor?.message}
        placeholder="Ex: 100.50"
      />

      <InputField
        label="Data de Vencimento"
        id="dataVencimento"
        type="date" // Use type="date" para um seletor de data
        register={register}
        error={errors.dataVencimento?.message}
      />

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.status ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="ABERTO">Aberto</option>
          <option value="PAGO">Pago</option>
          <option value="ATRASADO">Atrasado</option>
        </select>
        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Salvar Parcela
      </button>
    </form>
  );
};

export default ParcelaForm;
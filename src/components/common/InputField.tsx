// src/components/common/InputField.tsx
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  register: UseFormRegister<any>; // Use a interface específica do seu formulário
  error?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type = 'text', register, error, placeholder }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id)}
        placeholder={placeholder}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
// src/pages/ParcelaList.tsx

import React, { useState, useEffect } from 'react'; // Importe useEffect
import {
  useGetAllParcelas,
  useGetParcelasByVencimento,
  useGetTotalAReceber,
  useGetParcelasByCobradorId,
  useGetParcelasByDevedorId,
  useCreateParcela,
  useUpdateParcela,
  useQuitarParcela,
  useDeleteParcela,
} from '../features/parcelas/hooks/useParcelaData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
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
} from '../components/ui/alert-dialog';

import { Parcela, ParcelaInput } from '../types/Parcela';
import { formatarDataParaPtBR, formatarMoedaParaPtBR } from '../utils/formatters';
import { useGetAllPessoas } from '../features/pessoas/hooks/usePessoaData';
import { toast } from 'sonner';

// Componente de Formulário para Criar/Editar Parcela (separado para organização)
interface ParcelaFormProps {
  initialData?: ParcelaInput;
  onSubmit: (data: ParcelaInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  cobradorOptions: { id: number; nome: string }[];
  devedorOptions: { id: number; nome: string }[];
  isEditing: boolean;
}

const ParcelaForm: React.FC<ParcelaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  cobradorOptions,
  devedorOptions,
  isEditing, // Receba a prop isEditing
}) => {
  const [formData, setFormData] = useState<ParcelaInput>(
    initialData || {
      idCobrador: cobradorOptions[0]?.id || 0,
      valorTotal: 0,
      descricao: '',
      vencimento: new Date().toISOString().split('T')[0],
      quitada: false,
      chavePix: '',
      idsDevedores: [],
    }
  );

  // Use useEffect para redefinir o formData quando initialData mudar (para o caso de reabrir o modal para criar após editar)
  useEffect(() => {
    setFormData(
      initialData || {
        idCobrador: cobradorOptions[0]?.id || 0,
        valorTotal: 0,
        descricao: '',
        vencimento: new Date().toISOString().split('T')[0],
        quitada: false,
        chavePix: '',
        idsDevedores: [],
      }
    );
  }, [initialData, cobradorOptions]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDevedoresChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10));
    setFormData((prev) => ({
      ...prev,
      idsDevedores: options,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          value={formData.descricao}
          onChange={handleChange}
          required
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      <div>
        <Label htmlFor="vencimento">Vencimento</Label>
        <Input
          id="vencimento"
          type="date"
          value={formData.vencimento}
          onChange={handleChange}
          required
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      <div>
        <Label htmlFor="valorTotal">Valor Total</Label>
        <Input
          id="valorTotal"
          type="number"
          step="0.01"
          value={formData.valorTotal}
          onChange={handleChange}
          required
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      <div>
        <Label htmlFor="idCobrador">Cobrador</Label>
        <select
          id="idCobrador"
          value={formData.idCobrador}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        >
          {cobradorOptions.map((cobrador) => (
            <option key={cobrador.id} value={cobrador.id}>
              {cobrador.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="idsDevedores">Devedores (selecione múltiplos)</Label>
        <select
          id="idsDevedores"
          multiple
          value={formData.idsDevedores.map(String)}
          onChange={handleDevedoresChange}
          className="flex h-fit w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        >
          {devedorOptions.map((devedor) => (
            <option key={devedor.id} value={devedor.id}>
              {devedor.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="chavePix">Chave Pix</Label>
        <Input
          id="chavePix"
          value={formData.chavePix || ''}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Input
          id="quitada"
          type="checkbox"
          checked={formData.quitada}
          onChange={handleChange}
          className="w-4 h-4 dark:bg-gray-700 dark:border-gray-600"
        />
        <Label htmlFor="quitada">Quitada</Label>
      </div>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar Parcela' : 'Salvar Parcela')}
        </Button>
      </DialogFooter>
    </form>
  );
};


const ParcelaList: React.FC = () => {
  const [vencimentoDate, setVencimentoDate] = useState<string>('');
  const [cobradorIdFilter, setCobradorIdFilter] = useState<number>(0);
  const [devedorIdFilter, setDevedorIdFilter] = useState<number>(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editParcelaData, setEditParcelaData] = useState<Parcela | null>(null);

  // Estados para o AlertDialog de deleção
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [parcelaToDeleteId, setParcelaToDeleteId] = useState<number | null>(null);

  // Estados para o AlertDialog de quitação
  const [showQuitarConfirm, setShowQuitarConfirm] = useState(false);
  const [parcelaToQuitarId, setParcelaToQuitarId] = useState<number | null>(null);


  // Dados para os dropdowns de cobradores e devedores no formulário
  const { data: pessoas, isLoading: isLoadingPessoas } = useGetAllPessoas();
  const cobradorOptions = pessoas?.filter(p => p.tipoPessoa === 'COBRADOR').map(p => ({ id: p.id, nome: p.nome })) || [];
  const devedorOptions = pessoas?.filter(p => p.tipoPessoa === 'DEVEDOR').map(p => ({ id: p.id, nome: p.nome })) || [];


  // Hooks para as listagens
  const {
    data: allParcelas,
    isLoading: isLoadingAllParcelas,
    isError: isErrorAllParcelas,
    error: errorAllParcelas,
  } = useGetAllParcelas();

  const {
    data: parcelasByVencimento,
    isLoading: isLoadingParcelasByVencimento,
    isError: isErrorParcelasByVencimento,
    error: errorParcelasByVencimento,
  } = useGetParcelasByVencimento(vencimentoDate);

  const {
    data: totalAReceber,
    isLoading: isLoadingTotal,
    isError: isErrorTotal,
    error: errorTotal,
  } = useGetTotalAReceber(cobradorIdFilter);

  const {
    data: parcelasByCobrador,
    isLoading: isLoadingParcelasByCobrador,
    isError: isErrorParcelasByCobrador,
    error: errorParcelasByCobrador,
  } = useGetParcelasByCobradorId(cobradorIdFilter);

  const {
    data: parcelasByDevedor,
    isLoading: isLoadingParcelasByDevedor,
    isError: isErrorParcelasByDevedor,
    error: errorParcelasByDevedor,
  } = useGetParcelasByDevedorId(devedorIdFilter);


  // Hooks para as mutações
  const createMutation = useCreateParcela();
  const updateMutation = useUpdateParcela();
  const quitarMutation = useQuitarParcela();
  const deleteMutation = useDeleteParcela();


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVencimentoDate(e.target.value);
  };

  const handleCobradorIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.value, 10);
    setCobradorIdFilter(isNaN(id) ? 0 : id);
  };

  const handleDevedorIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.value, 10);
    setDevedorIdFilter(isNaN(id) ? 0 : id);
  };

  const handleCreateParcela = async (data: ParcelaInput) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Parcela criada com sucesso!');
      setShowCreateModal(false);
    } catch (error: any) {
      toast.error(`Erro ao criar parcela: ${error.message}`);
    }
  };

  const handleEditParcela = (parcela: Parcela) => {
    setEditParcelaData(parcela);
    setShowCreateModal(true);
  };

  const handleUpdateParcela = async (data: ParcelaInput) => {
    if (!editParcelaData) return;
    try {
      await updateMutation.mutateAsync({ id: editParcelaData.id, data });
      toast.success('Parcela atualizada com sucesso!');
      setShowCreateModal(false);
      setEditParcelaData(null); // Limpar dados de edição após sucesso
    } catch (error: any) {
      toast.error(`Erro ao atualizar parcela: ${error.message}`);
    }
  };

  const confirmQuitarParcela = (id: number) => {
    setParcelaToQuitarId(id);
    setShowQuitarConfirm(true);
  }

  const executeQuitarParcela = async () => {
    if (parcelaToQuitarId === null) return;
    try {
      await quitarMutation.mutateAsync(parcelaToQuitarId);
      toast.success('Parcela quitada com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao quitar parcela: ${error.message}`);
    } finally {
      setShowQuitarConfirm(false);
      setParcelaToQuitarId(null);
    }
  }

  // Funções para lidar com o AlertDialog de deleção
  const confirmDeleteParcela = (id: number) => {
    setParcelaToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const executeDeleteParcela = async () => {
    if (parcelaToDeleteId === null) return;

    try {
      await deleteMutation.mutateAsync(parcelaToDeleteId);
      toast.success('Parcela deletada com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao deletar parcela: ${error.message}`);
    } finally {
      setShowDeleteConfirm(false);
      setParcelaToDeleteId(null);
    }
  };

  // Determina qual lista de parcelas exibir com base nos filtros
  const displayParcelas = vencimentoDate
    ? parcelasByVencimento
    : cobradorIdFilter
      ? parcelasByCobrador
      : devedorIdFilter
        ? parcelasByDevedor
        : allParcelas;

  const isLoadingDisplay = vencimentoDate
    ? isLoadingParcelasByVencimento
    : cobradorIdFilter
      ? isLoadingParcelasByCobrador
      : devedorIdFilter
        ? isLoadingParcelasByDevedor
        : isLoadingAllParcelas;

  const isErrorDisplay = vencimentoDate
    ? isErrorParcelasByVencimento
    : cobradorIdFilter
      ? isErrorParcelasByCobrador
      : devedorIdFilter
        ? isErrorParcelasByDevedor
        : isErrorAllParcelas;

  const errorDisplay = vencimentoDate
    ? errorParcelasByVencimento
    : cobradorIdFilter
      ? errorParcelasByCobrador
      : devedorIdFilter
        ? errorParcelasByDevedor
        : errorAllParcelas;


  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Gerenciar Parcelas</h2>

      {/* Botão de Adicionar Nova Parcela */}
      <Dialog
        open={showCreateModal}
        onOpenChange={(open) => {
          if (!open) {
            // Se o modal estiver fechando
            setEditParcelaData(null); // Limpar os dados de edição
          }
          setShowCreateModal(open);
        }}
      >
        <DialogTrigger asChild>
          <Button
            className="mb-6 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            onClick={() => setEditParcelaData(null)} // Garante que os dados de edição sejam limpos ao abrir para criar
          >
            Adicionar Nova Parcela
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>{editParcelaData ? 'Editar Parcela' : 'Adicionar Nova Parcela'}</DialogTitle>
            <DialogDescription>
              {editParcelaData ? 'Edite os detalhes da parcela.' : 'Preencha os detalhes para cadastrar uma nova parcela.'}
            </DialogDescription>
          </DialogHeader>
          <ParcelaForm
            initialData={editParcelaData ? {
              idCobrador: editParcelaData.cobrador.id,
              valorTotal: editParcelaData.valorTotal,
              descricao: editParcelaData.descricao,
              vencimento: editParcelaData.vencimento,
              quitada: editParcelaData.quitada,
              chavePix: editParcelaData.chavePix,
              idsDevedores: editParcelaData.devedores.map(d => d.id),
            } : undefined}
            onSubmit={editParcelaData ? handleUpdateParcela : handleCreateParcela}
            onCancel={() => {
              setShowCreateModal(false);
              setEditParcelaData(null); // Garante que os dados de edição sejam limpos ao cancelar
            }}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            cobradorOptions={cobradorOptions}
            devedorOptions={devedorOptions}
            isEditing={!!editParcelaData} // Passa a prop isEditing
          />
        </DialogContent>
      </Dialog>

      {/* Seção de Total a Receber */}
      <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Total a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Label htmlFor="cobradorIdFilter" className="whitespace-nowrap">ID do Cobrador:</Label>
            <Input
              id="cobradorIdFilter"
              type="number"
              value={cobradorIdFilter}
              onChange={handleCobradorIdFilterChange}
              className="w-24 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              min="0"
            />
          </div>
          {isLoadingTotal && <p className="text-gray-600 dark:text-gray-300">Calculando total...</p>}
          {isErrorTotal && <p className="text-red-600 dark:text-red-400">Erro: {errorTotal?.message}</p>}
          {totalAReceber !== undefined && !isLoadingTotal && !isErrorTotal && (
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              Total: {formatarMoedaParaPtBR(totalAReceber)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Seção de Filtros de Listagem */}
      <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Filtros de Parcelas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="vencimentoDate">Filtrar por Vencimento:</Label>
            <Input
              id="vencimentoDate"
              type="date"
              value={vencimentoDate}
              onChange={handleDateChange}
              className="mt-1 w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="cobradorIdFilter">Filtrar por ID do Cobrador:</Label>
            <Input
              id="cobradorIdFilter"
              type="number"
              value={cobradorIdFilter}
              onChange={handleCobradorIdFilterChange}
              className="mt-1 w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="devedorIdFilter">Filtrar por ID do Devedor:</Label>
            <Input
              id="devedorIdFilter"
              type="number"
              value={devedorIdFilter}
              onChange={handleDevedorIdFilterChange}
              className="mt-1 w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              min="0"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setVencimentoDate('');
                setCobradorIdFilter(0);
                setDevedorIdFilter(0);
              }}
              className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Seção de Tabela de Parcelas */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Lista de Parcelas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDisplay && <p className="text-center text-gray-600 dark:text-gray-300">Carregando parcelas...</p>}
          {isErrorDisplay && <p className="text-center text-red-600 dark:text-red-400">Erro ao carregar parcelas: {errorDisplay?.message}</p>}

          {!isLoadingDisplay && !isErrorDisplay && displayParcelas && displayParcelas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:hover:bg-gray-700">
                    <TableHead>ID</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Quitada</TableHead>
                    <TableHead>Cobrador</TableHead>
                    <TableHead>Devedores</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayParcelas.map((parcela) => (
                    <TableRow key={parcela.id} className="dark:hover:bg-gray-750">
                      <TableCell className="font-medium">{parcela.id}</TableCell>
                      <TableCell>{parcela.descricao}</TableCell>
                      <TableCell>{formatarDataParaPtBR(parcela.vencimento)}</TableCell>
                      <TableCell>{formatarMoedaParaPtBR(parcela.valorTotal)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            parcela.quitada
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          }`}
                        >
                          {parcela.quitada ? 'Sim' : 'Não'}
                        </span>
                      </TableCell>
                      <TableCell>{parcela.cobrador.nome}</TableCell>
                      <TableCell>
                        {parcela.devedores.map((d) => d.nome).join(', ')}
                      </TableCell>
                      <TableCell className="text-right flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditParcela(parcela)}
                          className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                        >
                          Editar
                        </Button>
                        {!parcela.quitada && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => confirmQuitarParcela(parcela.id)}
                              disabled={quitarMutation.isPending}
                              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            >
                              Quitar
                            </Button>
                        )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDeleteParcela(parcela.id)}
                            disabled={deleteMutation.isPending}
                            className="dark:bg-red-700 dark:hover:bg-red-800"
                          >
                            Deletar
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            !isLoadingDisplay && !isErrorDisplay && !displayParcelas?.length && (
              <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">Nenhuma parcela encontrada com os filtros aplicados.</p>
            )
          )}
        </CardContent>
      </Card>

      {/* AlertDialog para Confirmação de Deleção */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="dark:bg-gray-800 dark:text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso deletará permanentemente a parcela
              e removerá seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteParcela}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog para Confirmação de Quitação */}
      <AlertDialog open={showQuitarConfirm} onOpenChange={setShowQuitarConfirm}>
        <AlertDialogContent className="dark:bg-gray-800 dark:text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Quitar Parcela?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao quitar a parcela, o status será atualizado para "Quitada". Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={quitarMutation.isPending}
              className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeQuitarParcela}
              disabled={quitarMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {quitarMutation.isPending ? 'Quitando...' : 'Quitar Mesmo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ParcelaList;
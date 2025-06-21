//src/pages/MensagemList.tsx
import React, { useState, useEffect } from 'react';
import {
  useGetAllMensagens,
  useCreateMensagem,
  useUpdateMensagem,
  useDeleteMensagem,
} from '../features/mensagens/hooks/useMensagemData';
import { Mensagem, MensagemInput, CanalMensagem } from '../types/Mensagem';

// Importe os componentes Shadcn UI que você já usa ou precisará
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
import { toast } from 'sonner';
import { Textarea } from '../components/ui/textarea'; // Certifique-se de que Textarea existe
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'; // Importar Select para o canal

// Componente de Formulário para Criar/Editar Mensagem
interface MensagemFormProps {
  initialData?: MensagemInput;
  onSubmit: (data: MensagemInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

const MensagemForm: React.FC<MensagemFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
}) => {
  const [formData, setFormData] = useState<MensagemInput>(
    initialData || {
      titulo: '',
      conteudo: '',
      canal: 'WHATSAPP', // Valor padrão
    }
  );

  useEffect(() => {
    setFormData(
      initialData || {
        titulo: '',
        conteudo: '',
        canal: 'WHATSAPP',
      }
    );
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCanalChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      canal: value as CanalMensagem, // Cast para o tipo correto
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      <div>
        <Label htmlFor="canal">Canal</Label>
        <Select value={formData.canal} onValueChange={handleCanalChange}>
          <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
            <SelectValue placeholder="Selecione o canal" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            {/* Adicione outros canais conforme necessário */}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="conteudo">Conteúdo</Label>
        <Textarea
          id="conteudo"
          value={formData.conteudo}
          onChange={handleChange}
          required
          rows={10} // Aumentar o número de linhas para o conteúdo
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Use variáveis como `{'{nome.devedor}'}`, `{'{descricao.parcela}'}`, etc.
        </p>
      </div>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar Mensagem' : 'Salvar Mensagem')}
        </Button>
      </DialogFooter>
    </form>
  );
};

const MensagemList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editMensagemData, setEditMensagemData] = useState<Mensagem | null>(null);

  // Estados para o AlertDialog de deleção
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mensagemToDeleteId, setMensagemToDeleteId] = useState<number | null>(null);

  // Hooks para as listagens
  const {
    data: mensagensPage,
    isLoading: isLoadingMensagens,
    isError: isErrorMensagens,
    error: errorMensagens,
  } = useGetAllMensagens(currentPage, pageSize);

  const mensagens = mensagensPage?.content || [];
  const totalPages = mensagensPage?.totalPages || 1;

  // Hooks para as mutações
  const createMutation = useCreateMensagem();
  const updateMutation = useUpdateMensagem();
  const deleteMutation = useDeleteMensagem();

  const handleCreateMensagem = async (data: MensagemInput) => {
    try {
      await createMutation.mutateAsync(data);
      setShowCreateModal(false);
    } catch (error: any) {
      // Toast de erro já é tratado no hook de mutação
    }
  };

  const handleEditMensagem = (mensagem: Mensagem) => {
    setEditMensagemData(mensagem);
    setShowCreateModal(true);
  };

  const handleUpdateMensagem = async (data: MensagemInput) => {
    if (!editMensagemData) return;
    try {
      await updateMutation.mutateAsync({ id: editMensagemData.id, data });
      setShowCreateModal(false);
      setEditMensagemData(null);
    } catch (error: any) {
      // Toast de erro já é tratado no hook de mutação
    }
  };

  // Funções para lidar com o AlertDialog de deleção
  const confirmDeleteMensagem = (id: number) => {
    setMensagemToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const executeDeleteMensagem = async () => {
    if (mensagemToDeleteId === null) return;
    try {
      await deleteMutation.mutateAsync(mensagemToDeleteId);
    } catch (error: any) {
      // Toast de erro já é tratado no hook de mutação
    } finally {
      setShowDeleteConfirm(false);
      setMensagemToDeleteId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Gerenciar Mensagens</h2>

      {/* Botão de Adicionar Nova Mensagem */}
      <Dialog
        open={showCreateModal}
        onOpenChange={(open) => {
          if (!open) {
            setEditMensagemData(null);
          }
          setShowCreateModal(open);
        }}
      >
        <DialogTrigger asChild>
          <Button
            className="mb-6 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            onClick={() => setEditMensagemData(null)}
          >
            Adicionar Nova Mensagem
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>{editMensagemData ? 'Editar Mensagem' : 'Adicionar Nova Mensagem'}</DialogTitle>
            <DialogDescription>
              {editMensagemData ? 'Edite os detalhes da mensagem.' : 'Preencha os detalhes para cadastrar uma nova mensagem.'}
            </DialogDescription>
          </DialogHeader>
          <MensagemForm
            initialData={editMensagemData || undefined}
            onSubmit={editMensagemData ? handleUpdateMensagem : handleCreateMensagem}
            onCancel={() => {
              setShowCreateModal(false);
              setEditMensagemData(null);
            }}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            isEditing={!!editMensagemData}
          />
        </DialogContent>
      </Dialog>

      {/* Seção de Tabela de Mensagens */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Lista de Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMensagens && <p className="text-center text-gray-600 dark:text-gray-300">Carregando mensagens...</p>}
          {isErrorMensagens && <p className="text-center text-red-600 dark:text-red-400">Erro ao carregar mensagens: {errorMensagens?.message}</p>}

          {!isLoadingMensagens && !isErrorMensagens && mensagens.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:hover:bg-gray-700">
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Conteúdo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mensagens.map((mensagem) => (
                    <TableRow key={mensagem.id} className="dark:hover:bg-gray-750">
                      <TableCell className="font-medium">{mensagem.id}</TableCell>
                      <TableCell>{mensagem.titulo}</TableCell>
                      <TableCell>{mensagem.canal}</TableCell>
                      <TableCell className="max-w-[400px] truncate">{mensagem.conteudo}</TableCell>
                      <TableCell className="text-right flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMensagem(mensagem)}
                          className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDeleteMensagem(mensagem.id)}
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
              {/* Controles de Paginação */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0 || isLoadingMensagens}
                  variant="outline"
                  className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Anterior
                </Button>
                <span className="text-gray-700 dark:text-gray-300">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1 || isLoadingMensagens}
                  variant="outline"
                  className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Próxima
                </Button>
              </div>
            </div>
          ) : (
            !isLoadingMensagens && !isErrorMensagens && !mensagens.length && (
              <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">Nenhuma mensagem encontrada.</p>
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
              Esta ação não pode ser desfeita. Isso deletará permanentemente esta mensagem.
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
              onClick={executeDeleteMensagem}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MensagemList;
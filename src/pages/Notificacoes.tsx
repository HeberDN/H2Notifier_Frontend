// src/pages/Notificacoes.tsx

import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { useEnviarNotificacoes, usePreviewNotificacoes } from '../features/notificacoes/hooks/useNotificacaoData';
import { CanalNotificacao } from '../types/Notificacao';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const Notificacoes: React.FC = () => {
  const [idParcela, setIdParcela] = useState<number>(1); // ID da parcela padrão para teste
  const [canaisSelecionados, setCanaisSelecionados] = useState<CanalNotificacao[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showPreviewDialog, setShowPreviewDialog] = useState<boolean>(false);

  const enviarMutation = useEnviarNotificacoes();
  const previewMutation = usePreviewNotificacoes();

  const handleCheckboxChange = (canal: CanalNotificacao, checked: boolean) => {
    setCanaisSelecionados((prev) =>
      checked ? [...prev, canal] : prev.filter((c) => c !== canal)
    );
  };

  const handleEnviarNotificacoes = async () => {
    if (canaisSelecionados.length === 0) {
      toast.warning('Selecione pelo menos um canal de notificação.');
      return;
    }
    if (!idParcela) {
      toast.warning('Insira um ID de parcela válido.');
      return;
    }

    try {
      await enviarMutation.mutateAsync({ idParcela, canais: canaisSelecionados });
      toast.success('Notificações enviadas com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao enviar notificações: ${error.message}`);
    }
  };

  const handlePreviewNotificacoes = async () => {
    if (canaisSelecionados.length === 0) {
      toast.warning('Selecione pelo menos um canal para o preview.');
      return;
    }
    if (canaisSelecionados.length > 1) {
      toast.warning('Para o preview, selecione apenas um canal por vez (EMAIL ou WHATSAPP).');
      return;
    }
    if (!idParcela) {
      toast.warning('Insira um ID de parcela válido.');
      return;
    }

    try {
      const response = await previewMutation.mutateAsync({ idParcela, canais: canaisSelecionados });
      setPreviewHtml(response.data);
      setShowPreviewDialog(true);
    } catch (error: any) {
      toast.error(`Erro ao gerar preview: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Módulo de Notificações</h2>

      <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Configurar e Enviar Notificações</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="idParcela">ID da Parcela</Label>
            <Input
              id="idParcela"
              type="number"
              value={idParcela}
              onChange={(e) => setIdParcela(parseInt(e.target.value, 10) || 0)}
              required
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              min="1"
            />
          </div>

          <div>
            <Label>Canais de Notificação</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp"
                  checked={canaisSelecionados.includes('WHATSAPP')}
                  onCheckedChange={(checked) => handleCheckboxChange('WHATSAPP', !!checked)}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="whatsapp">WhatsApp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={canaisSelecionados.includes('EMAIL')}
                  onCheckedChange={(checked) => handleCheckboxChange('EMAIL', !!checked)}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="email">E-mail</Label>
              </div>
              {/* Adicione outros canais se sua API suportar, ex: SMS */}
              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={canaisSelecionados.includes('SMS')}
                  onCheckedChange={(checked) => handleCheckboxChange('SMS', !!checked)}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="sms">SMS</Label>
              </div> */}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleEnviarNotificacoes}
              disabled={enviarMutation.isPending || canaisSelecionados.length === 0 || !idParcela}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {enviarMutation.isPending ? 'Enviando...' : 'Enviar Notificações'}
            </Button>
            <Button
              variant="outline"
              onClick={handlePreviewNotificacoes}
              disabled={previewMutation.isPending || canaisSelecionados.length === 0 || !idParcela || canaisSelecionados.length > 1}
              className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {previewMutation.isPending ? 'Gerando Preview...' : 'Pré-visualizar Notificação'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para exibir o preview HTML */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[700px] dark:bg-gray-800 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Pré-visualização da Notificação</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[80vh] p-4 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            {previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                title="Notificação Preview"
                className="w-full h-[500px] border-none bg-white dark:bg-gray-900"
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Nenhum preview gerado.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notificacoes;
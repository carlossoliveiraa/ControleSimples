import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CardTransacaoProps {
  titulo: string;
  valor: string | number;
  descricao: string;
  icone: React.ReactNode;
  corFundo: string;
  corIcone: string;
  onClick: () => void;
  variacao?: {
    valor: number;
    tipo: 'aumento' | 'diminuicao';
  };
}

const CardTransacao = ({ 
  titulo, 
  valor, 
  descricao, 
  icone, 
  corFundo, 
  corIcone,
  onClick,
  variacao 
}: CardTransacaoProps) => (
  <div 
    onClick={onClick}
    className={`${corFundo} p-6 rounded-lg cursor-pointer transition-transform hover:scale-105`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`${corIcone} p-3 rounded-lg`}>
        {icone}
      </div>
      {variacao && (
        <div className={`flex items-center ${variacao.tipo === 'aumento' ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-sm font-medium">
            {variacao.tipo === 'aumento' ? '+' : '-'}{variacao.valor}%
          </span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                variacao.tipo === 'aumento'
                  ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                  : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
              }
            />
          </svg>
        </div>
      )}
    </div>
    <h3 className="text-xl font-semibold text-gray-800">{titulo}</h3>
    <div className="mt-2">
      <span className="text-2xl font-bold text-gray-900">{valor}</span>
    </div>
    <p className="mt-2 text-sm text-gray-600">{descricao}</p>
  </div>
);

export function Transacoes() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Transações</h1>
        <p className="text-gray-600 mt-1">Gerencie suas movimentações de estoque</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardTransacao
          titulo="Entrada de Produtos"
          valor="89"
          descricao="Produtos recebidos este mês"
          icone={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
          }
          corFundo="bg-green-50"
          corIcone="bg-green-100"
          onClick={() => navigate('/transacoes/entradas')}
          variacao={{ valor: 12.8, tipo: 'aumento' }}
        />

        <CardTransacao
          titulo="Saída de Produtos"
          valor="45"
          descricao="Produtos vendidos este mês"
          icone={
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
          }
          corFundo="bg-red-50"
          corIcone="bg-red-100"
          onClick={() => navigate('/transacoes/saidas')}
          variacao={{ valor: 3.1, tipo: 'diminuicao' }}
        />

        <CardTransacao
          titulo="Inventário"
          valor="406"
          descricao="Total de produtos em estoque"
          icone={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
          corFundo="bg-blue-50"
          corIcone="bg-blue-100"
          onClick={() => navigate('/transacoes/inventario')}
          variacao={{ valor: 8.2, tipo: 'aumento' }}
        />
      </div>
    </div>
  );
} 
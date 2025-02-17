import { useState } from 'react';

interface FAQ {
  pergunta: string;
  resposta: string;
  categoria: string;
}

const faqs: FAQ[] = [
  {
    categoria: 'Geral',
    pergunta: 'Como começar a usar o sistema?',
    resposta: 'Para começar, primeiro cadastre suas categorias de produtos. Em seguida, adicione seus produtos e configure o estoque inicial através de uma entrada de produtos.'
  },
  {
    categoria: 'Geral',
    pergunta: 'Como obter suporte?',
    resposta: 'Você pode entrar em contato conosco através do email suporte@sistema.com ou pelo WhatsApp (11) 99999-9999. Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.'
  },
  {
    categoria: 'Produtos',
    pergunta: 'Como cadastrar um novo produto?',
    resposta: 'Vá até o menu "Produtos", clique no botão "Novo Produto" e preencha todas as informações necessárias. Não se esqueça de vincular o produto a uma categoria.'
  },
  {
    categoria: 'Produtos',
    pergunta: 'Como ajustar o estoque de um produto?',
    resposta: 'Acesse o menu "Inventário", localize o produto desejado e clique no ícone de ajuste. Informe a nova quantidade e o motivo do ajuste.'
  },
  {
    categoria: 'Movimentações',
    pergunta: 'Como registrar uma entrada de produtos?',
    resposta: 'No menu "Transações", selecione "Entradas" e clique em "Nova Entrada". Busque os produtos desejados, informe as quantidades e valores, então finalize a entrada.'
  },
  {
    categoria: 'Movimentações',
    pergunta: 'Como registrar uma saída de produtos?',
    resposta: 'Acesse o menu "Transações", selecione "Saídas" e clique em "Nova Saída". Selecione os produtos, informe as quantidades e finalize a operação.'
  },
  {
    categoria: 'Relatórios',
    pergunta: 'Como exportar relatórios?',
    resposta: 'Em cada seção do sistema (Produtos, Movimentações, etc), você encontrará um botão "Exportar". Clique nele e escolha o formato desejado (PDF ou Excel).'
  },
  {
    categoria: 'Configurações',
    pergunta: 'Como alterar minhas preferências?',
    resposta: 'Acesse o menu "Configurações" para personalizar o sistema de acordo com suas necessidades. Você pode alterar o tema, formato de data, moeda e outras opções.'
  }
];

export function Ajuda() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categorias = ['Todos', ...new Set(faqs.map(faq => faq.categoria))];

  const faqsFiltrados = faqs.filter(faq => {
    const matchesSearch = faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.resposta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || faq.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Central de Ajuda</h1>

          {/* Busca e Filtros */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar ajuda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-4">
            {faqsFiltrados.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-700">{faq.pergunta}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-white">
                    <p className="text-gray-600">{faq.resposta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contato */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Ainda precisa de ajuda?
            </h2>
            <p className="text-gray-600 mb-4">
              Nossa equipe de suporte está disponível para ajudar você.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:suporte@sistema.com"
                className="flex items-center gap-2 text-[#4A90E2] hover:text-[#357ABD]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                suporte@sistema.com
              </a>
              <a
                href="tel:+5511999999999"
                className="flex items-center gap-2 text-[#4A90E2] hover:text-[#357ABD]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (11) 99999-9999
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
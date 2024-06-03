import React, { useState } from 'react';
import './css/manualUsuario.css'; 

export default function ManualUsuario() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Adicionando estado para o termo de pesquisa

  const toggleAccordion = (index: number) => {
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const data = [
    { title: 'Como recuperar sua senha', content: 'Informações detalhadas sobre como fazer algo 3...' },
    { title: 'Como cadastrar usuários e administradores', content: 'Informações detalhadas sobre como fazer algo 1...' },
    { title: 'Como atualizar e excluir usuários', content: 'Informações detalhadas sobre como fazer algo 2...' },
    { title: 'Como cadastrar ativos', content: 'Informações detalhadas sobre como fazer algo 3...' },
    { title: 'Como atualizar e excluir ativos', content: 'Informações detalhadas sobre como fazer algo 3...' },
    { title: 'Como enviar um ativo para a manutenção', content: 'Informações detalhadas sobre como fazer algo 3...' },
    { title: 'Como ver o histórico da manutenção de um ativo', content: 'Informações detalhadas sobre como fazer algo 3...' },
    { title: 'Como ver o histórico do ativo', content: 'Informações detalhadas sobre como fazer algo 3...' },
  ];

  const filteredData = data.filter(item =>
    removeAccents(item.title.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
  );
  
  function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }  

  return (
    <div className="manual-container">
      <div className='TituloManual'>
        <header>
          <h1>Manual do Usuário</h1>
        </header>
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Pesquisar..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="accordion">
        {filteredData.map((item, index: number) => (
          <div key={index} className="accordion-item">
            <div
              className={`accordion-title ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              {item.title}
            </div>
            {activeIndex === index && (
              <div className="accordion-content">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

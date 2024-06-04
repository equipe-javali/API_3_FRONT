import React, { useState } from 'react';
import './css/manualUsuario.css'; 
import { Link } from 'react-router-dom';

interface ManualItem {
  title: string;
  type: string;
  content: string | JSX.Element | (string | JSX.Element)[];
}

export default function ManualUsuario() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const toggleAccordion = (index: number) => {
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const data: ManualItem[] = [
    { 
      title: 'Como recuperar sua senha', 
      type: 'text', 
      content: [
        'Acesse o seguinte link e insira seu email cadastrado:',
        <Link to="/ListaUsuarios">Página de recuperação de senha</Link>,
        'Após isso, será enviado um código de acesso no email inserido, para que assim possa recuperar sua senha.'
      ]
    },
    { 
      title: 'Como cadastrar usuários e administradores', 
      type: 'text', 
      content: [
        'Acesse a (página de criação de usuário - link) e preencha o formulário'
      ]
    },
    { 
      title: 'Como atualizar e excluir usuários', 
      type: 'text', 
      content: [
        'Informações detalhadas sobre como fazer algo 2...'
      ]
    },
    { 
      title: 'Como cadastrar ativos', 
      type: 'text', 
      content: [
        'Informações detalhadas sobre como fazer algo 3...'
      ]
    },
    { 
      title: 'Como atualizar e excluir ativos', 
      type: 'text', 
      content: [
        'Informações detalhadas sobre como fazer algo 3...'
      ]
    },
    { 
      title: 'Como enviar um ativo para a manutenção', 
      type: 'text', 
      content: [
        'Informações detalhadas sobre como fazer algo 3...'
      ]
    },
    { 
      title: 'Como ver o histórico da manutenção de um ativo', 
      type: 'text', 
      content: [
        'Informações detalhadas sobre como fazer algo 3...'
      ]
    },
    { 
      title: 'Como ver o histórico de atualização de um ativo', 
      type: 'text', 
      content: [
        'Informações detalhadas sobre como fazer algo 3...'
      ]
    },
    { 
      title: 'Como acessar os relatórios', 
      type: 'text', 
      content: [
        'Informações detalhadas sobre como fazer algo 3...'
      ]
    },
    // Exemplos para conteúdos futuros
    {
      title: 'Link útil',
      type: 'link',
      content: 'https://exemplo.com'
    },
    {
      title: 'Imagem ilustrativa',
      type: 'image',
      content: ' '
    },
    {
      title: 'Vídeo explicativo',
      type: 'video',
      content: 'https://www.youtube.com/watch?v=videoID'
    }
  ];

  const filteredData = data.filter(item =>
    removeAccents(item.title.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
  );
  
  function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }  

  function renderContent(item: ManualItem) {
    switch (item.type) {
      case 'text':
        return (Array.isArray(item.content) ? item.content.map((line, index) => <p key={index}>{line}</p>) : <p>{item.content}</p>);
      case 'link':
        return <a href={item.content as string} target="_blank" rel="noopener noreferrer">{item.title}</a>;
      case 'image':
        return <img src={item.content as string} alt={item.title} />;
      case 'video':
        return <iframe src={item.content as string} title={item.title}></iframe>;
      default:
        return null;
    }
  }

  return (
    <div className="manual-container">
      <div className='TituloManual'>
        <header>
          <h1>Manual de Usuário</h1>
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
                {renderContent(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

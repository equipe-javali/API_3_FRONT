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
      title: 'Como recuperar sua senha em caso de perda', 
      type: 'text', 
      content: [
        'Acesse o seguinte link e insira seu email cadastrado:',
        <Link to="/ListaUsuarios">Página de recuperação de senha</Link>,
        'Após isso, será enviado um código de acesso no email inserido, para que assim possa recuperar sua senha.'
      ]
    },
    { 
      title: 'Como alterar sua senha', 
      type: 'text', 
      content: [
        'Primeiramente, acesse seu perfil, no ícone de usuário no canto superior direito.',
        'Após isso, navegue até a área de senha, insira a nova senha que deseja e finalize ao clicar no botão "atualizar". ',
        'Pronto! Sua nova senha já foi atualizada.'
      ]
    },
    { 
      title: 'Como cadastrar usuários', 
      type: 'text', 
      content: [
        'Acesse o seguinte link e preencha o formulário:',
        <Link to="/CadastroUsuario">Página de cadastro de usuário</Link>,
        'Clique em "cadastrar" para finalizar e pronto! O novo usuário foi cadastrado.',
        ' ','Caso deseje confirmar o cadastro, acesse a seguinte página:',
        <Link to="/ListaUsuarios">Listagem de usuários</Link>,
        "E busque pelo nome do usuário cadastrado."    
      ]
    },
    { 
      title: 'Como atualizar e excluir usuários', 
      type: 'text', 
      content: [
        ' '
      ]
    },
    { 
      title: 'Como cadastrar ativos', 
      type: 'text', 
      content: [
        'Acesse o seguinte link e preencha o formulário:',
        <Link to="/CadastroAtivo">Página de cadastro de ativos</Link>,
        'Clique em "cadastrar" para finalizar e pronto! O novo ativo foi cadastrado.',
        ' ','Caso deseje confirmar o cadastro, acesse a seguinte página:',
        <Link to="/ListaAtivos">Listagem de ativos</Link>,
        "E busque pelo nome do ativo cadastrado."    
      ]
    },
    { 
      title: 'Como atualizar e excluir ativos', 
      type: 'text', 
      content: [
        ' '
      ]
    },
    { 
      title: 'Como enviar um ativo para a manutenção', 
      type: 'text', 
      content: [
        ' '
      ]
    },
    { 
      title: 'Como ver o histórico da manutenção de um ativo', 
      type: 'text', 
      content: [
        ' '
      ]
    },
    { 
      title: 'Como ver o histórico de atualização de um ativo', 
      type: 'text', 
      content: [
        ' '
      ]
    },
    { 
      title: 'Como acessar os relatórios', 
      type: 'text', 
      content: [
        ' '
      ]
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

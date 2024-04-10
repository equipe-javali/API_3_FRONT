import React, { useState, useEffect } from 'react';
import './css/visualizarUsuario.css'

interface Ativo {
  id: number;
  nome: string;
  
}

interface UsuarioLogin {
  id: number;
  senha: string;
  
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  nascimento: string;
  departamento: string;
  telefone: string;  
  ativos: Ativo[];
  usuariologin: UsuarioLogin;
}

// const usuarios: Usuario[] = [
//   { id: 1, nome: 'Usuário 1', email: 'usuario1@example.com', telefone: '123456789', ativos: 'Computador 3', departamento: 'Departamento 1' },
//   { id: 2, nome: 'Usuário 2', email: 'usuario2@example.com', telefone: '987654321', ativos: 'Computador 2', departamento: 'Departamento 2' },
//   { id: 3, nome: 'Usuário 3', email: 'usuario3@example.com', telefone: '987654321', ativos: 'Computador 1', departamento: 'Departamento 1' },
//   { id: 4, nome: 'Usuário 4', email: 'usuario4@example.com', telefone: '987654321', ativos: 'Computador 4', departamento: 'Departamento 2' },
//   { id: 5, nome: 'Usuário 5', email: 'usuario5@example.com', telefone: '987654321', ativos: 'Computador 2', departamento: 'Departamento 1' },
//   { id: 6, nome: 'Usuário 6', email: 'usuario6@example.com', telefone: '987654321', ativos: 'Computador 1', departamento: 'Departamento 2' },
// ];

function VisualizarUsuario(): JSX.Element {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [Pesquisa, setFilterValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/usuarios')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setUsuarios(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const Pesquisando = usuarios.filter(usuario => {
    const searchTermLower = searchTerm.toLowerCase();
    
    if (Pesquisa === '' || Pesquisa === 'Todos') {
      return Object.values(usuario).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(searchTermLower)
      );
    } else {
      return usuario.departamento === Pesquisa && 
             Object.values(usuario).some(value => 
               typeof value === 'string' && value.toLowerCase().includes(searchTermLower)
             );
    }
  });
  

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterValue(event.target.value);
  };

  return (
    <div className='App'>
      <header>
        <h3>Ctrl A</h3>
      </header>
      <div>
        <h2>Usuários</h2>
        <select value={Pesquisa} onChange={handleFilterChange} className="mySelect">
          <option value="">Filtro</option>
          <option value="Departamento 1">Departamento 1</option>
          <option value="Departamento 2">Departamento 2</option>
        </select>
        <input
          type="text"
          placeholder="Buscar por usuários"
          value={searchTerm}
          onChange={handleSearchChange}
          className='myInput'
        />
        <table className="userTable">
        <thead>
          <tr>
            <th className="myHeaderCell">ID</th>
            <th className="myHeaderCell">Nome</th>
            <th className="myHeaderCell">Telefone</th>
            <th className="myHeaderCell">Email</th>
            <th className="myHeaderCell">Departamento</th>
            <th className="myHeaderCell">Ativos</th>
        </tr>
</thead>
          <tbody>
            {Pesquisando.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.telefone}</td>
                <td>{usuario.email}</td>
                <td>{usuario.departamento}</td>
                <td>{usuario.ativos.map(ativo => <p key={ativo.id}>{ativo.nome}</p>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer>
        <h1 className="footerText">Todos os direitos reservados à Ctrl A</h1>
      </footer>
    </div>
  );
}

export default VisualizarUsuario;

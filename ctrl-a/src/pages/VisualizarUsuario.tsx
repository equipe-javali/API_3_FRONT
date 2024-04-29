import { useState, useEffect } from 'react';
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

export default function VisualizarUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [Pesquisa, setFilterValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetch('http://localhost:8080/usuario/listagemTodos')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Usuario[]) => {

        data.sort((a, b) => a.id - b.id);
        setUsuarios(data);
        
        const uniqueDepartamentos = new Set<string>();
        data.forEach(usuario => {
          const departamento = usuario.departamento;
          if (departamento && departamento.trim() !== '') {
            uniqueDepartamentos.add(departamento.trim());
          }
        });
        setDepartamentos(Array.from(uniqueDepartamentos));
      })
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

  const handleDelete = (id: number) => {
    fetch(`http://localhost:8080/usuario/atualizacao/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'inativo' }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Usuário inativado com sucesso!', id);

        setUsuarios(usuarios.map(usuario => usuario.id === id ? { ...usuario, status: 'inativo' } : usuario));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='VisualizarUsuario'>
      <div>
        <h2>Usuários</h2>
        <select value={Pesquisa} onChange={handleFilterChange} className="mySelect">
          <option value="">Filtro</option>
          {departamentos.map(departamento => (
            <option key={departamento} value={departamento}>
              {departamento}
            </option>
          ))}
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
            <tr></tr>
            <tr>
              <th className="myHeaderCell">ID</th>
              <th className="myHeaderCell">Nome</th>
              <th className="myHeaderCell">CPF</th>
              <th className="myHeaderCell">Nascimento</th>
              <th className="myHeaderCell">Departamento</th>
              <th className="myHeaderCell">Telefone</th>
              <th className="myHeaderCell">Email</th>
              <th className="myHeaderCell">Ações</th>
            </tr>
          </thead>
          <tbody>
            {Pesquisando.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.cpf}</td>
                <td>{usuario.nascimento}</td>
                <td>{usuario.departamento}</td>
                <td>{usuario.telefone}</td>
                <td>{usuario.email}</td>
                <td>
                  <button type='button' className='btnExcluir' onClick={() => handleDelete(usuario.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <footer>
        <h1 className="footerText">Todos os direitos reservados à Ctrl A</h1>
      </footer> */}
    </div>
  );
}
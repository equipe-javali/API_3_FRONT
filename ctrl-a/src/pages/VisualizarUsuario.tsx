import { useState, useEffect } from 'react';
import './css/visualizarUsuario.css';
import RespostaSistema from '../components/respostaSistema';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import getLocalToken from '../utils/getLocalToken';

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
  status: string; // Status como string
  ativos: Ativo[];
  usuariologin: UsuarioLogin;
}

export default function VisualizarUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [filtroDepartamento, setFiltroDepartamento] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [textoResposta, setTextoResposta] = useState('');
  const [tipoResposta, setTipoResposta] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(true);
  const [chaveAtualizacao, setChaveAtualizacao] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const token = getLocalToken();

  useEffect(() => {
    fetch('http://localhost:8080/usuario/listagemTodos', {
      headers: { "Authorization": token }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao buscar usuários: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Usuario[]) => {
        // Ensure departamento exists and is not null
        const usuariosComDepartamento = data.filter(usuario => usuario.departamento !== null);
        
        setUsuarios(usuariosComDepartamento.sort((a, b) => a.id - b.id));

        const uniqueDepartamentos = Array.from(new Set(usuariosComDepartamento.map(u => u.departamento)));
        setDepartamentos(uniqueDepartamentos); 
      })
      .catch(error => {
        setTextoResposta(`Erro ao buscar usuários: ${error.message}`);
        setTipoResposta("Erro");
      });
  }, []);

  const usuariosExibidos = mostrarInativos 
    ? usuarios
    : usuarios.filter(usuario => usuario.status.toLowerCase() === 'ativo' && usuario.departamento !== null); 

  const usuariosFiltrados = usuariosExibidos.filter(usuario => {
    const termoBuscaMatch = Object.values(usuario).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(termoBusca.toLowerCase())
    );
    const departamentoMatch = filtroDepartamento === '' || filtroDepartamento === 'Todos' || usuario.departamento?.toLowerCase() === filtroDepartamento.toLowerCase(); 
    return termoBuscaMatch && departamentoMatch;
  });


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroDepartamento(event.target.value);
  };

  const handleDelete = (id: number) => {
    const usuarioAExcluir = usuarios.find(usuario => usuario.id === id);
    if (!usuarioAExcluir || usuarioAExcluir.status.toLowerCase() !== 'ativo') {
      setTextoResposta("Apenas usuários ativos podem ser excluídos.");
      setTipoResposta("Erro");
      return; 
    }
    fetch(`http://localhost:8080/usuario/atualizacao/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ status: 'Inativo' }),
    })
      .then(response => {
        if (response.ok) {
          // Atualizar o estado localmente
          setUsuarios(prevUsuarios => prevUsuarios.map(usuario =>
            usuario.id === id ? { ...usuario, status: 'Inativo' } : usuario
          ));

          setTextoResposta("Usuário inativado com sucesso!");
          setTipoResposta("Sucesso");
        } else {
          throw new Error(`Erro ao inativar usuário: ${response.status}`);
        }
      })
      .catch(error => {
        setTextoResposta(`Erro ao inativar usuário: ${error.message}`);
        setTipoResposta("Erro");
      })
      .finally(() => setIsLoading(false));
  };
  

  const fechaPopUp = () => {
    setTextoResposta('');
    setTipoResposta('');
  };

    return (
      <div className='VisualizarUsuario' key={chaveAtualizacao}> 
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <div>
                <h2>Usuários</h2>
                <div className="search-container">
                    <select value={filtroDepartamento} onChange={handleFilterChange} className="mySelect">
                      <option value="">Departamento</option>
                      <option value="Todos">Todos</option> 
                      {departamentos.map(departamento => (
                          <option key={departamento} value={departamento}>
                              {departamento}
                          </option>
                      ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Buscar por usuários"
                        value={termoBusca}
                        onChange={handleSearchChange}
                        className='myInput'
                    />
                    <label htmlFor="mostrarInativos" className="checkbox-label">
                        <input 
                            type="checkbox" 
                            id="mostrarInativos" 
                            checked={mostrarInativos} 
                            onChange={() => setMostrarInativos(!mostrarInativos)} 
                        />
                        Mostrar Inativos
                    </label>
                </div>
                

                <table className="userTable">
                    <thead>
                        <tr></tr> 
                        <tr>
                            <th className="myHeaderCell">ID</th>
                            <th className="myHeaderCell">Nome</th>
                            <th className="myHeaderCell">Departamento</th>
                            <th className="myHeaderCell">Email</th>
                            <th className="myHeaderCell">Status</th>
                            <th className="myHeaderCell">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.nome}</td>
                                <td>{usuario.departamento}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.status} </td>
                                <td>
                                    <div className="iconContainerAtv">
                                        <Link to={`/EdicaoUsuario/${usuario.id}`}>
                                            <button type="button" className="btnIcon">
                                                <FaPencilAlt />
                                            </button>
                                        </Link>
                                        <button type="button" className="btnIcon" onClick={() => handleDelete(usuario.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


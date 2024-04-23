import { useState, useEffect } from 'react';
import './css/visualizarUsuario.css'
import RespostaSistema from '../components/respostaSistema';

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
  const [textoResposta, setTextoResposta] = useState('')
  const [tipoResposta, setTipoResposta] = useState('')
  function fechaPopUp() {
    setTextoResposta('')
    setTipoResposta('')
  }
  useEffect(() => {
    if (tipoResposta === "Sucesso") {
      const timer = setTimeout(() => {
        fechaPopUp();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [tipoResposta]);

  useEffect(() => {
    fetch('http://localhost:8080/usuario/listagemTodos')
      .then((response) => {
        if (!response.ok) {
          setTextoResposta(`Não foi possível listar os usuários! Erro:${response.status}`)
          setTipoResposta("Erro")
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
      .catch((error) => {
        setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
        setTipoResposta("Erro")
      })
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
    fetch(`http://localhost:8080/usuario/exclusao/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setTextoResposta("Usuário excluído com sucesso!")
          setTipoResposta("Sucesso")
        }
        else {
          setTextoResposta(`Não foi possível deletar! Erro:${response.status}`)
          setTipoResposta("Erro")
        }
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      })
      .catch((error) => {
        setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
        setTipoResposta("Erro")
      })
  };

  return (
    <div className='VisualizarUsuario'>
      <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
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
import iconUser from '../assets/icons/visualizar_usuario.png';
import { FormEvent, useEffect, useState } from 'react';
import './css/atualizaUsuario.css'
import { useParams } from 'react-router-dom';
import RespostaSistema from '../components/respostaSistema';
import getLocalToken from '../utils/getLocalToken';
import CampoEditavel from '../components/CampoEditavel';
import CampoSenha from '../components/CampoSenha';
import CampoDropdown from '../components/CampoDropdown';
import CampoData from '../components/CampoData';

interface UsuarioData {
    nome: string;
    cpf: string;
    nascimento: string;
    telefone: string;
    email: string;
    perfil: string; //'Usuario' ou 'Administrador'
    departamento: string;
}

export default function AtualizarUsuario() {
    const { id } = useParams<{ id: string }>();
    const token = getLocalToken();

    const [textoResposta, setTextoResposta] = useState('');
    const [tipoResposta, setTipoResposta] = useState('');
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

    const [dadosUsuario, setDadosUsuario] = useState<UsuarioData>({
        nome: '',
        cpf: '',
        nascimento: '',
        telefone: '',
        email: '',
        departamento: '',
        perfil: ''
    });

    const campoPermissao = CampoDropdown(
        "Permissão:",
        ["Usuario", "Administrador"],
        dadosUsuario.perfil === "ADM" ? "Administrador" : "Usuario",
        "Escolha uma permissão",
        true
    )

    const [temSenha, setTemSenha] = useState(false);
    useEffect(() => {
        if (campoPermissao.dado === "Usuario") {
            setTemSenha(false)
        } else if (campoPermissao.dado === "Administrador") {
            setTemSenha(true)
        }
    }, [campoPermissao.dado])

    useEffect(() => {
        const buscaDadosUsuario = async () => {
            try {
                const response = await fetch(`http://localhost:8080/usuario/listagem/${id}`, {
                    headers: {
                        "Authorization": token
                    }
                });
                if (response.ok) {
                    const dadosUsuario: UsuarioData = await response.json();
                    console.log(dadosUsuario)
                    setDadosUsuario({ ...dadosUsuario });
                } else {
                    setTextoResposta(`Erro ao buscar dados do usuário! Erro:${response.statusText}`);
                    setTipoResposta("Erro");
                }
            } catch (error) {
                setTextoResposta(`Erro ao processar requisição! Erro:${error}`);
                setTipoResposta("Erro");
            };
        };
        buscaDadosUsuario();
    }, [id, token])

    const [avisoNome, setAvisoNome] = useState<string | undefined>(undefined);
    const campoNome = CampoEditavel(
        "Nome:",
        "text",
        dadosUsuario.nome,
        "Insira o nome do usuário",
        "Nome",
        true,
        avisoNome
    );

    const [avisoCPF, setAvisoCPF] = useState<string | undefined>(undefined);
    const campoCPF = CampoEditavel(
        "CPF:",
        "text",
        dadosUsuario.cpf,
        "Insira o cpf do usuário",
        "CPF",
        true,
        avisoCPF
    );

    const [avisoTelefone, setAvisoTelefone] = useState<string | undefined>(undefined);
    const campoTelefone = CampoEditavel(
        "Telefone:",
        "text",
        dadosUsuario.telefone,
        "insira o telefone do usuário",
        "Telefone",
        true,
        avisoTelefone
    );

    const [avisoEmail, setAvisoEmail] = useState<string | undefined>(undefined);
    const campoEmail = CampoEditavel(
        "Email:",
        "email",
        dadosUsuario.email,
        "Insira o email do usuário",
        "Email",
        true,
        avisoEmail
    );

    const [avisoNascimento, setAvisoNascimento] = useState<string | undefined>(undefined);
    const campoNascimento = CampoData(
        "Data Nascimento:",
        "Nascimento",
        dadosUsuario.nascimento,
        true,
        avisoNascimento
    )

    const [avisoDepartamento, setAvisoDepartamento] = useState<string | undefined>(undefined);
    const campoDepartamento = CampoDropdown(
        "Departamento:",
        ["Departamento 1", "Departamento 2"],
        dadosUsuario.departamento,
        "Escolha um departamento",
        true,
        avisoDepartamento
    )

    const [avisoSenha, setAvisoSenha] = useState<string | undefined>(undefined);
    const campoSenha = CampoSenha(
        "Senha:",
        "Insira a senha",
        true,
        avisoSenha
    );

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let certo = true;
        if (campoNome.dado === '' || !campoNome.dado) {
            setAvisoNome("Insira algo no nome!");
            certo = false;
        }
        if (campoCPF.dado === '') {
            setAvisoCPF("Insira o cpf!");
            certo = false;
        } else if (campoCPF.dado.length !== 14) {
            setAvisoCPF("Insira um cpf válido!");
            certo = false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (campoEmail.dado === '') {
            setAvisoEmail("Insira um email!");
            certo = false;
        } else if (!emailRegex.test(campoEmail.dado)) {
            setAvisoEmail("Insira um email válido!");
        }
        if (campoTelefone.dado === '') {
            setAvisoTelefone("Insira um telefone!");
            certo = false;
        } else if (![14, 15].includes(campoTelefone.dado.length)) {
            setAvisoTelefone("Insira um telefone válido!");
            certo = false;
        }
        if (campoNascimento.dado === '') {
            setAvisoNascimento("Insira uma data!");
            certo = false;
        }
        if (campoDepartamento.dado === '') {
            setAvisoDepartamento("Escolha um departamento!");
            certo = false;
        }
        if (temSenha && campoSenha.dado === '') {
            setAvisoSenha("Insira uma senha");
            certo = false;
        }
        if (certo) {
            try {
                if (temSenha && dadosUsuario.perfil !== "ADM") {
                    const cadastrarLogin = await fetch(`http://localhost:8080/usuarioLogin/cadastro`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": token
                        },
                        body: JSON.stringify({
                            'usuario': { "id": id },
                            'senha': campoSenha.dado
                        })
                    });
                    if (cadastrarLogin.status !== 201) {
                        setTextoResposta(`Falha ao cadastrar o login! Erro:${cadastrarLogin.status}`);
                        setTipoResposta("Erro");
                    }
                } else if (temSenha) {
                    const atualizarLogin = await fetch(`http://localhost:8080/usuarioLogin/atualizacao/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({
                            usuario: { id },
                            senha: campoSenha.dado
                        })
                    });
                    if (!atualizarLogin.ok) {
                        setTextoResposta(`Falha ao atualizar o login! Erro:${atualizarLogin.statusText}`);
                        setTipoResposta("Erro");
                    };
                } else /* if (dadosUsuario.perfil == "ADM") */ {
                    const excluirLogin = await fetch(`http://localhost:8080/usuarioLogin/exclusao/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': token
                        }
                    });
                    if (excluirLogin.status !== 200) {
                        setTextoResposta(`Falha ao deletar o login! Erro:${excluirLogin.statusText}`);
                        setTipoResposta("Erro");
                    }
                };
                const atualizarDados = await fetch(`http://localhost:8080/usuario/atualizacao/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        nome: campoNome.dado,
                        cpf: campoCPF.dado.replace(/\D/g, ''),
                        nascimento: campoNascimento.dado,
                        departamento: campoDepartamento.dado,
                        telefone: campoTelefone.dado.replace(/\D/g, ''),
                        email: campoEmail.dado
                    })
                });
                if (atualizarDados.status !== 200) {
                    setTextoResposta(`Falha ao atualizar o login! Erro:${atualizarDados.statusText}`);
                    setTipoResposta("Erro");
                } else {
                    if (temSenha || dadosUsuario.perfil === "ADM") {
                        setTextoResposta("Sucesso ao atualizar os dados e o login!");
                    } else {
                        setTextoResposta("Sucesso ao atualizar os dados!");
                    }
                    setTipoResposta("Sucesso");
                };
            } catch (error) {
                setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
                setTipoResposta("Erro")
            }
        }
    }

    return (
        <>
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <form className='divAtualizarUsuario' onSubmit={handleSubmit}>
                <div className='primeiroBlocoAtualizarUsuario'>
                    <div>
                        <div>
                            {campoNome.codigo}
                            {campoCPF.codigo}
                        </div>
                        <div>
                            {campoNascimento.codigo}
                            {campoTelefone.codigo}
                        </div>
                    </div>
                    <div>
                        <img className="imgPerfilAtualizarUsuario" src={iconUser} alt="ícone usuário" />
                    </div>
                </div>
                <div className='segundoBlocoAtualizarUsuario'>
                    <div>
                        {campoEmail.codigo}
                        {campoPermissao.codigo}
                        {temSenha && campoSenha.codigo}
                        {campoDepartamento.codigo}
                    </div>
                    <div>
                        <input type='submit' className='buttonAtualizar' value='Atualizar' />
                    </div>
                </div>
            </form>
        </>
    )
}
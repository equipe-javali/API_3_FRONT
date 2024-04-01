import CampoAtivoDropdown from '../components/CampoAtivoDropdown';
import CampoAtivoPadrao from '../components/CampoAtivoPadrao';
import './css/cadastroAtivosTangíveis.css'
import { useState } from "react"

export default function CadastroAtivosTangiveis() {
    const [nomeAtivo, setNomeAtivo] = useState('');
    const [temNome, setTemNome] = useState(false);
    const [erro, setErro] = useState('');

    const pessoas = ['nome 1', 'nome 2', 'nome 3']
    const departamentos = ['nome 1', 'nome 2', 'nome 3']

    const produto = CampoAtivoPadrao(
        "Produto",
        "text",
        "Nome do produto",
        "Produto"
    )
    const marca = CampoAtivoPadrao(
        "Marca",
        "text",
        "Nome da marca",
        "Marca"
    )
    const custo = CampoAtivoPadrao(
        "Custo",
        "number",
        "Valor do custo",
        "Custo"
    )
    const garantia = CampoAtivoPadrao(
        "Garantia",
        "date",
        "",
        "Garantia"
    )
    const aquisicao = CampoAtivoPadrao(
        "Data da aquisição",
        "date",
        "",
        "Aquisição"
    )
    const expiracao = CampoAtivoPadrao(
        "Data da expiração",
        "date",
        "",
        "Expiração"
    )
    const dominio = CampoAtivoPadrao(
        "Dominio",
        "url",
        "https://dominio.com",
        "Dominio"
    )
    const numeroSerie = CampoAtivoPadrao(
        "Número de série",
        "text",
        "número de série",
        "Número"
    )
    const atualizacao = CampoAtivoPadrao(
        "Última atualização",
        "datetime-local",
        "",
        "Atualização"
    )
    const tipo = CampoAtivoPadrao(
        "Tipo",
        "text",
        "o(s) tipo(s)",
        "Tipo"
    )
    const tag = CampoAtivoPadrao(
        "Tag",
        "text",
        "a(s) tag(s)",
        "Tag"
    )
    const grauImportancia = CampoAtivoPadrao(
        "Grau de importância",
        "text",
        "grau de importância",
        "Importância"
    )
    const status = CampoAtivoPadrao(
        "Status",
        "text",
        "status",
        "Atualização"
    )
    const usadoPor = CampoAtivoDropdown(
        "Usado Por",
        pessoas,
        "nome do usuário",
        "Uso"
    )
    const gerenciadoPor = CampoAtivoDropdown(
        "Gerenciado Por",
        pessoas,
        "nome do gerente",
        "Gerenciamento"
    )
    const departamento = CampoAtivoDropdown(
        "Departamento",
        departamentos,
        "nome do departamento",
        "Departamento",
    )
    const localizacao = CampoAtivoPadrao(
        "Localização",
        "text",
        "Localização",
        "localização"
    )

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (nomeAtivo !== '' && temNome) {
            fetch(`LINK_CONEXÃO_BACK`, {
                method: 'POST',
                body: JSON.stringify({
                    'codigo': 0,
                    'nomeAtivo': nomeAtivo,
                    'nomeProduto': produto.dados[0] ? produto.dados[1] : undefined,
                    'nomeMarca': marca.dados[0] ? marca.dados[1] : undefined,
                    'numeroCusto': custo.dados[0] ? custo.dados[1] : undefined,
                    'dataGarantia': garantia.dados[0] ? garantia.dados[1] : undefined,
                    'dataAquisicao': aquisicao.dados[0] ? aquisicao.dados[1] : undefined,
                    'dataExpiracao': expiracao.dados[0] ? expiracao.dados[1] : undefined,
                    'dominioAtivo': dominio.dados[0] ? dominio.dados[1] : undefined,
                    'numeroSerieAtivo': numeroSerie.dados[0] ? numeroSerie.dados[1] : undefined,
                    'ultimaAtualizacao': atualizacao.dados[0] ? atualizacao.dados[1] : undefined,
                    'tipoAtivo': tipo.dados[0] ? tipo.dados[1] : undefined,
                    'tagAtivo': tag.dados[0] ? tag.dados[1] : undefined,
                    'importanciaAtivo': grauImportancia.dados[0] ? grauImportancia.dados[1] : undefined,
                    'statusAtivo': status.dados[0] ? status.dados[1] : undefined,
                    'usuarioAtivo': usadoPor.dados[0] ? usadoPor.dados[1] : undefined,
                    'gerenteAtivo': gerenciadoPor.dados[0] ? gerenciadoPor.dados[1] : undefined,
                    'departamentoAtivo': departamento.dados[0] ? departamento.dados[1] : undefined,
                    'localizacaoAtivo': localizacao.dados[0] ? localizacao.dados[1] : undefined
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            }).then(response => {
                if (response.status === 200) {
                    setErro("Cadastrado com Sucesso!")
                } else {
                    /* (response.json()).then(data => {
                        setErro(data.msg)
                    }); */
                }
            });
        } else {
            setErro("O cadastro do nome do ativo é obrigatório!")
        }
    };

    return (
        <>
            <div className="DivCadastroAtivosTangiveis">
                <div className='DivTituloForms'>
                    <h1> Cadastrar Ativo Tangível </h1>
                </div>
                <form
                    className='FormsCadastroAtivosTangiveis'
                    onSubmit={handleSubmit}
                >
                    {/* Esquerda */}
                    <div>
                        <div className='DivDescricaoAtivosTangiveis NomeFormsAtivo'>
                            {temNome ?
                                <input
                                    placeholder='Insira o nome'
                                    value={nomeAtivo}
                                    onChange={(e) => setNomeAtivo(e.target.value)}
                                />
                                :
                                <p
                                    onClick={() => setTemNome(!temNome)}
                                >
                                    {nomeAtivo ? nomeAtivo : "Nome do ativo"}
                                </p>
                            }
                        </div>
                        <div className='DivDescricaoAtivosTangiveis Azul2'>
                            <div>
                                {produto.codigo}
                                {marca.codigo}
                                {custo.codigo}
                                {garantia.codigo}
                            </div>
                            <div>
                                {aquisicao.codigo}
                                {expiracao.codigo}
                            </div>
                            <div>
                                {dominio.codigo}
                                {numeroSerie.codigo}
                                {atualizacao.codigo}
                            </div>
                        </div>
                    </div>
                    {/* Direita */}
                    <div className='Azul1'>
                        <div className='DivDescricaoAtivosTangiveis'>
                            {tipo.codigo}
                            {tag.codigo}
                            {grauImportancia.codigo}
                            {status.codigo}
                        </div>
                        <div className='DivDescricaoAtivosTangiveis'>
                            {usadoPor.codigo}
                            {gerenciadoPor.codigo}
                            {departamento.codigo}
                            {localizacao.codigo}
                            <input
                                type='submit'
                                placeholder='Cadastrar'
                                className='BotaoCadastrarAtivo'
                            />
                        </div>
                    </div>
                </form>
                {erro && <p className="erro">{erro}</p>}
            </div>
        </>
    )
}
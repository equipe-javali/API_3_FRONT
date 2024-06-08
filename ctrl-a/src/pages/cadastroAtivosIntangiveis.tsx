import { useState } from 'react';
import CampoPadrao from '../components/CampoPadrao';
import CampoDropdown from '../components/CampoDropdown';
import CampoData from '../components/CampoData';

export default function CadastroAtivosIntangiveis() {
    const tag = CampoPadrao(
        "Tag:",
        "text",
        "Insira as tags...",
        "Tag",
        false
    )

    const [validarExpiracao, setValidarExpiracao] = useState<string | undefined>(undefined);
    const expiracao = CampoData(
        "Data de expiração:",
        "Expiração",
        "",
        true,
        validarExpiracao
    )

    const importancia = CampoDropdown(
        "Importância:",
        ["Alta", "Média", "Baixa"],
        "",
        "Escolha um grau de importância",
        false
    )

    const periodoAmortizacao = CampoDropdown(
        "Período de amortização:",
        [ "diário", "mensal", "semestral", "anual"],
        "",
        "Escolha um período de amortização",
        false
    )

    const taxaAmortizacao = CampoPadrao(
        "Taxa de amortização:",
        "text",
        "00%",
        "Taxa",
        false
    )

    function limpar() {
        tag.limpar()
        expiracao.limpar()
        importancia.limpar()
        periodoAmortizacao.limpar()
        taxaAmortizacao.limpar()
    }

    const codigo = (
        <>
            <div className='colunaFormsAtivo'>
                {tag.codigo}
                {expiracao.codigo}
                {/* anexo.codigo */}
            </div>
            <div className='colunaFormsAtivo'>
                {importancia.codigo}
                {periodoAmortizacao.codigo}
                {taxaAmortizacao.codigo}
            </div>
        </>
    )
    return {
        dados: {
            tag: tag.dado,
            importancia: importancia.dado,
            expiracao: expiracao.dado,
            periodoAmortizacao: periodoAmortizacao.dado,
            taxaAmortizacao: taxaAmortizacao.dado
        },
        validacoes: {
            setValidarExpiracao
        },
        codigo,
        limpar
    }
}
import { useState } from 'react';
import CampoPadrao from '../components/CampoPadrao';
import CampoData from '../components/CampoData';
import CampoDropdown from '../components/CampoDropdown';

export default function CadastroAtivosTangiveis() {
    const tag = CampoPadrao(
        "Tag:",
        "text",
        "Insira as tags...",
        "Tag",
        false
    )

    const [validarGarantia, setValidarGarantia] = useState<string | undefined>(undefined);
    const garantia = CampoData(
        "Validade de garantia:",
        "Expiração",
        "",
        true,
        validarGarantia
    )

    const importancia = CampoDropdown(
        "Importância:",
        ["Alta", "Média", "Baixa"],
        "",
        "Escolha um grau de importância",
        false
    )

    const periodoDepreciacao = CampoDropdown(
        "Período de depreciação:",
        [ "diário", "mensal", "semestral", "anual"],
        "",
        "Escolha um período de amortização",
        false
    )

    const taxaDepreciacao = CampoPadrao(
        "Taxa de depreciação:",
        "text",
        "00%",
        "Taxa",
        false
    )

    function limpar() {
        tag.limpar()
        garantia.limpar()
        importancia.limpar()
        periodoDepreciacao.limpar()
        taxaDepreciacao.limpar()
    }

    const codigo = (
        <>
            <div className='colunaFormsAtivo'>
                {tag.codigo}
                {garantia.codigo}
                {/* anexo.codigo */}
            </div>
            <div className='colunaFormsAtivo'>
                {importancia.codigo}
                {periodoDepreciacao.codigo}
                {taxaDepreciacao.codigo}
            </div>
        </>
    )

    return {
        dados: {
            tag: tag.dado,
            garantia: garantia.dado,
            importancia: importancia.dado,
            periodoDepreciacao: periodoDepreciacao.dado,
            taxaDepreciacao: taxaDepreciacao.dado
        },
        validacoes: {
            setValidarGarantia
        },
        codigo,
        limpar
    }
}
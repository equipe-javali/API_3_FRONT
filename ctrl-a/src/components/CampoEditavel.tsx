import lapis from '../assets/icons/lapis.svg'
import { useCallback, useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoEditavel(
    titulo: string,
    tipo: string,
    descricao: string,
    placeholder: string,
    palavraChave: string,
    obrigatorio: boolean,
    aviso?: string
) {
    const [editavel, setEditavel] = useState(false)
    const [descricaoCampo, setDescricaoCampo] = useState("")

    const mascaraCampo = useCallback((descricao: string): string => {
        if (palavraChave === "Telefone") {
            const telefone = descricao.replace(/\D/g, '').slice(0, 11);
            if (telefone.length === 11) {
                return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (telefone.length === 10) {
                return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
        } else if (palavraChave === "CPF") {
            const cpf = descricao.replace(/\D/g, '').slice(0, 11);
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (palavraChave === "Custo") {
            let valor = descricao.replace(/\D/g, '');
            valor = valor.replace(/^0+/, '');
            if (valor.length !== 0) {
                if (valor.length === 1) {
                    valor = "00" + valor;
                } else if (valor.length === 2) {
                    valor = "0" + valor;
                } else {
                    valor = valor.padStart(3, '0');
                }
                valor = valor.slice(0, -2) + ',' + valor.slice(-2);
                valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                valor = 'R$' + valor;
            }
            return valor;
        } else if (palavraChave === "Taxa") {
            let taxa = descricao.replace(/\D/g, '');
            if (taxa.length !== 0) {
                taxa = parseInt(taxa, 10).toString(); // Remove leading zeros
                taxa = taxa + '%';
            }
            return taxa;
        }
        return descricao;
    }, [palavraChave]);
    useEffect(() => {
        setDescricaoCampo(mascaraCampo(descricao));
    }, [descricao, mascaraCampo]);
    
    const [erroCampo, setErroCampo] = useState(false);
    useEffect(() => {
        if (aviso) {
            setEditavel(true);
            setErroCampo(true);
        }
    }, [aviso]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setDescricaoCampo(mascaraCampo(valor));
        if (erroCampo) {
            setErroCampo(false);
        }
    };

    const handleBlur = () => {
        if (!descricaoCampo) {
            setErroCampo(true);
        }
    };

    const codigo = (
        <div className={`divCampoEditavel ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <div className={`inputCampoEditavel ${editavel ? 'inputEnabled' : 'inputDesabled'}`}>
                    <input
                        placeholder={placeholder}
                        type={tipo}
                        value={descricaoCampo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!editavel}
                    />
                    <img src={lapis} alt='Lápis-Editar' onClick={(e) => setEditavel(!editavel)} />
                </div>
            </div>
            {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
        </div>
    );

    return {
        dado: descricaoCampo,
        codigo,
    };
};
import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoPadrao(
    titulo: string,
    tipo: string,
    placeholder: string,
    palavraChave: string,
    obrigatorio: boolean,
    aviso?: string
) {
    const [descricaoCampo, setDescricaoCampo] = useState('');
    const [erroCampo, setErroCampo] = useState(false);

    function mascaraCampo(descricao: string): string {
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
                    valor = "00" + valor
                } else if (valor.length === 2) {
                    valor = "0" + valor
                } else {
                    valor = valor.padStart(3, '0');
                }
                valor = valor.slice(0, -2) + ',' + valor.slice(-2);
                valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                valor = 'R$' + valor
            }
            return valor
        } else if (palavraChave === "Taxa") {
            let taxa = descricao.replace(/\D/g, '');
            taxa = taxa.replace(/^0+/, '');
            if (taxa.length !== 0) {
                if (taxa.length === 1) {
                    taxa = "00" + taxa
                } else if (taxa.length === 2) {
                    taxa = "0" + taxa
                } else {
                    taxa = taxa.padStart(3, '0');
                }
                taxa = taxa.slice(0, -2) + ',' + taxa.slice(-2);
                taxa = taxa.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                taxa = taxa + '%';
            }
            return taxa
        }
        return descricao;
    }

    useEffect(() => {
        if (aviso) {
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

    function limpar() {
        setDescricaoCampo('')
    }

    const codigo = (
        <div className={`divCampoPadrao ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <input
                    placeholder={placeholder}
                    type={tipo}
                    value={descricaoCampo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </div>
            {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
        </div>
    );

    return {
        dado: descricaoCampo,
        codigo,
        limpar
    };
}

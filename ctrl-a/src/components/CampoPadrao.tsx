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
            return cpf.replace(/(\d{3})(\d)/g, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
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

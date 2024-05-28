import "./css/CampoPadrao.css";

export default function CampoDesativado(
    titulo: string,
    tipo: string,
    placeholder: string,
    descricao: string,
    obrigatorio: boolean
) {
    return (
        <div className={`divCampoDesativado`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <input
                    type={tipo}
                    placeholder={placeholder}
                    value={descricao}
                    disabled
                />
            </div>
        </div>
    );
};
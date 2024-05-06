import "./css/respostaSistema.css";
import iconePopUpErro from "../assets/icons/popUpErro.svg";
import iconePopUpSucesso from "../assets/icons/popUpSucesso.svg";

interface Props {
    textoResposta: string;
    tipoResposta: string;
    onClose: () => void;
}

const RespostaSistema: React.FC<Props> = ({ textoResposta, tipoResposta, onClose }) => {
    if (!textoResposta || !tipoResposta) {
        return <></>;
    }
    const iconSrc = tipoResposta === 'Erro' ? iconePopUpErro : iconePopUpSucesso;
    const altText = tipoResposta === 'Erro' ? "popUpErro" : "popUpSucesso";
    return (
        <div className="respostaSistema" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}>
                <img src={iconSrc} alt={altText} />
                <span>{textoResposta}</span>
                {tipoResposta === 'Erro' && <button onClick={onClose}>OK</button>}
            </div>
        </div>
    );
}

export default RespostaSistema
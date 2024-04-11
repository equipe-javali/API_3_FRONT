import { FC, ReactElement } from "react";
import './modalAtivo.css'

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactElement;
}

export default function Modal(props: ModalProps): ReturnType<FC> {
    return (
        <div className={`${"modal"} ${props.open ? "display-block" : "display-none"}`}>
            <div className="modal-main">
                <div className="modal-head">
                    <h2>Atribua seu ativo</h2>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="btn-container">
                    <button type="button" className="btn" onClick={props.onClose}>Salvar</button>
                    <button type="button" className="btn cancelar" onClick={props.onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}
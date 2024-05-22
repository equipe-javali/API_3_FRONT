import { FC, ReactElement } from "react";
import './modal.css'

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
    title: string;    
    children: ReactElement;
}

export default function Modal(props: ModalProps): ReturnType<FC> {
    return (
        <div className={`${"modal"} ${props.open ? "display-block" : "display-none"}`}>
            <div className="modal-main">
                <div className="modal-head">
                <h2>{props.title}</h2>
                </div>
                <div className="modal-body">
                    {props.children}                    
                </div>
                <div className="btn-container">
                    <button type="button" className="btn" onClick={props.onClose}>Salvar</button>
                    <button type="button" className="btn cancelar" onClick={props.onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}
import { FC, ReactElement } from "react";
import './modalNotificacao.css'

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
    title: string;    
    children: ReactElement;
}

export default function ModalNotificacao(props: ModalProps): ReturnType<FC> {
    return (
        <div className={`${"modalNotificacao"} ${props.open ? "display-block" : "display-none"}`}>
            <div className="modalNotificacao-main">
                <div className="modal-head">
                <h2>{props.title}</h2>
                </div>
                <div className="modalNotificacao-body">
                    {props.children}
                </div>
                
            </div>
        </div>
    );
}
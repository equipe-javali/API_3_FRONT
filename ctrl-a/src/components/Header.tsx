import { Component } from "react";
import "./css/Header.css";
import user_png from "../assets/icons/visualizar_usuario.png";
import logout from '../assets/icons/logout.svg';
import { Link } from "react-router-dom";
import { FaBell } from 'react-icons/fa';
import Notificacao from './Notificacao';
import ModalNotificacao from './modal/modalNotificacao';

export default class Header extends Component<{}, { showNotification: boolean, notificationCount: number }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            showNotification: false,
            notificationCount: 0
        };
    }

    handleBellClick = () => {
        this.setState(prevState => ({ showNotification: !prevState.showNotification }));
    }

    handleNotificationUpdate = (garantiaCount: number, expiracaoCount: number) => {
        this.setState({ notificationCount: garantiaCount + expiracaoCount });
    }

    render() {
        return (
            <header id="header-component">
                <div id="header-right-side">
                    <div id="bell-icon-holder" onClick={this.handleBellClick}>
                        <FaBell />
                        {this.state.notificationCount > 0 && 
                            <span className="notification-count">{this.state.notificationCount}</span>}
                        <ModalNotificacao 
                            open={this.state.showNotification} 
                            onClose={this.handleBellClick}
                            onCancel={this.handleBellClick}
                            title="Avisos"
                            
                        >
                            
                            <Notificacao 
                                onUpdate={(garantiaCount, expiracaoCount) => this.handleNotificationUpdate(garantiaCount, expiracaoCount)} 
                            />
                        </ModalNotificacao>
                    </div>
                    <Link to={`/EdicaoUsuario/${localStorage.getItem("id")}`}>
                        <div id="user-icon-holder">
                            <img src={user_png} alt="Ícone de usuário" />
                        </div>
                    </Link>
                    <Link to="/" onClick={() => {localStorage.clear()}}>
                        <div id="logout-icon-holder">
                            <img src={logout} alt="Ícone de Logout" />
                        </div>
                    </Link>
                </div>
            </header>
        );
    }
}
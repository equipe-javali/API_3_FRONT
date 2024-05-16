import { Component } from "react";
import "./css/Header.css";
import user_png from "../assets/icons/visualizar_usuario.png";
import logout from '../assets/icons/logout.svg';
import { Link } from "react-router-dom";
import { FaBell } from 'react-icons/fa';
import Notificacao from './Notificacao';

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

    handleNotificationUpdate = (count: number) => {
        this.setState({ notificationCount: count });
    }

    render() {
        return (
            <header id="header-component">
                <div id="header-right-side">
                    <div id="bell-icon-holder" onClick={this.handleBellClick}>
                        <FaBell />
                        {this.state.notificationCount > 0 && 
                            <span className="notification-count">{this.state.notificationCount}</span>}
                        <Notificacao 
                            onUpdate={this.handleNotificationUpdate} 
                            className={this.state.showNotification ? '' : 'notificacao-oculta'} 
                        />
                    </div>
                    <Link to="/" onClick={() => {localStorage.clear()}}>
                        <div id="logout-icon-holder">
                            <img src={logout} alt="Ícone de Logout" />
                        </div>
                    </Link>
                    
                    <Link to={`/EdicaoUsuario/${localStorage.getItem("id")}`}>
                        <div id="user-icon-holder">
                            <img src={user_png} alt="Ícone de usuário" />
                        </div>
                    </Link>
                </div>
            </header>
        );
    }
}
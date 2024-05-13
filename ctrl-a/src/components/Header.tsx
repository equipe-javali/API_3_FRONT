import { Component } from "react";
import "./css/Header.css";
import user_png from "../assets/icons/visualizar_usuario.png";
import logout from '../assets/icons/logout.svg';
import { Link } from "react-router-dom";


export default class Header extends Component<{}> {
    render() {
        return (
            <header id="header-component">
                <div id="header-right-side">
                    <Link to="/" onClick={() => {localStorage.clear()}}>
                        <div id="logout-icon-holder">
                            <img src={logout} alt="Ícone de Logout" />
                        </div>
                    </Link>
                    {/* <Notificacao/> */}
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
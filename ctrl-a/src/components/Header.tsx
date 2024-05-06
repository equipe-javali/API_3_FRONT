import { Component } from "react";
import "./css/Header.css";
import user_png from "../assets/icons/user.png";
import logo from '../assets/icons/logo.png';


export default class Header extends Component<{}> {
    render() {
        return (
            <header id="header-component">
                <img src={logo} alt="Logo" className="logo" />
                <div id="header-right-side">
                    {/* <Logout/> */}
                    {/* <Notificacao/> */}
                    <div id="user-icon-holder">
                        <img src={user_png} alt="Ícone de usuário" />
                    </div>
                </div>
            </header>
        );
    }
}
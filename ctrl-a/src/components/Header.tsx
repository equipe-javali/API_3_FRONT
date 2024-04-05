import { Component } from "react";
import "./css/Header.css";
import user_png from "../assets/icons/user.png";



export default class Header extends Component<{}> {
    render() {
        return (
            <header id="header-component">
                <h1 id="header-app-title">Ctrl-A</h1>
                <div id="header-right-side">
                    {/* <Logout/> */}
                    {/* <Notificacao/> */}
                    <div id="user-icon-holder">
                        <img src={user_png} alt="Ícone de usuário"/>
                    </div>
                </div>
            </header>
        );
    }
}
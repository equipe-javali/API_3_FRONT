import { Component } from "react";
import "./css/Header.css";
import user_png from "../assets/icons/user.png";

type MyProps = {
    // using `interface` is also ok
    // message: string;
};

export default class Header extends Component<MyProps> {
    render() {
        return (
            <header id="header-component">
                <h1 id="header-app-title">Ctrl-A</h1>
                <div id="user-icon-holder">
                    <img src={user_png} alt="Ícone de usuário"/>
                </div>
                {/* {this.props.message} */}
            </header>
        );
    }
}
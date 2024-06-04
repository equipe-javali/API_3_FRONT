import { Component } from "react";
import { Outlet, RouteProps } from "react-router-dom";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import "./css/BaseLateralHeader.css";
import criar_Ativo_png from "../assets/icons/criar_ativo.png";
import ver_Ativo_png from "../assets/icons/ver_ativos.png";
import criar_usuario_png from "../assets/icons/criar_usuario.png";
import visualizar_usuario_png from "../assets/icons/visualizar_usuario.png";
import ajuda_png from "../assets/icons/ajuda.png";

export default class BaseLateralHeader extends Component<RouteProps> {
    render() {
        return (
            <div id="app-content-lr">
                <SideMenu links={[
                    [ver_Ativo_png, "ListaAtivos", "Listar ativos"],
                    [criar_Ativo_png, "CadastroAtivo", "Cadastrar ativo"],
                    [visualizar_usuario_png, "ListaUsuarios", "Listar usuários"],
                    [criar_usuario_png, "CadastroUsuario", "Cadastrar usuário"],
                    [ajuda_png, "Manual", "Manual do usuário"]
                ]} />
                <div id="app-content-tb">
                    <Header />
                    <Outlet />
                </div>
            </div>
        );
    }
}
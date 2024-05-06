import { Component } from "react";
import { Outlet, RouteProps } from "react-router-dom";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import "./css/BaseLateralHeader.css";
import criar_Ativo_png from "../assets/icons/criar_ativo.png";
import ver_Ativo_png from "../assets/icons/ver_ativos.png";
import home_png from "../assets/icons/home.png";
import criar_usuario_png from "../assets/icons/criar_usuario.png";
import visualizar_usuario_png from "../assets/icons/visualizar_usuario.png";
import manutencao_png from "../assets/icons/manutencao.png";

export default class BaseLateralHeader extends Component<RouteProps> {
    render() {
        return (
            <div id="app-content-lr">
                <SideMenu links={[
                    [visualizar_usuario_png, "ListaUsuarios"],
                    [criar_Ativo_png, "CadastroAtivo"],
                    [criar_usuario_png, "CadastroUsuario"],
                    [ver_Ativo_png, "ListaAtivos"],                    
                ]} />
                <div id="app-content-tb">
                    <Header />
                    <Outlet />
                </div>
            </div>
        );
    }
}
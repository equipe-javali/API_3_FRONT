import { Component } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/icons/logo.png';
import "./css/SideMenu.css";



type Props = {
    // Array de tuplas, o primeiro elemento é o ícone, o segundo é o link da página
    links: Array<[string, string, string]>
};


export default class SideMenu extends Component<Props> {
    buildLinks() {
        return this.props.links.map(
            (link, index) =>
                <>
                    <Link to={link[1]} className="sidemenu-link">
                        <img src={link[0]} className="sidemenu-link-icon" alt={link[1]}/>
                    </Link>
                    <p className="sidemenu-cap">{link[2]}</p>
                    {
                        index < this.props.links.length - 1 ?
                            (<span className="sidemenu-divisor"></span>) :
                            (<></>)
                    }
                </>
        );
    }

    render() {
        return (
            <div id="sidemenu-component">
                <img src={logo} alt="Logo" className="logo" />
                {this.buildLinks()}
                <div>
                </div>
            </div>
        );
    }
}
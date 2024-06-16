import { Component } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/icons/logo.png';
import "./css/SideMenu.css";



type Props = {
    // Array de tuplas, o primeiro elemento é o ícone, o segundo é o link da página
    links: Array<[string, string, string]>
};


export default class SideMenu extends Component<Props> {
    state = {
        isMenuHovered: false,
    };

    handleMenuHoverEnter = () => {
        this.setState({ isMenuHovered: true });
    };

    handleMenuHoverLeave = () => {
        this.setState({ isMenuHovered: false });
    };

    buildLinks() {
        const { isMenuHovered } = this.state;

        return this.props.links.map(
            (link, index) =>
                <>
                    <Link to={link[1]} className="mainsidemenu-link">
                        <div className={`sidemenu-link ${isMenuHovered ? "expanded" : ""}`}>
                            <img src={link[0]} className="sidemenu-link-icon" alt={link[1]} />
                        </div>
                            {isMenuHovered && <p className="sidemenu-cap">{link[2]}</p>}
                    </Link>
                    {
                        index < this.props.links.length - 1 ?
                            (<span className="sidemenu-divisor"></span>) :
                            (<></>)
                    }
                </>
        );
    }

    render() {
        const { isMenuHovered } = this.state;

        return (
            <div id="sidemenu-component" className={isMenuHovered ? "expanded" : ""}
                onMouseEnter={this.handleMenuHoverEnter}
                onMouseLeave={this.handleMenuHoverLeave}>
                <img src={logo} alt="Logo" className="logo" />
                {this.buildLinks()}
                <div>
                </div>
            </div>
        );
    }
}
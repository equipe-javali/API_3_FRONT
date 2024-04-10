import { Component } from "react";
import { Link } from "react-router-dom";
import "./css/SideMenu.css";



type Props = {
    // Array de tuplas, o primeiro elemento é o ícone, o segundo é o link da página
    links: Array<[string, string]>
};


export default class SideMenu extends Component<Props> {
    buildLinks() {
        return this.props.links.map(
            (link, index) =>
                <>
                    <Link to={link[1]} className="sidemenu-link">
                        <img src={link[0]} className="sidemenu-link-icon" />
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
        return (
            <div id="sidemenu-component">
                {this.buildLinks()}
                <div>
                </div>
                {/* {this.props.message} */}
            </div>
        );
    }
}
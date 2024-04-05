import { Component, ReactNode } from "react";
import { Outlet, RouteProps } from "react-router-dom";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import "./css/BaseLateralHeader.css";
import user_png from "../assets/icons/user.png";
import home_png from "../assets/icons/home.png";



export default class BaseLateralHeader extends Component<RouteProps> {
    render() {
        return (
            <>
                <Header />
                <div id="app-content">
                    <SideMenu links={[
                        [home_png, "/"],
                        [user_png, "/funcionario"]
                    ]}/>
                    <Outlet />
                </div>
            </>
        );
    }
}
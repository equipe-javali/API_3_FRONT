import { Component, ReactNode } from "react";
import { Outlet, RouteProps } from "react-router-dom";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";



export default class BaseLateralHeader extends Component<RouteProps> {
    render() {
        return (
            <>
                <Header />
                <div>
                    <SideMenu />
                    <Outlet />
                </div>
            </>
        );
    }
}
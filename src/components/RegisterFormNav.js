import React from 'react';
import {
    Navbar, NavbarBrand, Nav, NavItem
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import Brand from '../shared/assets/images/b.png';

export const RegisterFormHeader = () => {
        return (
            <React.Fragment>
                <Navbar className="navbar-dark nav-signup" expand="md">
                    <div className="container">
                        <NavbarBrand className="mr-auto" href="/">
                            <img
                                src={Brand}
                                className="imagen-navbar-profile"
                                height="30"
                                width="41"
                                alt="Red Social"
                            />
                        </NavbarBrand>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to="/">
                                        <span className="fa fa-home fa-lg" />
                                    </NavLink>
                                </NavItem>
                            </Nav>
                    </div>
                </Navbar>
            </React.Fragment>
        );
}
import AuthContext from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarBrand from "@material-tailwind/react/NavbarBrand";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import NavItem from "@material-tailwind/react/NavItem";
import NavLink from "@material-tailwind/react/NavLink";
import NavbarInput from "@material-tailwind/react/NavbarInput";
import Icon from "@material-tailwind/react/Icon";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { logout, user, isLoading } = useContext(AuthContext);
  const [openNavbar, setOpenNavbar] = useState(false);
  const router = useRouter();

  if (!user) {
    return (
      <>
        <Navbar color="blue" navbar>
          <NavbarContainer>
            <NavbarWrapper>
              <NavbarBrand>HPC-BNUT</NavbarBrand>
              <NavbarToggler
                color="white"
                onClick={() => setOpenNavbar(!openNavbar)}
                ripple="light"
              />
            </NavbarWrapper>

            <NavbarCollapse open={openNavbar}>
              <Nav>
                <NavItem
                  active={router.pathname.includes("/faq") && "light"}
                  ripple="light"
                >
                  <Link href="/faq">FAQ</Link>
                </NavItem>
                <NavItem
                  active={router.pathname.includes("/plans") && "light"}
                  ripple="light"
                >
                  <Link href="/plans">Plans</Link>
                </NavItem>
                <NavItem
                  active={router.pathname.includes("/login") && "light"}
                  ripple="light"
                >
                  <Link href="/login">Login</Link>
                </NavItem>
                <NavItem
                  active={router.pathname.includes("/register") && "light"}
                  ripple="light"
                >
                  <Link href="/register">Register</Link>
                </NavItem>
              </Nav>
            </NavbarCollapse>
          </NavbarContainer>
        </Navbar>

        <div className="py-8 flex justify-center">{children}</div>
      </>
    );
  }
  console.log(user);

  return (
    <div>
      <Navbar color="blue" navbar>
        <NavbarContainer>
          <NavbarWrapper>
            <NavbarBrand>HPC-BNUT</NavbarBrand>
            <NavbarToggler
              color="white"
              onClick={() => setOpenNavbar(!openNavbar)}
              ripple="light"
            />
          </NavbarWrapper>

          <NavbarCollapse open={openNavbar}>
            <Nav>
              {(user.role == "DEVELOPER" || user.role == "ADMIN") && (
                <Link href="/admin">
                  <a href="">
                    <NavItem
                      active={router.pathname.includes("/admin") && "light"}
                      ripple="light"
                    >
                      Admin Panel
                    </NavItem>
                  </a>
                </Link>
              )}
              <Link href="/dashboard/profile">
                <a href="">
                  <NavItem
                    active={
                      router.pathname.includes("/dashboard/profile") && "light"
                    }
                    ripple="light"
                  >
                    {`Welcome ${user.firstName}`}
                  </NavItem>
                </a>
              </Link>
              <Link href="/dashboard">
                <a href="">
                  <NavItem
                    active={router.pathname.endsWith("/dashboard") && "light"}
                    ripple="light"
                  >
                    Dashboard
                  </NavItem>
                </a>
              </Link>
              <div className=" cursor-pointer" onClick={() => logout()}>
                <NavItem
                  active={router.pathname.includes("/register") && "light"}
                  ripple="light"
                >
                  Logout
                </NavItem>
              </div>
            </Nav>
          </NavbarCollapse>
        </NavbarContainer>
      </Navbar>

      <div className="py-8 flex justify-center">{children}</div>
    </div>
  );
}

import React from "react";
import { Header } from "../components/Header";
import { Outlet } from "react-router";
import { Footer } from "../components/Footer";

export const MainLayout = () => {
  return (
    <>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

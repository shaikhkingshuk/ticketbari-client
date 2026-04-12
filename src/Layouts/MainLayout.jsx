import React from "react";
import { Header } from "../components/Header";
import { Outlet } from "react-router";
import { Footer } from "../components/Footer";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-300 dark:bg-zinc-900">
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

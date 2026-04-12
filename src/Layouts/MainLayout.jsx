import React, { useEffect } from "react";
import { Header } from "../components/Header";
import { Outlet } from "react-router";
import { Footer } from "../components/Footer";
import Lenis from "@studio-freight/lenis";

export const MainLayout = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-300 dark:bg-zinc-900">
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

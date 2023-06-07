import { type WindowLocation } from "@reach/router";
import { Link } from "gatsby";
import React from "react";

export type Props = {
  children?: React.ReactNode;
  location: WindowLocation;
};

export default function ({ children, location }: Props) {
  const footer = React.useMemo(() => {
    if (location.pathname === "/") {
      return <>(c) 2023 Nanai10a</>;
    } else {
      return <Link to="/">Back to entry</Link>;
    }
  }, [location]);

  return (
    <main className="min-h-screen bg-stone-800 text-stone-200 flex flex-col justify-between">
      <header></header>
      {children ?? <></>}
      <footer className="h-12">
        <p className="w-fit mx-auto mt-4">{footer}</p>
      </footer>
    </main>
  );
}

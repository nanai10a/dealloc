import { type WindowLocation } from "@reach/router";
import { Link } from "gatsby";
import React from "react";

export type Props = {
  children?: React.ReactNode;
  className?: string;
  location: WindowLocation;
};

export default function ({ children, className, location }: Props) {
  const footer = React.useMemo(() => {
    if (location.pathname === "/") {
      return <>(c) 2023 Nanai10a</>;
    } else {
      return <Link to="/">Back to entry</Link>;
    }
  }, [location]);

  return (
    /* see https://experienceleague.adobe.com/docs/target/using/experiences/vec/mobile-viewports.html */
    <div className="min-w-[360px] min-h-screen x-centralize-col">
      <header></header>

      <main className={`grow ${className ?? ""}`}>{children ?? <></>}</main>

      <footer className="my-4">{footer}</footer>
    </div>
  );
}

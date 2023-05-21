import React from "react";

export type Props = {
  children?: React.ReactNode;
};

export default function ({ children }: Props) {
  return (
    <main className="min-h-screen p-8 bg-stone-800 text-stone-200">
      {children ?? <></>}
    </main>
  );
}

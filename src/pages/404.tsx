import type { HeadProps, PageProps } from "gatsby";
import Layout from "../components/Layout";
import React from "react";

const texts = [
  "in a wall...",
  "falling at sky!",
  "time is s l o w i  n  g",
  "`void {u}` ed!",
  "segmentation fault",
  "broken route",
  "",
];

export default function ({ location }: PageProps<{}>) {
  return (
    <Layout location={location}>
      <h1 className="text-6xl">
        {texts[Math.floor(Math.random() * texts.length)]}
      </h1>
      <p>status: 404</p>
    </Layout>
  );
}

export function Head({}: HeadProps<{}>) {
  return (
    <>
      <title>Not found - dealloc</title>
    </>
  );
}

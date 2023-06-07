import type { HeadProps, PageProps } from "gatsby";
import Layout from "../components/Layout";
import React from "react";

export default function ({ location }: PageProps<{}>) {
  return (
    <Layout location={location}>
      <p className="mx-auto">status: 404</p>
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

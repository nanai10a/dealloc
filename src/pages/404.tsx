import type { HeadProps, PageProps } from "gatsby";
import Layout from "../components/Layout";
import React from "react";

export default function ({ location }: PageProps<{}>) {
  return (
    <Layout className="x-centralize-col" location={location}>
      status: 404
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

import type { HeadProps, PageProps } from "gatsby";
import Layout from "../../components/Layout";
import React from "react";

import { graphql } from "gatsby";
export const pageQuery = graphql`
  query Arenas($id: String!) {
    markdownRemark(parent: { id: { eq: $id } }) {
      html
      frontmatter {
        ident
        traits
        captured(formatString: "YYYY-MM-DD")
        patched(formatString: "YYYY-MM-DD")
      }
    }
  }
`;

export function Head({ data }: HeadProps<Queries.ArenasQuery>) {
  return (
    <>
      <title>{data.markdownRemark?.frontmatter?.ident} - dealloc</title>
    </>
  );
}

export default function ({ data, location }: PageProps<Queries.ArenasQuery>) {
  const { html, frontmatter } = data.markdownRemark ?? {};
  const { ident, traits, captured, patched } = frontmatter ?? {};

  return (
    <Layout className="w-full max-w-xl" location={location}>
      <div className="px-4 mt-4">
        <h1 className="text-4xl">{ident}</h1>
        <p className="mt-2 text-sm">{traits?.join(", ")}</p>
        <div className="w-fit mt-2 text-sm">
          <p className="flex flex-row justify-between gap-2">
            <span>captured:</span>
            <span>{captured}</span>
          </p>
          <p className="flex flex-row justify-between gap-2">
            <span>patched:</span>
            <span>{patched}</span>
          </p>
        </div>
      </div>

      <hr className="my-4" />

      <div
        className="px-4 ctx-arena"
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
      />
    </Layout>
  );
}

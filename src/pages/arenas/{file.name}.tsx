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
    <Layout location={location}>
      <div className="max-w-4xl p-8 mx-auto border-2 border-stone-100 rounded-2xl">
        <div className="mb-4">
          <h1 className="text-4xl bold">{ident}</h1>
          <p>{traits?.join(", ")}</p>
          <p>{"captured: " + captured + ", patched: " + (patched ?? "no")}</p>
        </div>

        <div
          className="arena"
          dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
      </div>
    </Layout>
  );
}

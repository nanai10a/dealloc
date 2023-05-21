import Layout from "../../components/Layout";
import React from "react";

import { graphql } from "gatsby";
export const pageQuery = graphql`
  query ($id: String!) {
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

export type Props = {
  data: {
    markdownRemark: {
      html: string;
      frontmatter: {
        ident: string;
        traits: string[];
        captured: string;
        patched: string;
      };
    };
  };
};

export default function ({ data }: Props) {
  const {
    html,
    frontmatter: { ident, traits, captured, patched },
  } = data.markdownRemark;

  return (
    <Layout>
      <div className="max-w-4xl p-8 mx-auto border-2 border-stone-100 rounded-2xl">
        <div className="mb-4">
          <h1 className="text-4xl bold">{ident}</h1>
          <p>{traits.join(", ")}</p>
          <p>{"captured: " + captured + ", patched: " + (patched ?? "no")}</p>
        </div>
        <div className="arena" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Layout>
  );
}

import React from "react";

import { graphql } from "gatsby";

type Props = {
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
  const { html, frontmatter } = data.markdownRemark;

  return (
    <div>
      <div className="arena" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

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

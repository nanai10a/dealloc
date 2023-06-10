import { parse } from "node:path";

import {
  type CreateSchemaCustomizationArgs,
  type CreateNodeArgs,
  type SetFieldsOnGraphQLNodeTypeArgs,
  type Node,
} from "gatsby";

export const createSchemaCustomization = (
  args: CreateSchemaCustomizationArgs,
) => {
  args.actions.createTypes(`
    type Arena implements Node {
      ident: String!
      mangled: String!
      traits: [String!]!
      captured: Date! @dateformat
      patched: Date @dateformat
      body: String!
    }
  `);
};

type MarkdownRemark = Node & {
  excerpt?: string;
  fileAbsolutePath?: string;
  frontmatter?: Record<string, unknown>;
  rawMarkdownBody?: string;
};

export const onCreateNode = (args: CreateNodeArgs) => {
  if (args.node.internal.type !== "MarkdownRemark") {
    return;
  }

  const node = args.node as MarkdownRemark;

  if (node.frontmatter && "title" in node.frontmatter) {
    delete node.frontmatter.title;
  }

  const { name } = parse(node.fileAbsolutePath ?? "");

  const content = {
    ...node.frontmatter,
    mangled: name,
  };

  args.actions.createNode({
    ...content,
    id: args.createNodeId("arena:" + args.node.id),
    parent: args.node.id,
    internal: {
      type: "Arena",
      contentDigest: args.createContentDigest(content),
    },
  });
};

export const setFieldsOnGraphQLNodeType = (
  args: SetFieldsOnGraphQLNodeTypeArgs,
) => {
  if (args.type.name !== "Arena") {
    return;
  }

  return {
    body: {
      type: "String!",
      resolve: async ({ parent: id }, {}, { nodeModel }) => {
        const node = nodeModel.getNodeById({ id });
        const html = await nodeModel.getFieldValue(node, "html");

        return html;
      },
    },
  };
};

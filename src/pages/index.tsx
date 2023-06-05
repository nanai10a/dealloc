import { type HeadProps, type PageProps, Link } from "gatsby";
import Layout from "../components/Layout";
import u from "../utilities";
import React from "react";

import { graphql } from "gatsby";
export const pageQuery = graphql`
  query Index {
    allMarkdownRemark {
      nodes {
        frontmatter {
          ident
          traits
          captured(formatString: "YYYY-MM-DD")
          patched(formatString: "YYYY-MM-DD")
        }
        parent {
          ... on File {
            name
          }
        }
      }
    }
  }
`;

export default function ({ data, location }: PageProps<Queries.IndexQuery>) {
  const arenas = React.useMemo(() => {
    return data.allMarkdownRemark.nodes
      .filter((node) => node.frontmatter !== null && node.parent !== null)
      .map(({ frontmatter, parent }) => ({ ...frontmatter!, ...parent! }))
      .map((obj) => u.rename(obj, { mangled: "name" }));
  }, [data]);

  const traits = React.useMemo(() => {
    const map = arenas
      .flatMap(({ traits }) => traits ?? [])
      .filter((m): m is string => m !== null)
      .reduce<Record<string, number>>((map, next) => {
        map[next] = map[next] ? map[next] + 1 : 1;
        return map;
      }, {});

    return Object.entries(map).sort(([_0, lhs], [_1, rhs]) => lhs - rhs);
  }, [arenas]);

  const durations = React.useMemo(() => {
    const map = arenas
      .flatMap(({ captured, patched }) => ({ captured, patched }))
      .filter(
        (o): o is { captured: string; patched: string } =>
          typeof o.captured === "string" && typeof o.patched === "string",
      )
      .map(({ captured, patched }) => [
        captured.substring(0, 7),
        patched.substring(0, 7),
      ])
      .reduce<Record<string, number>>((map, [c, p]) => {
        map[c] = map[c] ? map[c] + 1 : 1;
        map[p] = map[p] ? map[p] + 1 : 1;
        return map;
      }, {});

    return Object.entries(map).sort(
      ([lhs, _0], [rhs, _1]) =>
        Number(lhs.replaceAll("-", "")) - Number(rhs.replaceAll("-", "")),
    );
  }, [arenas]);

  return (
    <Layout location={location}>
      <div className="px-4 pt-2">
        <h1 className="text-4xl">dealloc</h1>
        <p className="truncate">
          de-allocated of feelings, thinkings, knowledges, etc
        </p>
      </div>

      <hr className="my-4" />

      <h2 className="px-4 text-4xl">latests</h2>
      <pre className="my-4 p-4 bg-stone-700 text-stone-100">
        <code>
          <ul>
            {arenas.map(({ mangled, ident, traits, captured, patched }) => (
              <li className="my-4 first:mt-0 last:mb-0 border">
                <Link className="block w-full p-4" to={`/arenas/${mangled}`}>
                  <p>"{ident}"</p>
                  <p className="ml-4">::{mangled ?? "{unresolved}"}</p>
                  <p className="ml-8">: {traits?.join(", ")}</p>
                  <p>
                    c/p: {captured} / {patched ?? "no"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </code>
      </pre>

      <h2 className="px-4 text-4xl">traits</h2>
      <pre className="my-4 p-4 bg-stone-700 text-stone-100">
        <code className="w-fit grid grid-cols-2 gap-x-4">
          {traits.map(([name, amount]) => (
            <>
              <Link className="before:content-['-_']" to={`/traits/${name}`}>
                {name}
              </Link>
              <span>({amount})</span>
            </>
          ))}
        </code>
      </pre>

      <h2 className="px-4 text-4xl">durations</h2>
      <pre className="mt-4 p-4 bg-stone-700 text-stone-100">
        <code className="w-fit grid grid-cols-2 gap-x-4">
          {durations.map(([date, amount]) => (
            <>
              <Link className="before:content-['-_']" to={`/date/${date}`}>
                {date}
              </Link>
              <span>({amount})</span>
            </>
          ))}
        </code>
      </pre>
    </Layout>
  );
}

export function Head({}: HeadProps<Queries.IndexQuery>) {
  return (
    <>
      <title>Entry Page - dealloc</title>
    </>
  );
}

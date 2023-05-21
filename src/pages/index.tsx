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

export default function ({ data }: PageProps<Queries.IndexQuery>) {
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
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl">dealloc</h1>
        <p>--- de-allocated of feelings, thinkings, knowledges, etc</p>
        <hr className="mt-2" />
      </div>

      <h2 className="text-4xl">latests</h2>
      <pre className="my-8 p-8 bg-stone-700 text-stone-100">
        <code>
          {arenas.map(({ mangled, ident, traits, captured, patched }) => (
            <>
              <div className="flex flex-row">
                {"- "}
                <p>
                  <Link to={mangled ? `/arenas/${mangled}` : "/404"}>
                    "{ident}" (::{mangled ?? "{unresolved}"})
                  </Link>
                  <p>{traits?.join(", ")}</p>
                  <p>
                    captured: {captured}, patched: {patched ?? "no"}
                  </p>
                </p>
              </div>
              <br className="last:hidden" />
            </>
          ))}
        </code>
      </pre>

      <h2 className="text-4xl">traits</h2>
      <pre className="my-8 p-8 bg-stone-700 text-stone-100">
        <code>
          {traits.map(([name, amount]) => (
            <p>
              {"- "}
              <Link to={`/traits/${name}`}>
                {name} ({amount})
              </Link>
            </p>
          ))}
        </code>
      </pre>

      <h2 className="text-4xl">durations</h2>
      <pre className="my-8 p-8 bg-stone-700 text-stone-100">
        <code>
          {durations.map(([date, amount]) => (
            <p>
              {"- "}
              <Link to={`/date/${date}`}>
                {date} ({amount})
              </Link>
            </p>
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

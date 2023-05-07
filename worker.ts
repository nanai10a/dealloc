// <reference no-default-lib="true" />
// <reference lib="webworker" />

import { Buffer } from "node:buffer";

import { Hono } from "hono";
import MarkdownIt from "markdown-it";
import YAML from "yaml";
import { z } from "zod";

type Bindings = {
  ARENAS_REPO: string;
  ARENAS_TOKEN: string;
};

const ghContent = async (env: Bindings, path: string) => {
  const BASE = "https://api.github.com/repos/";
  const url = new URL(env.ARENAS_REPO + "/contents/" + path, BASE);

  return fetch(url, {
    headers: {
      "Accept": "application/vnd.github.raw",
      "Authorization": `Bearer ${env.ARENAS_TOKEN}`,
    },
  }).then((res) => res.text());
};

const renderMD = (src: string) => {
  const [front, yaml] = src.match(/^---\n(.*)\n---/s) ?? [];
  src = src.replace(front ?? "", "").trim();

  const meta = z.object({
    ident: z.string(),
    traits: z.string().array(),
    captured: z.date({ coerce: true }),
    patched: z.date({ coerce: true }).nullable(),
  }).parse(YAML.parse(yaml));

  const hidden: string[] = [];

  const it = new MarkdownIt();
  const defaults = {
    text: it.renderer.rules.text!,
  };

  it.renderer.rules.text = (tokens, idx, options, env, self) => {
    let html = defaults.text(tokens, idx, options, env, self);

    let rema: RegExpMatchArray | null;
    while (rema = /\|\|(.*?)\|\|/.exec(html)) {
      const [captured, content] = rema;

      hidden.push(content);
      const index = hidden.length - 1;

      html = html.replace(captured, `<x-hidden index="${index}"></x-hidden>`);
    }

    return html;
  };

  const body = it.render(src);

  return { body, meta, hidden };
};

const hono = new Hono<{ Bindings: Bindings }>();

hono.on("GET", "/arenas/:mangled", async (ctx) => {
  const { mangled } = ctx.req.param();
  const md = await ghContent(ctx.env, "arenas/" + mangled + ".md");
  const { body, meta, hidden } = renderMD(md);

  const json = JSON.stringify(meta);
  ctx.header("x-arena-meta", Buffer.from(json).toString("base64"));
  ctx.header("x-arena-hidden", hidden.length.toString());

  return ctx.text(body);
});

export default hono;

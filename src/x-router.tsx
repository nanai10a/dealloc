import css from "./global.css?inline";

import { JwcComponent, Component, Prop, h, Fragment } from "jwcjs";

type FC = (
  params: Record<string, string>,
  access: ((k: string) => unknown) & ((k: string, v: unknown) => void)
) => unknown;

const ROUTES: [string, FC][] = [
  ["/arenas", ({}) => <></>],
  [
    "/arenas/(?<mangled>[^/]+)",
    ({ mangled }, access) => {
      const arena = access("arena");
      if (!arena) {
        fetch("https://testing.nanai10a.workers.dev")
          .then((res) => res.text())
          .then((txt) => access("arena", txt));

        return <>Pending...</>;
      }

      return <>{arena}</>;
    },
  ],
];

@Component({ name: "x-router", css })
export default class extends JwcComponent {
  @Prop({ default: {} }) store: Record<string, Record<string, unknown>>;

  override render() {
    const pathname = location.pathname.replace(/\/+/g, "/").replace(/\/$/, "");
    history.replaceState(null, "", pathname);

    for (const [idx, [pattern, fn]] of Object.entries(ROUTES)) {
      const reea = new RegExp("^" + pattern + "$").exec(location.pathname);
      if (!reea) continue;

      this.store[idx] = {};

      return fn(reea.groups, (k: string, v: unknown) => {
        if (v !== undefined) {
          this.store[idx][k] = v;
        }

        return this.store[idx][k];
      });
    }

    return (
      <div class="h-screen flex justify-center">
        <p class="my-auto text-2xl">Not Found</p>
      </div>
    );
  }
}

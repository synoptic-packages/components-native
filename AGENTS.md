# components-native — @synotech/components-native

Shared **native** component library (Expo / React Native) published from this
repo and installed by all three production tenants:

| Consumer                     | Pin       |
| ---------------------------- | --------- |
| `synoptic-vya/mobile`        | **5.1.2** |
| `synoptic-ventry/mobile`     | **5.0.3** |
| `synoptic-krugergold/mobile` | **5.0.3** |

## ⚑ The skew is real and already live

vya runs 5.1.2 while ventry and krugergold run 5.0.3, and all three are **exact
pins**. Two consequences that decide how you work here:

- **"I published it" is not "the tenant is fixed".** If a tenant still shows the
  bug in production, check the version it actually pins **before** assuming this
  tree is at fault. The fix may simply not be in the version they install.
- **A fix for ventry or krugergold is either a bump or a backport.** If the
  change can only exist on 5.1.x, say so explicitly and name who must bump;
  otherwise decide with the owner whether it is backported to 5.0.x.

`@synotech/components` (web) is the counterpart. A change here usually needs a
counterpart there, and the reverse; one platform passing is not parity.

## Rules for a published package

1. **A published version is permanent, and not everyone is on it.** Never
   require all consumers to bump together.
2. **Every publish reaches production for someone.** Exact pins here mean the
   arrival is deliberate, but treat every publish as reaching production.
3. **Never bake a tenant's name, path, key, or brand into this package.**
   Tenant specifics are passed in as props or config.
4. **Verification is Storybook (17 stories) plus 4 unit tests plus the
   consuming app** — this package is thin on tests, so a green run is weak
   evidence on its own.
5. **Platform-parity changes need both packages** in the same conversation,
   with the version each consumer will get.

## Doctrine

The binding multi-tenant doctrine, the tenant invariant registry, and the
shared-vs-duplicated map live in `~/stack/synoptic-core/AGENTS.md`
("Shared-Logic Invariant"). Read it before changing behaviour that consumers
depend on.

## Formatting (estate standard)

- Prettier is `{ useTabs: true, singleQuote: true, semi: false, printWidth: 120, trailingComma: "all" }` (tabs, indent width 4 via `.editorconfig`). Values live in `.prettierrc` or the `prettier` key in `package.json` per repo (one mechanism, same values). Do not restyle it.
- Husky pre-commit runs `lint-staged`. Manual: `yarn format` / `yarn format:check` (`npm run` where npm-managed).
- `.editorconfig` at the repo root is authoritative for indent/line-endings. Do not add competing indent rules.

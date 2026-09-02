import { existsSync } from "node:fs";

// The development server runs TypeScript directly. Its source uses NodeNext-style
// `.js` specifiers, so map a local specifier to its TypeScript source counterpart.
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && specifier.endsWith(".js")) {
    const tsSpecifier = `${specifier.slice(0, -3)}.ts`;
    if (existsSync(new URL(tsSpecifier, context.parentURL))) {
      return nextResolve(tsSpecifier, context);
    }
  }
  return nextResolve(specifier, context);
}

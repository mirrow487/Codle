#!/usr/bin/env bash
# Downloads the Pyodide core runtime (~14 MB) into js/vendor/pyodide/ so Python
# runs without a CDN. Optional: without it, Codle loads Pyodide from jsDelivr.
set -euo pipefail
VERSION="${PYODIDE_VERSION:-0.26.4}"
cd "$(dirname "$0")/.."
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
(cd "$tmp" && npm pack "pyodide@${VERSION}" --silent >/dev/null && tar -xzf pyodide-*.tgz)
mkdir -p js/vendor/pyodide
for f in pyodide.js pyodide.asm.js pyodide.asm.wasm python_stdlib.zip pyodide-lock.json; do
  cp "$tmp/package/$f" js/vendor/pyodide/
done
echo "Pyodide ${VERSION} copied to js/vendor/pyodide/"

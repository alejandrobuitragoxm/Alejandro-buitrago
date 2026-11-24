#!/bin/zsh
# Actualiza el grafo de graphify (AST, sin LLM) y lo abre en el navegador.
cd "$(dirname "$0")"
"$HOME/.local/bin/graphify" update . && open graphify-out/graph.html

#!/usr/bin/env bash
# Loads seed/nordgold-conakry-NN.json one block at a time (blocks 01-07: 1,500 parts; 08-15: 1,000 parts or fewer).
# Safe to stop and re-run: seed-nordgold.ts skips parts that already exist.
#
#   scripts/load-nordgold-blocks.sh            # all blocks
#   scripts/load-nordgold-blocks.sh 03 04      # only these blocks
#
# Point it at a database with DATABASE_URL (and REDIS_URL= to skip Redis).
set -euo pipefail
cd "$(dirname "$0")/.."

blocks=("$@")
if [ ${#blocks[@]} -eq 0 ]; then
  for f in seed/nordgold-conakry-*.json; do
    n="${f##*-}"; blocks+=("${n%.json}")
  done
fi

for n in "${blocks[@]}"; do
  echo "=== block $n ($(date +%H:%M:%S)) ==="
  NORDGOLD_FILE="seed/nordgold-conakry-$n.json" npx medusa exec ./src/scripts/seed-nordgold.ts 2>&1 \
    | grep -E "Nordgold:|already present|already existed|Finished|error|Error" || true
done
echo "All requested blocks done."

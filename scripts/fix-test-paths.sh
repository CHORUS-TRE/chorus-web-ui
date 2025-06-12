#!/bin/bash

# This script finds all test files and replaces absolute imports (@/) with relative imports
# Run this script from the root of the project

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting to fix test import paths...${NC}"

# Find all test files
TEST_FILES=$(find __tests__ src -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx")

# Counter for modified files
MODIFIED_COUNT=0

for file in $TEST_FILES; do
    # Check if file contains @/ imports
    if grep -q "@/" "$file"; then
        echo -e "${GREEN}Processing $file...${NC}"

        # Get the directory depth
        dir_count=$(echo "$file" | tr '/' '\n' | wc -l)
        relative_path=""

        # Calculate the relative path prefix based on directory depth
        for ((i=1; i<dir_count; i++)); do
            relative_path="../$relative_path"
        done

        # Replace @/ with the calculated relative path to src
        sed -i.bak "s|from '@/|from '$relative_path\src/|g" "$file"
        sed -i.bak "s|import '@/|import '$relative_path\src/|g" "$file"

        # Clean up backup files
        rm "$file.bak"

        # Use a different import style for type assertions
        # Replace 'as const' and 'as any' with Object.freeze and Object.assign
        sed -i.bak "s/} as const/})/" "$file"
        sed -i.bak "s/} as any/})/" "$file"

        # Add Object.freeze before const declarations with as const
        sed -i.bak "s/const \([A-Za-z0-9_]*\) = {/const \1 = Object.freeze({/g" "$file"

        # Add Object.assign before const declarations with as any
        sed -i.bak "s/const \([A-Za-z0-9_]*\) = {/const \1 = Object.assign({/g" "$file"

        # Clean up backup files again
        rm "$file.bak"

        ((MODIFIED_COUNT++))
    fi
done

echo -e "${GREEN}Modified $MODIFIED_COUNT test files.${NC}"
echo -e "${YELLOW}Remember to check the changes and run tests to ensure everything works correctly.${NC}"

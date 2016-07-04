#!/usr/bin/env bash

# check only staged files in pre-commit hook

modified_files=$( (git diff --name-only --diff-filter=ACM --ignore-submodules --cached) | grep -i '\.js$')

if [[ -n "$modified_files" ]]
then
    eslint ${modified_files}
else
    echo "There is no staged js files."
fi

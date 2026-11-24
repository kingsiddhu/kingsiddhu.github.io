#!/bin/sh
set -eu

export GIT_TERMINAL_PROMPT=0
cd "${1:?Pass the absolute path to the live website checkout}"

prefix=$(git rev-parse --show-prefix)
branch=$(git symbolic-ref --quiet --short HEAD) || branch=''
if [ -n "$prefix" ] || [ "$branch" != main ]; then
    printf '%s\n' 'Deployment requires the root of the live checkout on branch main.' >&2
    exit 1
fi

changes=$(git status --porcelain --untracked-files=no)
if [ -n "$changes" ]; then
    printf '%s\n' 'The live checkout has local changes to tracked files.' >&2
    exit 1
fi

git fetch --no-tags origin refs/heads/main
target=$(git rev-parse --verify FETCH_HEAD)
if ! git merge-base --is-ancestor HEAD "$target"; then
    printf '%s\n' 'The live checkout is ahead of or has diverged from origin/main.' >&2
    exit 1
fi

git merge --ff-only "$target"
printf 'Website deployed at %s\n' "$(git rev-parse HEAD)"

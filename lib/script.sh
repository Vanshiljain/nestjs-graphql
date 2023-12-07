#!/bin/bash

echo 'Running Script'

# List the contents of the project directory


# Run 'act -l'


# Open Docker
start Docker

# Run 'act -b' (or 'act -j build')
# Run 'act -j run-lint --verbose'
# "$HOME\\scoop\\apps\\act\\current\\act.exe" -j build --verbose
act -l
act -j build -v

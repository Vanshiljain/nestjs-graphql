#!/bin/bash

echo 'Running Script'

# Assuming $the_path is a variable you want to use
ls C:/Users/LENOVO/Downloads/nestjs-graphql-main(4)/nestjs-graphql

# Change directory to 'newsApp'
cd  C:/Users/LENOVO/Downloads/nestjs-graphql-main(4)/nestjs-graphql/newsApp

# Run 'act -l'
act -l

# Open Docker
open -a Docker

# Run 'act -j run-lint'
act -j run-lint

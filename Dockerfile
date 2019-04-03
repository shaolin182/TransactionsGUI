# From NodeJS Version 10
FROM nginx:latest as base

# Copy build folder
COPY dist /usr/share/nginx/html

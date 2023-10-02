
# Dockerfile reference:
# https://docs.docker.com/engine/reference/builder/

# docker build --rm -f Dockerfile -t frontend:latest .


# "Deployment" mode:
# docker run --rm -d -p 80:80 frontend:latest
# https://hub.docker.com/_/nginx/
#FROM nginx:stable
#RUN npm run build
#COPY ./dist /var/www
#COPY nginx.conf /etc/nginx/nginx.conf
#EXPOSE 80
#CMD ["nginx", "-g","daemon off;"]


# 'Development' mode:
# docker run --rm -d -p 80:3000 frontend:latest
FROM node:latest
WORKDIR /usr/src/koodikukkaro
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]


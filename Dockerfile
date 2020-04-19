FROM node:10-alpine as builder

COPY package.json package-lock.json ./

RUN npm install && mkdir /app-ui && mv ./node_modules ./app-ui

WORKDIR /app-ui

COPY . .

RUN npm run ng build --prod
#RUN npm run ng build -- --base-href /cinema/ --prod


FROM nginx:alpine

#!/bin/sh

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app-ui/dist /usr/share/nginx/html
#COPY --from=builder /app-ui/dist /etc/nginx/html

EXPOSE 4200 80

#CMD ["nginx", "-g", "daemon off;"]
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'

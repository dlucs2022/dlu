FROM node:16.18.0
WORKDIR /home/node/
ADD . .
# 高版本node需要添加下面被注释的语句
# ENV NODE_OPTIONS="--openssl-legacy-provider"
RUN ["npm", "config", "set", "registry", "http://registry.npm.taobao.org"]
RUN ["npm", "install"]
RUN ["npm", "run", "build"]


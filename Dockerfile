FROM node:6

MAINTAINER Mulesfot

EXPOSE 3000

#Add all repo
ADD . /root

# change workdir usage
WORKDIR /root

# Install node dependencies
RUN npm install

# Start the app as procees running (if dead docker also stop)
ENTRYPOINT npm start
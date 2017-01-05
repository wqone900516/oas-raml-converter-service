FROM node:6

MAINTAINER Mulesfot

EXPOSE 3000

#Add all repo
ADD . /root

# Install node dependencies
RUN npm install

# review workdir usage 
WORKDIR /root

# Start the app as procees running (if dead docker also stop)
ENTRYPOINT npm start
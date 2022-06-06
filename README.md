# Let's Chat

## Project URL

https://easy-chat.me/

## Project Video URL

https://youtu.be/ff5PuxdJXCE

## Project Description

Because of the global pandemic, people are getting used to communicating and socilizing online.

So, for the project, we would like to build an online chatting app that has similar functionality compared to web applications such as Whats App, Wechat. Users will have access to all users so that they can send direct message everyone if needed. At the same time we will add additional features such as
creating chat rooms (in the form of video) between 2 users, so that people can have a virtual meeting with their friends.

In this way, people can connect with their friends and relatives in such an easy way, without worrying
about the pandemic.

## Development

Our application is mainly based on React, Apollo GraphQL and Mysql. Javascript is
the language we used for both frontend and backend.

For the frontend (inside frontend folder), we use react to create the basic app and build features and functionalities on that. We find "react-bootstrap" is helpful when it comes to the UI design, so that is the
main library we use for style. "react-router-dom" library is imported for routing, and
we add a DynamicRoute.js in the src/util, so that authentication is satisfied and user is redirected
dynamically based on their status. When it comes to users and messages, the Context feature
of react plays an important role, so that we can use and set those information globally.
For video, we used a third party api called peerjs.

For the connection between frontend and backend, we used Apollo client, which is ideal for
connecting the apollo backend server. Inside the ApolloProvider.js file, we tell frontend
which url to connect. And we used split link to connect web socket and normal http backend url.

For the Backend (in the root folder), in order to connect with MySQL database,
we used sequelize (also help with database migration using migrations folder).
Apollo Server help us using the GraphQL for data exchange. By using the typeDefs and
resolvers (inside the graphql folder), and connect db with the help of sequelize through
requiring models folder, we construct a apollo server to communicate with the apollo client
in the frontend. Also, we used contextMiddleware in the util folder we created to manage
token in the request header, so that only authenticated user can do some operations.

## Deployment

We deploy frontend and backend using different web hosts.

For frontend we used Netlify. By connecting our front end github repo, and setting the
connection url to our depoyed backend, we can easily deploy our frontend. Also,
with github edu, we get a domain name from name cheap for free. By setting the
DNS to the netlify server, our app got an domain of easy-chat.me. Netlify also gives
free SSL certificate. The \_redirects file is for netlify.

For backend, we used heroku instead, so that our backend is not serverless.
By create another git repo for heroku app repo and push the backend code, our backend
is available on https://chat-app-apollo.herokuapp.com/. Then, we used heroku add-on
feature clearDB as the mySQL database, so that our backend is connected to
the database, ready for the data exchange at https://chat-app-apollo.herokuapp.com/.

## Maintenance

We did a complete test for the deployed app for all the features and functionalities.

What's more. We have an Easy Chat Robot accout, so that everyone can send messages to that robot if they find any problems or issues. As developer, we can log in to that account, and check the user feedbacks.

## Challenges

1. Deployment of an app with backend and database
2. Apollo GraphQL Server and Client
3. Real Time Video Feature

## Contributions

Jiale Yu: Setting up Environment, Login and Register backend api, Login and Register pages,
messages list, users list, Video function of the website, Demo video.

Zhenye Zhu: Users search bar, user authentication, dynamic router, sending messages box,
receiving messages in real time with web socket, message backend api, deployment.

# One more thing?

For contributions, it doesn't mean that the parts are completely implemented by only one person.
Both of us have some contributions to every features and functionalities (we discuss before implementaion),
and we just put features and functionalitied to the team member who writing the most code.

# Social-Medium-New

# Connect to MongoDB

```
MONGO_URL = mongodb://localhost:27017
MONGO_URL = mongodb+srv://ee547:XGhH1KuAj1c00ooB@cluster0.knprx.mongodb.net/EE547DB?
retryWrites=true&w=majority
MONGO_URL =mongodb+srv://ee547:9Ab6PI0fAZPUEO9i@cluster0.u7n1k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

1. Log out, the switch between log in and register
   related files:

- client/src
  - pages
    - login/Login.jsx
    - register/Register.jsx
  - context
    - AuthActions.js
    - AuthReducer.js
  - components
    - topbar/Topbar.jsx
  - App.js

2. change Post schema, add two api update a post and comment a post
   related files:

- server
  - models
    - Post.js
  - routes
    - posts.js

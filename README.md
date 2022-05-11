# Social-Medium-New

# Connect to MongoDB

```
MONGO_URL = mongodb://localhost:27017
MONGO_URL = mongodb+srv://ee547:XGhH1KuAj1c00ooB@cluster0.knprx.mongodb.net/EE547DB?retryWrites=true&w=majority
```

# For deployment

change the url like http:localhost:8800 to a fixed aws url

```bash
# for api and socker:
docker build -t 'your_iamge_name:tag' ./api
docker build -t 'your_iamge_name:tag' ./chat

# for app:
cd client
yarn install
yarn build
cd ..
mv client/build app
cd app
docker build -t 'your_iamge_name:tag' .
```

```
http://app-env-v6.eba-p8pgx2ip.us-west-2.elasticbeanstalk.com/
```

# Major File

## api

backend code

- models: moogle database schema
- public/image: manage the picture storage of this platform
- remote-docker: docker set up file
- routes: the routes of different API
- .env: need to add backend data base link, you could create your own database on https://www.mongodb.com/zh-cn/cloud/atlas/efficiency or you could directly use:

```

MONGO_URL = mongodb://localhost:27017
MONGO_URL = mongodb+srv://ee547:XGhH1KuAj1c00ooB@cluster0.knprx.mongodb.net/EE547DB?retryWrites=true&w=majority

```

- index.js: set up and execute the backend server on port 8800
- Dockerfile: the step of deployment

## client

### public:

- manage the picture storage of this platform
- src:

```

```

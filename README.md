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
 

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
docker build -t 'docker-id/your_repository_name_for_api:tag' ./api
docker build -t 'docker-id/your_repository_name_for_socket:tag' ./socket

# for app:
cd client
yarn install
yarn build
cd ..
mv client/build app
cd app
docker build -t 'docker-id/your_repository_name_for_app:tag' .

docker push 'docker-id/your_repository_name_for_api:tag'
eb init -p docker application-name-for-api
eb create enviroment-name-for-api

docker push 'docker-id/your_repository_name_for_socket:tag'
eb init -p docker application-name-for-socket
eb create enviroment-name-for-socket

docker push 'docker-id/your_repository_name_for_app:tag'
eb init -p docker application-name-for-app
eb create enviroment-name-for-app


```

```
http://app-env-v6.eba-p8pgx2ip.us-west-2.elasticbeanstalk.com/
```
 

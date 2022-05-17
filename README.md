# BACKEND-DEV-CHALLENGE

AUTOR: **Vladimir Castañeda**

## Local run

```bash
docker-compose up
```

After the containers are up (app and mongo), you can access the api documentation: [http://localhost:8081/api/docs](http://localhost:8081/api/docs)

Inside the postman directory there are 2 files containing the variables and requests to the api. These files can be uploaded to the postman app.

## Api in AWS EC2 

This api is deployed on an aws EC2 machine, it can be accessed at the following url: [http://3.85.32.240:8081/api/docs](http://3.85.32.240:8081/api/docs)

### IMPORTANT!

When doing the integration tests, the api gave these 2 messages as a response:

by https
```
{
  "data": {
    "success": false,
    "error": {
      "code": 105,
      "type": "https_access_restricted",
      "info": "Access Restricted - Your current Subscription Plan does not support HTTPS Encryption."
    }
  }
}
```

by http
```
{
  "data": {
    "success": false,
    "error": {
      "code": 105,
      "type": "function_access_restricted",
      "info": "Access Restricted - Your current Subscription Plan does not support this API Function."
    }
  }
}
```

To solve this problem and have the api deliver a USD->ARS and ARS->USD flow, you have to make this request:

```
curl --location --request GET 'http://localhost:8081/api/health?cache=true' \
--header 'accept: application/json'
```

This creates 2 cache records that will last 10 minutes and the requests will take that data (1 USD -> 200 ARS / 1 ARS -> 0.004879 USD) and do the calculations corresponding to the requests (USD->ARS and ARS ->USD) .
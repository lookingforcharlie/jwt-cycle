# jwt-lifecycle: using localStorage

- token is signed by jwt using payload and jwt-key

- Endpoint of '/token': generate token in the backend and send it back user (didn't use cookie)

- Client puts token in the req.header as key value pair of 'Authorization' and 'Bearer token'

- When server receives token, it will jwt.verify(token, jwt-key) to check the legitimacy of token

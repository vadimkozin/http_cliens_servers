###Homework "Create clients and servers using the http module".

used:
```bash
    node server
```
##Check:
```bash
    node client --firstName=Ivan --lastName=Petrov
    curl "http://localhost:3000/?firstName=Mark&lastName=Tomilo"
    curl --data "firstName=Mark&lastName=Tomilo" "http://localhost:3000"
```

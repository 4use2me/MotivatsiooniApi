Quotes api for registering quotes wich users may own. 

please see below for instructions on how to run, and where its api and trello team resources are

How to run:
- Open terminal in backend folder
-Use nodemon . to run backend

team resources:  
https://studio.apicur.io/apis/112835/editor
https://trello.com/b/aU24qeUS/motivatsiooniapi

post: xh -v http://localhost:8080/quotes ID=4 Quote="kolmas tsitaat" Date="24.11.2024" UserID=1 Likes=1
put: xh -v PUT http://localhost:8080/quotes/4 Quote="neljas tsitaat" Date="24.11.2024" UserID=1 Likes=2
delete: xh -v DELETE http://localhost:8080/quotes/3
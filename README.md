Quotes api for registering quotes wich users may own. 

please see below for instructions on how to run, and where its api and trello team resources are

How to run:
- Clone repository
- Open terminal in project general folder
- Run command npm i  or npm install
- Use command npm start to run backend and frontend simoultaneously 


team resources:  
https://studio.apicur.io/apis/112835/editor
https://trello.com/b/aU24qeUS/motivatsiooniapi

post: xh -v http://localhost:8080/motivations ID=4 Quote="kolmas tsitaat" UserID=1 Likes=1
put: xh -v PUT http://localhost:8080/motivations/4 Quote="neljas tsitaat" UserID=1 Likes=2
delete: xh -v DELETE http://localhost:8080/motivations/3
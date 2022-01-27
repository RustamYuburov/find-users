# Сервис по поиску людей

 Сервис, считывающий список пользователей с (https://reqres.in/api/users) и загружающий их в собственную БД (MongoDB) (при работе с БД желательно не использовать ORM (Object-Relational Mapping)). Разработан интерфейс поиска пользователей по имени и/или фамилии. БД пользователей обновляется раз в минуту. Сервис разработан на Node.js, интерфейс - React.

 ### Инструкция по установке и запуску

 ```bash
git clone https://github.com/RustamYuburov/find-users
```

Сервер

 ```bash
cd find-users
npm install
npm run start
```
Интерфейс

 ```bash
cd client
npm install
npm start
Вбить в браузер http://localhost:3000 и протестировать
```

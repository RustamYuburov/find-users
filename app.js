const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let db;
let connectionString = `mongodb+srv://magma:1234finduser@cluster0.tolbf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    db = client.db('test');
    app.listen(3030, () => {
      console.log('Server is running...');
    });
    addDataToMongo();
  }
);

async function addDataToMongo() {
  try {
    const res = await Promise.all([
      axios.get('https://reqres.in/api/users?page=1'),
      axios.get('https://reqres.in/api/users?page=2'),
    ]);

    const people = res.map((res) => res.data.data).flat();
    let apiPeopleData = people.map((person) => {
      const { email, first_name, last_name, avatar } = person;
      return { email, first_name, last_name, avatar };
    });

    apiPeopleData.forEach((person) => {
      db.collection('Users').update(
        { email: person.email },
        { $setOnInsert: person },
        { upsert: true },
        function (err, result) {
          if (err) {
            console.log('Error occured with mongodb');
          }
        }
      );
    });
    console.log('Database updated');
  } catch {
    throw Error('Axios did not work');
  }
}

setInterval(addDataToMongo, 60000);

app.post('/', function (req, res) {
  const inputInfo = req.body.input;
  const filteredPersonInfo = inputInfo
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.split('').slice(1).join(''));

  if (filteredPersonInfo.length === 2) {
    db.collection('Users').findOne(
      { first_name: filteredPersonInfo[0], last_name: filteredPersonInfo[1] },
      function (err, info) {
        res.json(info);
      }
    );
  } else {
    db.collection('Users').findOne(
      { $or: [{ first_name: filteredPersonInfo[0] }, { last_name: filteredPersonInfo[0] }] },
      function (err, info) {
        res.json(info);
      }
    );
  }
});

app.get('*', (req, res) => {
  res.redirect('http://localhost:3000/');
});

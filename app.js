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
    axios.get('https://reqres.in/api/users').then((res) => {
      const people = res.data.data;
      let apiPeopleData = people.map((person) => {
        const { email, first_name, last_name, avatar } = person;
        return { email, first_name, last_name, avatar };
      });
      db.collection('Users').deleteMany({}, function (err, info) {
        console.log('Collection deleted');
      });
      db.collection('Users').insertMany(apiPeopleData, function (err, info) {
        console.log('Collection inserted');
      });

      // Альтернативное решение как обновлять базу MongoDB
      // (async function () {
      //   try {
      //     const peopleFromMongodb = await db.collection('Users').find({}).toArray();
      //     const mongoPeopleEmail = peopleFromMongodb.map(person => person.email);
      //     const arrayOfNewPeople = [];
      //     for (let person of apiPeopleData) {
      //       if (mongoPeopleEmail.indexOf(person.email) === -1) {
      //         arrayOfNewPeople.push(person);
      //       }
      //     }
      //     console.log(arrayOfNewPeople);
      //     if (arrayOfNewPeople.length) {
      //       db.collection('Users').insertMany(arrayOfNewPeople, function (err, info) {
      //           console.log('Collection inserted');
      //         })
      //     }
      //   } catch (err) {
      //     console.log('Error with mongo database');
      //   }
      // })();

    });
  } catch (err) {
    throw Error('Axios get did not work');
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
})

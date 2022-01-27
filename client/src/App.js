import './App.css';
import { useState } from 'react';
import Axios from 'axios';

function App() {
  const [input, setInput] = useState(undefined);
  const [person, setPerson] = useState(undefined);

  const findPerson = () => {
    Axios.post('http://localhost:3030/', { input })
      .then((res) => {
        console.log(res);
        setPerson(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let renderPersonInfo;
  if (person === null) {
    renderPersonInfo = (
      <div className="not-found">
        <h1>К сожалению человек не найден(</h1>
        <img
          src="https://cdn-icons.flaticon.com/png/512/1895/premium/1895100.png?token=exp=1643283427~hmac=d6c19f14f4802dca5b518b49da07cb45"
          alt="not found"
        />
      </div>
    );
  } else if (person) {
    renderPersonInfo = (
      <div className="person">
        <div className="person-image">
          <img src={person.avatar} alt="person" />
        </div>
        <div className="person-credentials">
          <h1>Имя: {person.first_name}</h1>
          <h1>Фамилия: {person.last_name}</h1>
          <h1>Email: {person.email}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="logo-name">Сервис по поиску людей</h1>

      <div className="form">
        <label className="input-label" htmlFor="input">
          Введитте имя и/или фамилию
        </label>
        <input
          type="text"
          placeholder="sont"
          onChange={(e) => {
            setInput(e.target.value);
          }}
        ></input>
        <button onClick={findPerson}>Найти человека</button>
      </div>

      <div className="person-info">{renderPersonInfo}</div>
    </div>
  );
}

export default App;

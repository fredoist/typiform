import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

function Form(params) {
  const [formData, setFormData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Basic " + import.meta.env.VITE_HARPERDB_TOKEN
    );

    var raw = JSON.stringify({
      operation: "sql",
      sql: `SELECT * FROM test.forms WHERE id = '${id}'`,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_HARPERDB_URL, requestOptions)
      .then((response) => response.text())
      .then((result) => setFormData(JSON.parse(result)))
      .catch((error) => console.error("error", error));
  }, []);

  if(formData.length === 0) {
    return "Loading..."
  }

  return (
    <div>
      <h1>{formData[0].title}</h1>
      {formData[0].blocks.map((block) => (
        <div key={block.id}>
          {block.type === "text_block" && <p>{block.placeholder}</p>}
          {block.type === "short_answer" && (
            <input
              type="text"
              name={block.id}
              id={block.id}
              placeholder={block.placeholder}
              required={true}
            />
          )}
          {block.type === "long_answer" && (
            <textarea
              name={block.id}
              id={block.id}
              placeholder={block.placeholder}
              cols="30"
              rows="10"
              required={true}
            />
          )}
        </div>
      ))}
      <button>Submit &rarr;</button>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/" exact>
          <App />
        </Route>
        <Route path="/:id">
          <Form />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

function Results() {
  const {id} = useParams();
  const [resultsData, setResultsData] = useState([]);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Basic " + import.meta.env.VITE_HARPERDB_TOKEN
    );

    var raw = JSON.stringify({
      operation: "sql",
      sql: `SELECT * FROM foma.answers WHERE formId = '${id}'`,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_HARPERDB_URL, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = JSON.parse(result);
        setResultsData(data);
      })
      .catch((error) => console.error("error", error));
  }, []);

  if(resultsData.length === 0) return <p>Loading...</p>

  return (
    <div>
      {resultsData.map((result, key) => (
        <ResultBlock>
          <h2>Entry #{key}</h2>
          {result.formData.map((item) => (
            <div key={item.id}>
              <span>{item.placeholder}</span>
              <p>{item.value}</p>
            </div>
          ))}
        </ResultBlock>
      ))}
    </div>
  );
}

const ResultBlock = styled.div`
  border: 1px solid #c8d6e5;
  border-radius: 8px;
  box-shadow: 0 4px 6px -5px rgba(0, 0, 0, 0.15), 0 12px 15px -5px rgba(0, 0, 0, 0.1);
  margin: 3rem 0;
  transition: box-shadow 200ms ease;
  :hover {
    box-shadow: none;
  }
  h2 {
    margin: 1rem 1rem 0.5rem;
  }
  div {
    padding: 1rem;
    :nth-child(2n) {
      background: #f5f5f5;
    }
  }
  span {
    display: block;
    font-weight: 700;
  }
  p {
  }
`;

export default Results;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

function Form() {
  const [formData, setFormData] = useState([]);
  const [userData, setUserData] = useState([]);
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
      sql: `SELECT * FROM foma.forms WHERE id = '${id}'`,
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
        setFormData(data);
        const initialData = [];
        let i = 0;
        data[0].blocks.forEach((block) => {
          if (block.type !== "text_block") {
            initialData[i] = {
              id: block.id,
              placeholder: block.placeholder,
              value: "",
            };
            i++;
          }
        });
        setUserData(initialData);
      })
      .catch((error) => console.error("error", error));
  }, []);

  const handleChange = (e) => {
    const target = e.target;
    const data = [...userData];
    const index = userData.findIndex((item) => item.id === target.id);
    data[index] = {
      id: target.id,
      placeholder: target.placeholder,
      value: target.value,
    };
    setUserData(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = userData;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Basic " + import.meta.env.VITE_HARPERDB_TOKEN
    );

    const raw = JSON.stringify({
      operation: "insert",
      schema: "foma",
      table: "answers",
      records: [
        {
          formId: id,
          formData: data,
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_HARPERDB_URL, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  if (formData.length === 0) {
    return "Loading...";
  }

  return (
    <div>
      <Title>{formData[0].title}</Title>
      <form method="post" action="#" onSubmit={handleSubmit}>
        {formData[0].blocks.map((block) => (
          <div key={block.id}>
            {block.type === "text_block" && <p>{block.placeholder}</p>}
            {block.type === "short_answer" && (
              <Input
                type="text"
                name={block.id}
                id={block.id}
                placeholder={block.placeholder}
                onChange={handleChange}
                required={true}
              />
            )}
            {block.type === "long_answer" && (
              <Textarea
                name={block.id}
                id={block.id}
                placeholder={block.placeholder}
                cols="30"
                rows="10"
                onChange={handleChange}
                required={true}
              />
            )}
          </div>
        ))}
        <Button type="submit">
          <span>Submit</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="13" y1="18" x2="19" y2="12" />
            <line x1="13" y1="6" x2="19" y2="12" />
          </svg>
        </Button>
      </form>
    </div>
  );
}

const Title = styled.h1`
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin: 4rem 0;
`;

const Input = styled.input`
  border: 2px solid #c8d6e5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 1em;
  margin: 0.5rem 0 1rem 0;
  max-width: 350px;
  padding: 0.5rem;
  width: 100%;
  :focus {
    background: #f5f5f5;
    border-color: #808e9b;
    outline: none;
  }
`;

const Textarea = styled.textarea`
  border: 2px solid #c8d6e5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1em;
  height: 80px;
  margin: 0.5rem 0 1rem 0;
  max-width: 350px;
  padding: 0.5rem;
  width: 100%;
  :focus {
    background: #f5f5f5;
    border-color: #808e9b;
    outline: none;
  }
`;

const Button = styled.button`
  background: #222f3e;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1),
    0 15px 30px -12px rgba(0, 0, 0, 0.05);
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 1em;
  font-weight: 700;
  margin: 3rem 0;
  padding: 1rem 2rem;
  :hover {
    background-color: #1e272e;
  }
  :hover svg {
    transform: translateX(4px);
  }
  svg {
    margin-left: 1rem;
    transition: transform 200ms ease;
    vertical-align: middle;
  }
`;

export default Form;

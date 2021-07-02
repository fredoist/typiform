import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Block } from "../components/Block";
import { FormTitle } from "../components/FormTitle";

function Editor() {
  const createId = () => Math.random().toString(36).substr(2, 9);
  const [formTitle, setFormTitle] = useState("");
  const [formBlocks, setFormBlocks] = useState([]);
  const [formId, setFormId] = useState(createId());
  const history = useHistory();

  useEffect(() => {
    document.querySelector("#formTitle").focus();
  }, []);

  const handleKeyCommands = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      createBlock(e.target, "text_block");
    }
    // handle down arrow key event
    if (e.keyCode === 40) {
      e.preventDefault();
      const current = e.target.parentNode.id;
      const index = formBlocks.findIndex((block) => block.id === current);
      document
        .getElementById(formBlocks[index + 1].id)
        .querySelector("span")
        .focus();
    }
    // handle up arrow key event
    if (e.keyCode === 38) {
      e.preventDefault();
      const current = e.target.parentNode.id;
      const index = formBlocks.findIndex((block) => block.id === current);
      if (index === 0) {
        document.querySelector("#formTitle").focus();
      } else {
        document
          .getElementById(formBlocks[index - 1].id)
          .querySelector("span")
          .focus();
      }
    }
    // handle backspace key command
    if (e.keyCode === 8 && e.target.textContent === "") {
      e.preventDefault();
      const current = e.target.parentNode.id;
      if (formBlocks.length > 0) {
        const index = formBlocks.findIndex((block) => block.id === current);
        removeBlock(current);
        if (index !== 0) {
          document
            .getElementById(formBlocks[index - 1].id)
            .querySelector("span")
            .focus();
        } else {
          document.querySelector("#formTitle").focus();
        }
      }
    }
  };

  const createBlock = (current = null, type = "text_block", placeholder = "") => {
    const id = createId();
    const block = {
      id: id,
      type: type,
      placeholder: placeholder,
    };
    /**
     *  Insert a new block below the current element, either way create a new
     *  one at the end.
     *  */
    if (formBlocks.length > 0) {
      const targetID = current.parentNode.id;
      const index = formBlocks.findIndex((block) => block.id === targetID);
      const newBlocks = [...formBlocks];
      newBlocks.splice(index + 1, 0, block);
      setFormBlocks(newBlocks);
    } else {
      setFormBlocks([...formBlocks, block]);
    }
    // add focus on the new block created
    return setTimeout(() => {
      document.getElementById(id).querySelector("span").focus();
    });
  };

  const removeBlock = (id) => {
    return setFormBlocks(formBlocks.filter((block) => block.id !== id));
  };

  const updateBlock = (id, changes) => {
    const blocks = [...formBlocks];
    let blockIndex = blocks.findIndex((block) => block.id === id);
    blocks[blockIndex] = changes;
    return setFormBlocks(blocks);
  };

  const publishForm = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Basic " + import.meta.env.VITE_HARPERDB_TOKEN
    );

    const raw = JSON.stringify({
      operation: "insert",
      schema: "test",
      table: "forms",
      records: [
        {
          id: formId,
          title: formTitle,
          blocks: formBlocks,
        },
      ],
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_HARPERDB_URL, requestOptions)
      .then((response) => response.text())
      .then((result) => history.push(`/${formId}`))
      .catch((error) => console.log("error", error));
  };

  return (
    <div id={formId}>
      <Button onClick={publishForm}>
        <span>Publish</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="#ffffff"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
        </svg>
      </Button>
      <main onKeyDown={handleKeyCommands}>
        <FormTitle setFormTitle={setFormTitle} />
        {formBlocks.length > 0 ? (
          <Fragment>
            {formBlocks.map((block) => (
              <Block
                key={block.id}
                id={block.id}
                type={block.type}
                removeBlock={removeBlock}
                updateBlock={updateBlock}
              />
            ))}
            <DemoButton>
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
            </DemoButton>
          </Fragment>
        ) : (
          <span>
            Hit enter or{" "}
            <a
              onClick={createBlock}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              click to add a block.
            </a>
          </span>
        )}
      </main>
    </div>
  );
}

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
  padding: 1rem 2rem;
  position: absolute;
  right: 2rem;
  top: 2rem;
  :hover {
    background-color: #1e272e;
  }
  svg {
    margin-left: 1rem;
    vertical-align: middle;
  }
`;

const DemoButton = styled(Button)`
  cursor: not-allowed;
  margin: 3rem 0;
  opacity: 0.75;
  position: static;
`;

export default Editor;

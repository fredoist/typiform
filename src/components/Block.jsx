import React, { useState } from "react";
import styled from "styled-components";

function Block({ id, type, current, ...handler }) {
  const [isCommand, setIsCommand] = useState(false);
  const [blockType, setBlockType] = useState(type);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const blockTypes = [
    { id: "short_answer", label: "Short answer" },
    { id: "long_answer", label: "Long answer" },
  ];

  const handleInput = (e) => {
    current = false;
    const content = e.target.textContent;
    if (content !== "") {
      setShowPlaceholder(false);
      if (content.indexOf("/") === 0) {
        return setIsCommand(true);
      }
      return handler.updateBlock(id, {
        id: id,
        type: blockType,
        placeholder: content,
      });
    }
    setShowPlaceholder(true);
    return setIsCommand(false);
  };

  return (
    <BlockElement key={id} id={id} showPlaceholder={showPlaceholder}>
      <button onClick={(e) => handler.removeBlock(id)} tabIndex="-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#597e8d"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </button>
      <span
        data-type={type}
        className={type}
        onInput={handleInput}
        contentEditable={true}
        placeholder={
          type === "text_block"
            ? "Type '/' to add a block element"
            : "Add a placeholder"
        }
      />
      {isCommand && (
        <ul>
          {blockTypes.map((option) => (
            <li
              onClick={(e) => {
                handler.updateBlock(id, {
                  id: id,
                  type: option.id,
                  placeholder: "",
                });
                const element = document.getElementById(id).querySelector("span");
                element.textContent = "";
                element.focus();
                setShowPlaceholder(true)
                setIsCommand(false);
                setBlockType(option.id);
              }}
              key={option.id}
              id={option.id}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </BlockElement>
  );
}

const BlockElement = styled.div`
  display: block;
  margin: 0.5rem 0;
  position: relative;
  button {
    background: transparent;
    border: 0;
    border-radius: 2px;
    cursor: pointer;
    opacity: 0.5;
    padding: 0.25rem 0.5rem;
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(-20%, -50%);
    :hover {
      background-color: #f5f5f5;
      opacity: 1;
    }
  }
  span {
    border-radius: 2px;
    display: block;
    line-height: 1.5;
    padding: 0.5rem;
    ::before {
      color: #8395a7;
      content: ${(props) =>
        props.showPlaceholder ? "attr(placeholder)" : "none"};
      cursor: text;
      display: inline-block;
      z-index: -1;
    }
    :focus {
      background: #f5f5f5;
      outline: none;
    }
    &.short_answer {
      border: 2px solid #c8d6e5;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      color: #8395a7;
      max-width: 350px;
      width: 100%;
    }
    &.long_answer {
      border: 2px solid #c8d6e5;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      color: #8395a7;
      height: 80px;
      max-width: 350px;
      width: 100%;
    }
  }
  ul {
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1),
      0 15px 30px -12px rgba(0, 0, 0, 0.05);
    list-style: none;
    margin: 0;
    min-width: 250px;
    padding: 0.25rem 0;
    position: absolute;
    word-wrap: wrap;
    z-index: 50;
    li {
      cursor: pointer;
      display: block;
      padding: 0.5rem 1rem;
      :hover {
        background: #f5f5f5;
      }
    }
  }
`;

export { Block };

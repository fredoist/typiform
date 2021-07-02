import React, { useState } from "react";
import styled from "styled-components";

function FormTitle({ setFormTitle }) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const handleInput = (e) => {
    const content = e.target.textContent;
    if (content !== "") {
      setFormTitle(content);
      setShowPlaceholder(false);
    } else {
      setShowPlaceholder(true);
    }
  };

  return (
    <Title
      onInput={handleInput}
      contentEditable={true}
      showPlaceholder={showPlaceholder}
      id="formTitle"
      placeholder="Form title"
    />
  );
}

const Title = styled.h1`
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin: 4rem 0;
  ::before {
    color: #8395a7;
    content: ${(props) =>
      props.showPlaceholder ? "attr(placeholder)" : "none"};
    cursor: text;
    display: inline-block;
    z-index: -1;
  }
  :focus {
    outline: none;
  }
`;

export { FormTitle };

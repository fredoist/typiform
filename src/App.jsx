import React, { useState } from "react";

function App() {
  const createId = () => Math.random().toString(36).substr(2, 9);
  const [formTitle, setFormTitle] = useState("");
  const [formBlocks, setFormBlocks] = useState([]);
  const [formId, setFormId] = useState(createId());

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
    console.log(e.keyCode);
  };

  const createBlock = (current = null, type, placeholder = "") => {
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

  return (
    <div id={formId}>
      <pre>
        <code>
          {JSON.stringify({
            id: formId,
            title: formTitle,
            blocks: formBlocks,
          })}
        </code>
      </pre>
      <button>Publish 💾</button>
      <main onKeyDown={handleKeyCommands}>
        <h1
          onInput={(e) => setFormTitle(e.target.textContent)}
          contentEditable={true}
          id="formTitle"
        >Form title</h1>
        {formBlocks.map((block) => (
          <Block
            key={block.id}
            id={block.id}
            type={block.type}
            removeBlock={removeBlock}
            updateBlock={updateBlock}
          />
        ))}
        {formBlocks.length > 0 && (
          <button>Submit &rarr;</button>
        )}
      </main>
    </div>
  );
}

function Block({ id, type, current, ...handler }) {
  const [isCommand, setIsCommand] = useState(false);
  const [blockType, setBlockType] = useState(type);

  const blockTypes = [
    { id: "short_answer", label: "Short answer" },
    { id: "long_answer", label: "Long answer" },
    { id: "checkbox", label: "Checkboxes" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
  ];

  const handleInput = (e) => {
    current = false;
    const content = e.target.textContent;
    if (content !== "") {
      if (content.indexOf("/") === 0) {
        return setIsCommand(true);
      }
      return handler.updateBlock(id, {
        id: id,
        type: blockType,
        placeholder: content,
      });
    }
    return setIsCommand(false);
  };

  return (
    <div key={id} id={id}>
      <button onClick={(e) => handler.removeBlock(id)} tabIndex="-1">
        x
      </button>
      <span
        data-type={type}
        className={type}
        onInput={handleInput}
        contentEditable={true}
        >Type '/' to add a block element"</span>
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
    </div>
  );
}

export default App;

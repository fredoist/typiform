import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Editor from "./views/Editor";
import Form from "./views/Form";
import Results from "./views/Results";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Container>
        <Switch>
          <Route exact path="/">
            <Editor />
          </Route>
          <Route exact path="/:id">
            <Form />
          </Route>
          <Route path="/:id/results">
            <Results />
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

const GlobalStyles = createGlobalStyle`
  body {
    background: #fff;
    color: #222f3e;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
  }
`;

const Container = styled.div`
  margin: auto;
  max-width: 640px;
`;

export default App;

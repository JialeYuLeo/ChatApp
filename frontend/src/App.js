import "./App.scss";
import React from "react";
import { Container } from "react-bootstrap";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/homepage/Home";
import Video from "./pages/homepage/Video"

import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from "./util/DynamicRoute";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <DynamicRoute
                      exact
                      path="/"
                      element={<Home />}
                      authenticated
                    />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <DynamicRoute path="/login" element={<Login />} guest />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <DynamicRoute path="/register" element={<Register />} guest />
                  }
                />

<Route
                  path="/video"
                  element={
                    <DynamicRoute path="/video" element={<Video />} authenticated />
                  }
                />
              </Routes>
            </Container>
          </BrowserRouter>
        </MessageProvider>
        
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

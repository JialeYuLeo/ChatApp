import React, { Fragment, useEffect } from "react";
import { Row, Button } from "react-bootstrap";
import { gql, useSubscription } from "@apollo/client";

import { Link } from "react-router-dom";

import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";

import Users from "./Users";
import Messages from "./Messages";

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

export default function Home() {
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();

  const { user } = useAuthState();

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;

      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [messageError, messageData, messageDispatch, user.username]);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/";
  };

  return (
    <Fragment>
      <h1 className="mb-4 text-center">
        {" "}
        Hi{" "}
        <span className="text-decoration-underline fw-bold text-warning">
          {user.username}
        </span>
        , Let's Chat!
      </h1>
      <Row className="bg-white justify-content-evenly mb-1">
        <Link
          className="w-auto d-flex text-decoration-none align-items-center fw-bolder text-info"
          to="/video"
          target="_blank"
        >
          video
        </Link>
        <Button
          variant="link"
          className="w-auto text-decoration-none fw-bolder text-info"
          onClick={logout}
        >
          Logout
        </Button>
      </Row>
      <Row className="bg-white">
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
}

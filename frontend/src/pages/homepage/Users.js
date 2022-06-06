import React, { useEffect, useState } from "react";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { Col, Image, Form } from "react-bootstrap";
import classNames from "classnames";

import { useMessageDispatch, useMessageState } from "../../context/message";

const GET_USERS = gql`
  query getUsers($username: String) {
    getUsers(username: $username) {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

export default function Users() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const [searchName, setSearchName] = useState("");
  const selectedUser = users?.find((u) => u.selected === true)?.username;

  const { loading, data } = useQuery(GET_USERS);

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_USERS", payload: data.getUsers });
    }
  }, [data, dispatch]);

  const [
    getUsernameUser,
    { loading: searchLoading, error: searchError, data: searchData },
  ] = useLazyQuery(GET_USERS);

  const searchUser = (e) => {
    e.preventDefault();
    getUsernameUser({ variables: { username: searchName } });
  };

  useEffect(() => {
    if (searchData) {
      dispatch({ type: "SET_USERS", payload: searchData.getUsers });
    }
  }, [searchData, dispatch]);

  let usersMarkup;
  if (!users || loading || searchLoading) {
    usersMarkup = <p className="text-center mt-1">Loading..</p>;
  } else if (searchError) {
    if (searchError.message === "user not found") {
      usersMarkup = <p className="text-center mt-1">User not found</p>;
    } else if (searchError.message === "search login user") {
      usersMarkup = <p className="text-center mt-1">It's your name!</p>;
    } else {
      usersMarkup = (
        <p className="text-center text-warning mt-1">
          Search Error: {searchError.message}
        </p>
      );
    }
  } else if (users.length === 0) {
    usersMarkup = (
      <p className="text-center mt-1">Waiting for other users to join</p>
    );
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role="button"
          className={classNames("user-div d-flex m-2", {
            "bg-white": selected,
          })}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image
            src={
              user.imageUrl ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            roundedCircle
            className="m-2"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          <div className="d-none d-md-block m-2 overflow-hidden">
            <p className="text-success mb-1">{user.username}</p>
            <p className="font-weight-light mb-1 text-nowrap">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are now connected!"}
            </p>
          </div>
        </div>
      );
    });
  }

  return (
    <Col xs={2} md={4} className="users-box p-2 bg-secondary">
      <Form onSubmit={searchUser}>
        <Form.Group>
          <Form.Control
            type="text"
            className="message-input rounded-pill bg-white"
            placeholder="Search for name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Form.Group>
      </Form>
      {usersMarkup}
    </Col>
  );
}

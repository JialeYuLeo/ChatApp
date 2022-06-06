import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

export default function Register(props) {
  let navigate = useNavigate();
  const USER_REGISTER = gql`
    mutation register(
      $username: String!
      $email: String!
      $password: String!
      $confirmPassword: String!
      $imageUrl: String
    ) {
      register(
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        imageUrl: $imageUrl
      ) {
        username
        email
        createdAt
      }
    }
  `;

  const [errors, setErrors] = useState({});

  const [Userregister, { loading }] = useMutation(USER_REGISTER, {
    update(_, __) {
      navigate(`/login`);
    },
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();
    Userregister({ variables });
  };

  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
  });

  return (
    <Row className="justify-content-center">
      <Col className="bg-white p-5 justify-content-center" lg={6}>
        <h1 className="text-center">Register</h1>

        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label className={errors.email && "text-danger"}>
              {errors.email ?? "Email address"}
            </Form.Label>
            <Form.Control
              type="email"
              value={variables.email}
              className={errors.email && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              type="text"
              value={variables.username}
              className={errors.username && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
              placeholder="Username"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              type="password"
              value={variables.password}
              className={errors.password && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
              placeholder="******"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.confirmPassword && "text-danger"}>
              {errors.confirmPassword ?? "Confirm password"}
            </Form.Label>
            <Form.Control
              type="password"
              value={variables.confirmPassword}
              className={errors.confirmPassword && "is-invalid"}
              onChange={(e) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="******"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.imageUrl && "text-danger"}>
              {errors.imageUrl ?? "Avatar URL (optional)"}
            </Form.Label>
            <Form.Control
              type="imageUrl"
              value={variables.imageUrl}
              className={errors.imageUrl && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, imageUrl: e.target.value })
              }
              placeholder="Enter imageUrl"
            />
          </Form.Group>

          <div className="text-center pt-2">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading.." : "Register"}
            </Button>

            <br />
            <small>
              Already have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

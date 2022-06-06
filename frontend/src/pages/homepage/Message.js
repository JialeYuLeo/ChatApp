import React from "react";
import "./Message.css";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";

export default function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;

  return (
    <OverlayTrigger
      placement={sent ? "right" : "left"}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
        </Tooltip>
      }
      transition={false}
    >
      <div
        className={classNames("d-flex my-2", {
          "ms-auto": sent,
          "me-auto": received,
        })}
      >
        <div
          className={classNames("px-3 py-1 rounded-pill bg-primary", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          <div
            className={classNames("message-text", {
              "text-white": sent,
            })}
            key={message.uuid}
          >
            {message.content}
          </div>
        </div>
      </div>
    </OverlayTrigger>
  );
}

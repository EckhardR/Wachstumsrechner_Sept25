import { FcViewDetails } from "react-icons/fc/index.esm.js";
import React, { useState } from "react";
import { ButtonCancel } from "../global-variables.js";
import { ButtonGroup, Modal } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button.js";

type Props = {
  Title: string,
  children?: any,
  ID?: number,
  icon?: any,
};

export const DetailsDesign = (props: Props) => {
  const { Title, children, ID, icon, secondButton } = props;
  const [show, setShow] = useState(false);
  
  return (
    <div key={ID + "expressionModal"}>
      <button onClick={() => setShow(true)} className="btn w-100">
        {icon ? icon : <FcViewDetails size={35} />}
      </button>
      {show && (
        <Modal show={show} onHide={() => setShow(false)} size="xl" style={{}}>
          <Modal.Header closeButton>
            <Modal.Title className="d-flex flex-row">
              <p>{Title}</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{children}</Modal.Body>
          <Modal.Footer>
            {secondButton ? (
              <Button
                variant="primary"
                style={{ backgroundColor: "#0693E3" }}
                className="btn btn-sm btn-block d-flex row"
              >
                {secondButton}
              </Button>
            ) : null}
            <Button
              variant="secondary"
              style={{ backgroundColor: ButtonCancel, width: "100%" }}
              onClick={() => setShow(false)}
              className="btn btn-lg btn-block"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export const GlobalDialog = (props: Props) => {
  const { Title, children, ID, Icon, secondButton, textButton, sty, closeFunction } = props;
  const [show, setShow] = useState(false);

  return (
    <div key={ID + "expressionModal"}>
      <button
        onClick={() => {
          setShow(true)
        }}
        className="btn"
        style={sty ? sty : null}
      >
        {textButton ? textButton : null} {Icon}
      </button>
      {show && (
        <Modal show={show} onHide={() => setShow(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title className="d-flex flex-row">
              <p>{Title}</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{ children }</Modal.Body>
          <Modal.Footer className="row d-flex">
            <ButtonGroup
              fullWidth
              variant="contained"
              sx={{ justifyContent: "center" }}
            >
              {secondButton ? secondButton : null}
              <Button
                style={{ backgroundColor: ButtonCancel }}
                onClick={() => setShow(false)}
                className="btn btn-lg btn-block"
              >
                Close
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

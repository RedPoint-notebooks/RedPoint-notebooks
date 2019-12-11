import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ModalForm = () => {
  const modal = () => {
    // const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    return (
      <>
        <Button variant="primary" onClick={props.onToggleModal}>
          Launch demo modal
        </Button>

        <Modal
          // show={props.modalVisible}
          show={false}
          onHide={props.handleToggleSaveOrCloneForm}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={props.handleToggleSaveOrCloneForm}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={props.handleToggleSaveOrCloneForm}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  return modal();
};

export default ModalForm;

import React from 'react';
import { Toast } from 'react-bootstrap';

const ToastMessage = ({
  onClose,
  show,
  headerText = '',
  bodyText,
  bodyStyle = {},
  delay = 3000,
  ...props
}) => {
  return (
    <Toast onClose={onClose} show={show} delay={delay} autohide {...props}>
      <Toast.Header>
        <strong className="me-auto">{headerText}</strong>
      </Toast.Header>
      <Toast.Body style={bodyStyle}>{bodyText}</Toast.Body>
    </Toast>
  );
};

export default ToastMessage;

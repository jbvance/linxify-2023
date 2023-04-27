import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-bootstrap';
import ToastMessage from '@/components/ToastMessage';

const useToast = (variant = 'success', delay = 3000) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const ToastCustom = () => {
    return (
      <ToastContainer className="p-3" position="top-center">
        <ToastMessage
          onClose={() => setShowToast(false)}
          show={showToast}
          bg={variant}
          bodyText={toastMessage}
          bodyStyle={{ color: 'white', fontSize: '1.5rem' }}
          headerText=""
          delay={delay}
        />
      </ToastContainer>
    );
  };

  return {
    setShowToast,
    setToastMessage,
    showToast,
    toastMessage,
    ToastCustom,
  };
};

export default useToast;

import { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import ToastMessage from '@/components/ToastMessage';

const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
};

export default useToast;

import React, { Fragment } from 'react';
import { useField } from 'formik';
import styles from '@/styles/Forms.module.css';

const SelectInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Fragment>
      <label className={styles.label} htmlFor={props.id || props.name}>
        {label}
      </label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </Fragment>
  );
};

export default SelectInput;

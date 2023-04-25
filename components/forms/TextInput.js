import React, { Fragment } from 'react';
import { useField } from 'formik';
import styles from '@/styles/Forms.module.css';

const TextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <Fragment>
      <label className={styles.label} htmlFor={props.id || props.name}>
        {label}
      </label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={styles.error}>{meta.error}</div>
      ) : null}
    </Fragment>
  );
};

export default TextInput;

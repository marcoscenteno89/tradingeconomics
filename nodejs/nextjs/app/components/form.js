'use client';
import React, { useState, useEffect, useRef } from 'react';
import capitalize from 'lodash/capitalize';
import Loading from './loading';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

/**
 * WebAlert component.
 * @param {Object} props - The component props.
 * @param {boolean} props.active - Determines if the alert should be displayed.
 * @param {string} props.variant - The variant of the alert.
 * @param {string} props.msg - The message to be displayed in the alert.
 * @returns {JSX.Element|null} The rendered WebAlert component or null if props.active is false.
 */
const WebAlert = (props) => {
  if (!props.active) return null
  return (
    <Alert variant={props.variant}>
      <div dangerouslySetInnerHTML={{ __html: props.msg }} />
    </Alert>
  )
}

/**
 * Input component for forms.
 *
 * @param {Object} props - The props for the Input component.
 * @param {string} props.name - The name of the input.
 * @param {boolean} [props.no-label] - Whether to display the label or not.
 * @param {Function} props.set - The function to set the input value.
 * @returns {JSX.Element} The rendered Input component.
 */
const Input = (props) => {
  
  const ref = useRef(null);
  const [ label ] = useState(capitalize(props.name.replace(/_/g, ' ')));
  let n = { ...props };
  delete n.set;
  useEffect(() => props.set(ref.current, props.name), []);
  
  return (
    <>
      {props['no-label'] ? 
        <Form.Control ref={ref} id={`id-${n.name}`} {...n} placeholder={label} /> 
      : 
        <Form.Group className="input-group mb-2">
          <Form.Label className="col-4 input-group-text m-0" htmlFor={`#id-${props.name}`}>
            {label}
          </Form.Label>
          <Form.Control ref={ref} id={`id-${n.name}`} {...n} placeholder={label} />
        </Form.Group>
      }
    </>
  )
}

/**
 * Represents a web form component.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.className - The CSS class name for the form.
 * @param {Function} props.callBack - The callback function to be called on form submission.
 * @param {ReactNode} props.children - The child components of the form.
 * @returns {JSX.Element} The rendered form component.
 */
const WebForm = (props) => {
  const [ form, setForm ] = useState(null);
  const [ alert, setAlert] = useState('');
  useEffect(() => {
    const obj = {};
    for (let i of React.Children.toArray(props.children)) {
      obj[i.props.name] = {
        name: i.props.name,
        value: i.props.value ? i.props.value : '',
        label: capitalize(i.props.name.replace(/_/g, ' ')),
        ref: null
      }
    }
    setForm(obj);
  }, []);

  const set = (ref, name) => {
    let newForm = { ...form };
    newForm[name].ref = ref;
    setForm(newForm);
  }

  const submit = () =>  {
    let msg = '';
    Object.keys(form).map((key) => {
      form[key].value = form[key].ref.value; // Update value
      if (form[key].ref.type !== 'hidden') {
        if (!form[key].ref.validity.valid) {
          form[key].ref.value = '';
          form[key].ref.placeholder = form[key].ref.validationMessage;
          form[key].ref.classList.add('bg-danger');
          msg += `${form[key].label}: ${form[key].ref.validationMessage}</br>`;
        }
      }
    });
    if (msg !== '') { // Found Issues, set alert
      // setAlert(msg);
    } else { // No issues, clear alert and submit
      setAlert('');
      props.callBack(form);
    }
  }
  
  const arr = React.Children.toArray(props.children);

  return (
    <Loading require={[form]}>
      <Form className={props.className}>
        {arr.map((key, i) => {
          return <Input key={`field-${i}`} set={set} {...key.props} />
        })} 
        <Button onClick={submit} variant="outline-primary">Submit</Button>
        <WebAlert variant="danger" active={alert !== ''} msg={alert} />
      </Form>
    </Loading>
  )
}

export default WebForm;
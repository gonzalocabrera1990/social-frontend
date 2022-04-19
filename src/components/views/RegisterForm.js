import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  Col,
  Input,
  Label,
  Button,
  FormFeedback
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { countries } from '../../shared/countries';

export const Forms = withRouter((props)=> {
  const [dataForm, setDataForm] = useState({
    username: '',
    password: '',
    repeatpassword: '',
    sex: '',
    date: '',
    country: ''
  })
  const [touched, setTouched] = useState({
    password: false,
    username: false
  })

  const controlState = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setDataForm((prevProps)=>({
      ...prevProps,
      [name]: value
    }))
  }

  const handleBlur = field => e => {
      setTouched((prevProps)=>({
        ...prevProps,
        [field]: true
      })
    )
  }

  const validar = ( username, password, repeatpassword, sex, date, country) => {
    const error = {
      password: { err: "", valid: false },
      repeatpassword: { err: "", valid: false },
      username: { err: "", valid: false },
      sex: false,
      date: false,
      country: false
    };
    
    const expreg = /^(\w{3,})@(gmail|hotmail|outlook).\b(com|info|web)\b/;

    if (touched.password && password.length < 4) {
      error.password.err =
        "La contraseña es DEBIL. Debe ser mayor a 4 caracteres. Recomendamos alternar numeros y letras";

    } else if (touched.password && password.length > 10) {
      error.password.err =
        "El contraseña debe ser menor o igual a 10 caracteres. Recomendamos alternar numeros y letras";
    } else if (password !== "") {
      error.password.valid = true
    }

    if (touched.repeatpassword && repeatpassword !== password) {
      error.repeatpassword.err =
        "CONTRASEÑA Y REPETIR CONTRASEÑA NO COINCIDEN. POR FAVOR, VALIDA ESTE COMPO DE TEXTO";
    } else if (touched.repeatpassword && repeatpassword.length > 10) {
      error.repeatpassword.err =
        "El contraseña debe ser menor o igual a 10 caracteres. Recomendamos alternar numeros y letras";
    } else if (repeatpassword !== "") {
      error.repeatpassword.valid = true
    }
    if (touched.username && !expreg.test(username)) {
      error.username.err = "Debe cumplir el formato de email. Ej: exampe@mail.com";
    } else if (username !== "") {
      error.username.valid = true
    }

    if (sex !== 'Choose a gender ...' && sex !== "") {
      error.sex = true
    }
    
    if (date !== "") {
      error.date = true
    }
    if (country !== "") {
      error.country = true
    }
    return error;
  }

  const onSubmit = e => {
    e.preventDefault();
    props.signupUser(dataForm).then(() => {
      props.history.push("/users/post");
    });
  };


    const error = validar(
      dataForm.username,
      dataForm.password,
      dataForm.repeatpassword,
      dataForm.sex,
      dataForm.date,
      dataForm.country
    );
    const enableButton = error.username.valid && error.password.valid &&
      error.repeatpassword.valid && error.sex &&
      error.date && error.country ? true : false;
      
    const country = countries.map((c, index) => <option key={index}>{c}</option>)
    return (
      <div>
        <div className="container-fluid">
          <div className=" col-sm-6 offset-sm-3">
            <h1>Crea una cuenta nueva</h1>
          </div>
        </div>

        <div className="container">
          <Form onSubmit={onSubmit}>
            <FormGroup row>
              <Label htmlFor="username" md={2}>
                Email
              </Label>
              <Col md={10}>
                <Input
                  type="email"
                  id="username"
                  name="username"
                  placeholder="example@mail.com"
                  value={dataForm.username}
                  valid={error.username.err === ""}
                  invalid={error.username.err !== ""}
                  onChange={controlState}
                  onBlur={handleBlur("username")}
                />
                <FormFeedback>{error.username.err}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="password" md={2}>
                Contraseña
              </Label>
              <Col md={10}>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                  value={dataForm.password}
                  valid={error.password.err === ""}
                  invalid={error.password.err !== ""}
                  onChange={controlState}
                  onBlur={handleBlur("password")}
                />
                <FormFeedback>{error.password.err}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="repeatpassword" md={2}>
                Repetir Contraseña
              </Label>
              <Col md={10}>
                <Input
                  type="password"
                  id="repeatpassword"
                  name="repeatpassword"
                  placeholder="repetir contraseña"
                  value={dataForm.repeatpassword}
                  valid={error.repeatpassword.err === ""}
                  invalid={error.repeatpassword.err !== ""}
                  onChange={controlState}
                  onBlur={handleBlur("repeatpassword")}
                />
                <FormFeedback>{error.repeatpassword.err}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="sex" md={2}>
                Sex
              </Label>
              <Col md={10}>
                <Input
                  type="select"
                  id="sex"
                  name="sex"
                  value={dataForm.sex}
                  onChange={controlState}
                >
                  <option>Choose a gender ...</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="date" md={2}>
                Fecha de Naciminento
              </Label>
              <Col md={10}>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  placeholder="Birth"
                  value={dataForm.date}
                  onChange={controlState}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="country" md={2}>
                Country
              </Label>
              <Col md={10}>
                <Input
                  type="select"
                  id="country"
                  name="country"
                  placeholder="country"
                  value={dataForm.country}
                  onChange={controlState}
                >
                  {country}
                </Input>
              </Col>
              <Col>
                {
                  enableButton
                    ?
                    <Button type="file" >Enviar</Button>
                    :
                    <Button type="file" disabled>Enviar</Button>
                }

              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
})

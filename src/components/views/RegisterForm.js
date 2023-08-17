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
        "The password is WEAK. It must be greater than 4 characters. We recommend alternating numbers and letters.";

    } else if (touched.password && password.length > 10) {
      error.password.err =
        "The password must be less than or equal to 10 characters. We recommend alternating numbers and letters.";
    } else if (password !== "") {
      error.password.valid = true
    }

    if (touched.repeatpassword && repeatpassword !== password) {
      error.repeatpassword.err =
        "Password and Repeat password do not match. Please validate these fields.";
    } else if (touched.repeatpassword && repeatpassword.length > 10) {
      error.repeatpassword.err =
        "The password must be less than or equal to 10 characters. We recommend alternating numbers and letters.";
    } else if (repeatpassword !== "") {
      error.repeatpassword.valid = true
    }
    if (touched.username && !expreg.test(username)) {
      error.username.err = "Wrong e-mail format. Ej: exampe@mail.com";
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
        <div className="container mb-5">
          <div className=" col-sm-6 offset-sm-3">
            <h1>SignUp</h1>
          </div>
        </div>

        <div className="container">
          <Form onSubmit={onSubmit}  className=" col-sm-8 offset-sm-2 col-md-6 offset-sm-3">
            <FormGroup className="my-4" row>
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
            <FormGroup className="my-4" row>
              <Label htmlFor="password" md={2}>
                Password
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
            <FormGroup className="my-4" row>
              <Label htmlFor="repeatpassword" md={2}>
                Repeat Password
              </Label>
              <Col md={10}>
                <Input
                  type="password"
                  id="repeatpassword"
                  name="repeatpassword"
                  placeholder="repeat contraseña"
                  value={dataForm.repeatpassword}
                  valid={error.repeatpassword.err === ""}
                  invalid={error.repeatpassword.err !== ""}
                  onChange={controlState}
                  onBlur={handleBlur("repeatpassword")}
                />
                <FormFeedback>{error.repeatpassword.err}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup className="my-4" row>
              <Label htmlFor="sex" md={2}>
                Gender
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
            <FormGroup className="my-4" row>
              <Label htmlFor="date" md={2}>
                Birthdate
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
            <FormGroup className="my-4" row>
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
                    <Button type="file"  className="bg-success border-0" >Send</Button>
                    :
                    <Button type="file" disabled >Send</Button>
                }

              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
})

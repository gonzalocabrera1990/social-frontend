import React, { useEffect, useState } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback,
  Button,
  CustomInput,
  Modal, ModalBody, ModalFooter
} from 'reactstrap';
import { withRouter } from 'react-router-dom';

export const Settings = withRouter((props) => {
      const [dataForm, setDataForm] = useState({
        firstname: '',
        lastname: '',
        phrase: '',
        status: ''
      })
      const [isModalOpen, setIsModalOpen] = useState(false)


useEffect (()=>{
  let user = !props.user ? null : props.user.user
  let status = !user ? false : user.publicStatus
  let modalStatus = !user ? null : user.firstname === "" && user.lastname === "" ? true : false
  setDataForm((prevState)=>({
    ...prevState,
    status: status
  }))
  setIsModalOpen(modalStatus)
}, []) // eslint-disable-line react-hooks/exhaustive-deps

const controlState = (e) => {
  let name = e.target.name
  if(name === "status"){
    setDataForm((prevProps)=>({
      ...prevProps,
      status: !dataForm.status
    }))
} else {
  setDataForm((prevProps)=>({
    ...prevProps,
    [name]: e.target.value
  }))
 }
}
 const handleSubmit = (e) => {
    e.preventDefault();
    const userid = props.user.user._id;
    props.settingsUser(userid, dataForm).then(() => {
      props.history.push("/userpage");
      window.location.reload();
    });
  }
  const toggleModal = () => {
      setIsModalOpen(!isModalOpen)
  }
    return (
      <div>
         <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalBody>
                    <h5>Por favor, completa tu informacion personal antes de navegar por vuestro sitio.</h5>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={toggleModal} >Close</Button>
                </ModalFooter>
            </Modal>
        <div className="container ">
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormGroup row>
              <Label htmlFor="firstname" md={2}>
                Nombre
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="Nombre"
                  onChange={controlState}
                  value={dataForm.firstname}
                />
                <FormFeedback />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="lastname" md={2}>
                Apellido
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Apellido"
                  onChange={controlState}
                  value={dataForm.lastname}
                />
                <FormFeedback />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="phrase" md={2}>
                Frase de Cabecera
              </Label>
              <Col md={10}>
                <Input
                  type="textarea"
                  id="phrase"
                  name="phrase"
                  placeholder="Frase de Cabecera"
                  onChange={controlState}
                  value={dataForm.phrase}
                />
              </Col>
            </FormGroup>
            <FormGroup row  className="cursor" >
              <Label htmlFor="status" md={2} >
                Estado de la cuenta
              </Label>
              <Col md={10} >
              <CustomInput type="switch" id="status" name="status" label={dataForm.status ? "privado" : "publica"}
                onChange={controlState}
                checked={dataForm.status}
                />
              </Col>
              <Col>
                <Button type="submit">Enviar</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
})

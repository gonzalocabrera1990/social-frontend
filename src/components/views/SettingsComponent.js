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

  const enableButton = dataForm.firstname || dataForm.lastname ||
  dataForm.phrase || dataForm.status ? true : false;

    return (
      <div>
         <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalBody>
                    <h5>Please, fill in your personal information before browsing your site.</h5>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={toggleModal} >Close</Button>
                </ModalFooter>
            </Modal>
        <div className="container ">
          <div className=" col-sm-10 offset-sm-1 col-md-8 offset-md-2" >
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormGroup row>
              <Label htmlFor="firstname" md={2}>
                Firstname
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="Firstname"
                  onChange={controlState}
                  value={dataForm.firstname}
                />
                <FormFeedback />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="lastname" md={2}>
                Lastname
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Lastname"
                  onChange={controlState}
                  value={dataForm.lastname}
                />
                <FormFeedback />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label htmlFor="phrase" md={2}>
                Personal phrase
              </Label>
              <Col md={10}>
                <Input
                  type="textarea"
                  id="phrase"
                  name="phrase"
                  placeholder="Personal phrase"
                  onChange={controlState}
                  value={dataForm.phrase}
                />
              </Col>
            </FormGroup>
            <FormGroup row  className="cursor" >
              <Label htmlFor="status" md={2} >
                Status account
              </Label>
              <Col md={10} >
              <CustomInput type="switch" id="status" name="status" label={dataForm.status ? "Private" : "Public"}
                onChange={controlState}
                checked={dataForm.status}
                />
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
      </div>
    );
})
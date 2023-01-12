import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { Loading } from '../LoadingComponent';
import Carousele from '../HomeCarousel';

export const Home = withRouter((props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoginSent, setIsLoginSent] = useState(false)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)

  const toggleModal = () => {
      setIsModalOpen(!isModalOpen)
  }

  const handleLogin = (event) => {
    event.preventDefault();
    toggleModal();
    setIsLoginSent(true)
    props.loginUser({
      username: username.value,
      password: password.value
    })
    .then(resp =>{
      return resp ? props.history.push("/settings") : null
    })
  }

      if (isLoginSent) {
        return (
            <div >
                <Loading />
            </div>
        )
    }
    else {
      return (
      <div className="container-fluid contenedor">
        <div className="elementos">
          <div className="col-12 col-md-6 carrusel" >
            <Carousele/>
          </div>
          <div className="col-12 col-md-6 detalles">
            <div className="fullSize intro">
              <h3>
                LandScapes <br/> Social Media
              </h3>
            </div>
            <div className="row botonera fullSize">
              <div className="col-sm-5 boton">
                <Button className=" btn btn-lg bg-success " onClick={toggleModal} >
                  Login 
                </Button>
              </div>
              <div className="col-sm-5 boton">
                <Button className="btn btn-lg bg-success " href="/signup">
                  SingUp
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Login</ModalHeader>
            <ModalBody>
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    innerRef={input => (setUsername(input))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    innerRef={input => (setPassword(input))}
                  />
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="remember"
                    />
                    Remember me
                  </Label>
                </FormGroup>
                <Button type="submit" value="submit" color="primary">
                  Login
                </Button>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>  
    );
  }
})

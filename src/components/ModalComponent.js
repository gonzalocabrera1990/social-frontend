import React, { useState } from 'react';
import {
  Button, Modal, ModalBody, Form, Input
} from 'reactstrap';
import styled from 'styled-components'
import { RenderComments } from './CommentComponent';
import { LikesModal } from './LikesModal';
import { baseUrl } from '../shared/baseUrl';

export const ModalComponent = (props) => {
  const [activeVideo, setActiveVideo] = useState(false)
  let likesLength = !props.likes ? [] : props.likes;
  let imagen
  if (props.media === "wall") {
    imagen = !props.img ? "" : baseUrl + props.img.imageId.filename
  } else if (props.media === "video") {
    imagen = !props.img ? "" : baseUrl + props.img.videoId.filename
  } else if (props.media === "imagen") {
    imagen = !props.img ? "" : baseUrl + props.img.imageId.filename
  }
  function play(e) {
    if (!activeVideo) e.target.play()
    if (activeVideo) e.target.pause()
    setActiveVideo(!activeVideo)
  }
  const show = () => {
    setActiveVideo(!activeVideo)
  }

  return (
    <div>
      <Modal isOpen={props.isModalOpen} toggle={props.toggleModal} size="lg" >
        <LikesModal isLikesModalOpen={props.isLikesModalOpen} toggle={props.toggleModal} likes={props.likes} usuario={props.usuario} />
         <Form >
          <ModalBody className="modalWithoutPadding center-comments">
            <Modalidad>
              <div className="modalgroup">
                <div className="c">
                  {
                    props.media === "imagen" ?
                      <img className="resp" src={imagen} alt="wall grid" />
                      :
                      <div className="video-media-items">
                        <span className={"fa fa-play play-icon-start " + (activeVideo ? "play-video" : " ")} style={{ color: '#e4e4e4', fontSize: '8vw' }}></span>
                        <video className="responsive"
                          src={imagen} alt="wall grid"
                          onClick={(e) => play(e)}
                          onEnded={() => show()} />
                      </div>
                  }
                </div>
                <div className="modalComments">
                  <div className="comm">
                    <RenderComments comentarios={props.comments} deleteComments={props.deleteComments} usuario={props.usuario} />
                  </div>
                  <div>
                    {
                      likesLength.length === 1
                        ?
                        <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => props.toggleModal(event, "likemodal")} >{props.likes.length} person like it.</strong></h6>
                        :
                        likesLength.length > 1
                          ?
                          <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => props.toggleModal(event, "likemodal")} >{props.likes.length} people like it.</strong></h6>
                          :
                          <h6 style={{ marginLeft: "10px" }}>Be the first to like.</h6>
                    }
                  </div>
                  <div className="foot">
                    <div className="texto h-100">
                      <Input type="textarea" className="h-100" model=".comment" id="comment" value={props.active} onChange={(e) => props.controlPostMessage(e)} />
                    </div>
                    <div className="footButtons">
                      <div className="buton btn-sm" >
                        {props.active.length === 0 || props.active.length > 140 ?
                          <Button className="btn-sm h-100" disabled><span className="fas fa-paper-plane"></span></Button>
                          :
                          <Button onClick={(event) => props.handleSubmit(event)}className="btn-sm h-100"><span className="fas fa-paper-plane"></span></Button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modalidad>
          </ModalBody>
        </Form>
      </Modal>
    </div>
  )
}

const Modalidad = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
justify-content:center;
div.modalgroup {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-right: 15px;
}
div.modalComments {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

div.foot {
    display: flex;
flex-direction: row;
    margin-left: 5%;
}
div.footButtons {
    display: flex;
flex-direction: column;
height: 100%;
}
.buton{
  height: 100%;
}
div.comm {
    height: 460px;
    display: block;
    overflow-y: scroll;
  scroll-behavior: smooth;
}
div.c {
    height: 550px;
}
img.resp {

    width: 100%;
    height: 100%;
    max-width: auto;
    min-whidth: auto;
    object-fit: contain;
  }
  img.comment{
    margin-left: 5%;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    max-width: auto;
    min-whidth: auto;
    object-fit: cover;
  }
  div.modal-body {
    align-self: center;
  }
  @media (max-width: 991px) {
    .modal-body {
      align-self: center;
    }
    div.modalgroup {
      justify-content: center;
    }
    div.c {
      display: none;
    }
    div.modalComments {
      justify-content: center;
    }
  }
`
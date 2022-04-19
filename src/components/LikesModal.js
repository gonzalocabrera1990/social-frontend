import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { baseUrl } from '../shared/baseUrl';

export const LikesModal = (props) => {
    const likesList = !props.likes ? null : props.likes;
    const megustaamigos = !likesList ? null : likesList.map(amis => {
        return (
            <Link to={`/profiles/${props.usuario}/${amis.usuario}`} className="w-100" key={amis._id}>
            <div className="like-user">
                <img className="" src={baseUrl + amis.image.filename} alt="img_profile"/>
                <h5>{amis.firstname} </h5>
                <h5>{amis.lastname}</h5>
            </div>
            </Link>
        )
    })
    return (
        <div>
            <Modal isOpen={props.isLikesModalOpen} toggle={props.toggle}>
                <ModalHeader id="likemodal" toggle={(e) => props.toggle(e)}><span>Me gusta</span></ModalHeader>
                <ModalBody>
                    <ModalLikes>
                            {megustaamigos}
                    </ModalLikes>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </Modal>
        </div>
    )

}
const ModalLikes = styled.div`
display: flex;
flex-direction: column;
text-overflow: ellipsis;
align-items: center;
height: 65vh;
overflow-y: scroll;
overflow-x: hidden;
div.like-user {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    margin: 5px 0px 5px 5px
}
h6 {
    white-space: nowrap;
    align-items: center;
}
img{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0px 8px 0px 5px;
  object-fit: cover;
}

@media (max-width: 1280px) {
  img{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  }
}

}
`
import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { withRouter } from 'react-router-dom';
import {
  Button
} from 'reactstrap';
import { Control, LocalForm } from 'react-redux-form';
import { RenderComments } from '../CommentComponent';
import { LikesModal } from '../LikesModal';
import { baseUrl } from '../../shared/baseUrl';


export const ImagenComponent = withRouter((props) => {
  const [data, setData] = useState(null)
  const [likes, setLikes] = useState(null)
  const [comentarios, setComentarios] = useState(null)
  const [active, setActive] = useState('')
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState(false)
  const [likeStatus, setLikeStatus] = useState(false)
  const [e, setE] = useState(null)

  useEffect(() => {
    const ID = props.match.params.idimg;
    let user = JSON.parse(localStorage.getItem("id"));
    const bearer = "Bearer " + localStorage.getItem("token");
    return fetch(`${baseUrl}imagen/view/imagenwall/${ID}`, {
      method: "GET",
      headers: {
        Authorization: bearer
      }
    })
      .then(resp => resp.json())
      .then(img => {
        let likesFilter = img.likes.some(i => i._id === user)
        setData(img)
        setLikes(img.likes)
        setLikeStatus(likesFilter)
      })
      .then(() => {
        return fetch(baseUrl + `comments/get-comments-image/${ID}`)
          .then(data => data.json())
          .then(json => {
            setComentarios(json)
          })
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.match.params.idimg])

  const handleSubmit = (values, event) => {
    event.preventDefault();
    const commenta = {
      comment: values.comment,
      author: localStorage.getItem("id"),
      image: event.target.id
    }
    props.commentsPost(commenta)
      .then(sol => {
        setComentarios(comentarios.concat(sol))
        setActive('')
      })
  }
  const handleLike = (event, imgI, tag) => {
    event.preventDefault();
    let img = imgI;
    var usersData = {
      id: JSON.parse(localStorage.getItem('id')),
      liked: img
    }
    if (tag === "imagen") {
      props.postImageLike(img, usersData)
        .then((rest) => {
          let data = likes
          let likeResponse = !data ? null : data.some(user => user._id === usersData.id)
          if (likeResponse) {
            let o = data.findIndex(i => i._id === usersData.id)
            data.splice(o, 1);
            setLikes(data)
            setLikeStatus(false)
          } else {
            fetchImgLikes(img)
            setLikeStatus(true)
          }
        })
    } else {
      props.postVideoLike(img, usersData)
        .then((rest) => {
          let data = likes
          let likeResponse = !data ? null : data.some(user => user._id === usersData.id)
          if (likeResponse) {
            let o = data.findIndex(i => i._id === usersData.id)
            data.splice(o, 1);
            setLikes(data)
            setLikeStatus(false)
          } else {
            setLikeStatus(true)
            fetchVideoLikes(img)
          }
        })
    }
  }
  const fetchImgLikes = (img) => {
    let userId = JSON.parse(localStorage.getItem("id"))
    let imgId = img;
    const bearer = 'Bearer ' + localStorage.getItem("token");
    return fetch(baseUrl + `likes/get-i-like-it/${userId}/${imgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin"
    })
      .then(data => data.json())
      .then(json => {
        setLikes(json)
      })
      .catch(err => {
        setE(err)
      })
  }
  const fetchVideoLikes = (img) => {
    let userId = JSON.parse(localStorage.getItem("id"))
    let imgId = img;
    const bearer = 'Bearer ' + localStorage.getItem("token");
    return fetch(baseUrl + `likes/get-i-like-it-video/${userId}/${imgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin"
    })
      .then(data => data.json())
      .then(json => {
        setLikes(json)
      })
      .catch(err => {
        setE(err)
      })
  }
  const deleteComments = (ID) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + `comments/get-comments-image/${ID}`, {
      method: "DELETE",
      headers: {
        'Authorization': bearer,
        "Content-Type": "application/json"
      }
    })
      .then(data => data.json())
      .then(json => {
        setComentarios(comentarios.filter(item => item._id !== json._id))
      })
      .catch(err => {
        console.log(err);
      })
  }
  const deletePhotograph = (imgId, tag) => {
    var config = {
      userid: JSON.parse(localStorage.getItem("id")),
      imageid: imgId
    }
    if (tag === "imagen") {
      props.removePhotograph(config)
      props.history.push("/userpage");
      window.location.reload();
    } else {
      props.removeVideo(config)
      props.history.push("/userpage");
      window.location.reload();
    }

  }
  const controlPostMessage = (e) => {
    const target = e.target;
    const value = target.value;
    setActive(value)
  }
  const toggleModal = (e) => {
    e.preventDefault();
    setIsLikesModalOpen(!isLikesModalOpen);
  }
  const play = (e) => {
    if (!activeVideo) e.target.play()
    if (activeVideo) e.target.pause()
    setActiveVideo(!activeVideo)
  }
  const show = () => {
    setActiveVideo(!activeVideo)
  }
  const imagenes = !data ? null : data;
  const likesSample = !likes ? [] : likes;
  const commen = !comentarios ? [] : comentarios;
  let filtrado = JSON.parse(localStorage.getItem("id"));
  let trashButton = !imagenes ? null : imagenes.userData._id === filtrado
  let usuario = props.user.user ? props.user.user.usuario : null
  let ext = !imagenes ? null : imagenes.filename.split('.')
  let typeExt = !ext ? null : ext[ext.length - 1]
  let mapeo = !imagenes ? [] : imagenes
  if (e) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.error}</h4>
        </div>
      </div>
    );
  }
  else {
    return (
      <div>
        {
          typeExt === "png" || typeExt === "jpg" || typeExt === "jpeg" || typeExt === "gif" || typeExt === "ico" ?
            <Modalidad>
              <LikesModal isLikesModalOpen={isLikesModalOpen} toggle={toggleModal} likes={likes} usuario={usuario} />
              <div className="modalgroup">
                <div className="c">
                  <div className="access-buttons-media">
                    <div className="back-grid">
                      <span className="fa fa-angle-left cursor" onClick={() => window.history.back()}></span>
                    </div>

                    <div className="trashIcon">
                      {trashButton ?
                        <Button id="trashId"><span className=" fa fa-trash-alt " onClick={() => deletePhotograph(mapeo._id, "imagen")}></span></Button>
                        : null
                      }
                    </div>
                  </div>
                  <img src={`${baseUrl}${mapeo.filename}`} alt={mapeo._id} className="resp" />
                </div>
                <div className="modalComments">
                  <div className="comm">
                    <RenderComments comentarios={commen} deleteComments={deleteComments} usuario={usuario} />
                  </div>
                  <div className="comm-likes">
                    {
                      likesSample.length === 1
                        ?
                        <h6 style={{ marginLeft: "10px" }}><strong id="likemodal" className="cursor" onClick={(e) => toggleModal(e)} >{likesSample.length} person like it.</strong></h6>
                        :
                        likesSample.length > 1
                          ?
                          <h6 style={{ marginLeft: "10px" }}><strong id="likemodal" className="cursor" onClick={(e) => toggleModal(e)} >{likesSample.length} people like it.</strong></h6>
                          :
                          <h6 style={{ marginLeft: "10px" }}>Be the first to like.</h6>
                    }
                  </div>

                  <LocalForm onSubmit={(values, event) => handleSubmit(values, event)} id={!mapeo ? null : mapeo._id}>
                    <div className="foot">
                      <div className="texto">
                        <Control.textarea model=".comment" id="comment" className="textarea" value={active} onChange={(e) => controlPostMessage(e)} />
                      </div>
                      <div className="footButtons">
                        <div>
                          <Button onClick={(event) => handleLike(event, mapeo._id, "imagen")}>
                            {
                              likeStatus
                                ?
                                <span className="fa fa-heart" style={{ color: 'red' }}></span>
                                :
                                <span className="fa fa-heart" ></span>

                            }
                          </Button>
                        </div>
                        <div className="" >
                          {active.length === 0 || active.length > 140 ?
                            <Button type="submit" disabled><span className="fas fa-paper-plane"></span></Button>
                            :
                            <Button type="submit"><span className="fas fa-paper-plane"></span></Button>
                          }
                        </div>
                      </div>
                    </div>
                  </LocalForm>




                </div>
              </div>
            </Modalidad>
            :
            <Modalidad>
              <LikesModal isLikesModalOpen={isLikesModalOpen} toggle={toggleModal} likes={likes} usuario={usuario} />
              <div className="modalgroup">
                <div className="imagen-component">
                  <div className="access-buttons-media">
                    <div className="back-grid">
                      <span className="fa fa-angle-left cursor" onClick={() => window.history.back()}></span>
                    </div>

                    <div className="trashIcon">
                      {trashButton ?
                        <Button id="trashId"><span className=" fa fa-trash-alt " onClick={() => deletePhotograph(mapeo._id, "video")}></span></Button>
                        : null
                      }
                    </div>
                  </div>
                  <div className="video-media-items">
                    <span className={"fa fa-play play-icon-start " + (activeVideo ? "play-video" : " ")} style={{ color: '#e4e4e4', fontSize: '8vw' }}></span>
                    <video src={`${baseUrl}${mapeo.filename}`} alt={mapeo._id}
                      className="responsive"
                      onClick={(e) => play(e)}
                      onEnded={() => show()} />
                  </div>
                </div>
                <div className="modalComments">
                  <div className="comm">
                    <RenderComments comentarios={commen} deleteComments={deleteComments} usuario={usuario} />
                  </div>
                  <div className="comm-likes">
                    {
                      likesSample.length === 1
                        ?
                        <h6 style={{ marginLeft: "10px" }}><strong id="likemodal" className="cursor" onClick={(e) => toggleModal(e)} >{likesSample.length} person like it.</strong></h6>
                        :
                        likesSample.length > 1
                          ?
                          <h6 style={{ marginLeft: "10px" }}><strong id="likemodal" className="cursor" onClick={(e) => toggleModal(e)} >{likesSample.length} people like it.</strong></h6>
                          :
                          <h6 style={{ marginLeft: "10px" }}>Be the first to like.</h6>
                    }
                  </div>

                  <LocalForm onSubmit={(values, event) => handleSubmit(values, event)} id={!mapeo ? null : mapeo._id}>
                    <div className="foot">
                      <div className="texto">
                        <Control.textarea model=".comment" id="comment" className="textarea" value={active} onChange={(e) => controlPostMessage(e)} />
                      </div>
                      <div className="footButtons">
                        <div>
                          <Button onClick={(event) => handleLike(event, mapeo._id, "video")}>
                            {
                              likeStatus
                                ?
                                <span className="fa fa-heart" style={{ color: 'red' }}></span>
                                :
                                <span className="fa fa-heart"></span>

                            }
                          </Button>
                        </div>
                        <div className="" >
                          {active.length === 0 || active.length > 140 ?
                            <Button type="submit" disabled><span className="fas fa-paper-plane"></span></Button>
                            :
                            <Button type="submit"><span className="fas fa-paper-plane"></span></Button>
                          }
                        </div>
                      </div>
                    </div>
                  </LocalForm>




                </div>
              </div>
            </Modalidad>
        }

      </div>
    )
  }
})

const Modalidad = styled.div`
display: flex;
flex-direction: row;
justify-content: center;

div.modalgroup {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height:85vh;
  width:70%;
}
div.modalComments {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 32%;
  margin-left: 10px;
}
div.c {
  width: 63%;
}
div.foot {
  display: flex;
  flex-direction: row; 
}
textarea {
  width:100%;
  height: 100%;
}
div.footButtons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.foot Button {
  color: black;
  background-color: transparent;
}
div.comm {
  height: 80%;
  width: 100%;
  display: block;
  overflow-y: scroll;
  scroll-behavior: smooth;
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
@media (max-width: 747px) {
  div.modalgroup {
    display: inline-block;
    width: 100%;
    margin-top: -21px;
  }
  div.modalComments {
    display: flex;
    justify-content: stretch;
    flex-direction: column-reverse;
    width: 100%;
    margin: 0px;
  }
  div.comm-likes  {
    margin: 15px auto auto 20px
  }
  div.comm  {
    margin-top: 8px;
    display: flex;
    justify-content: start
    max-height: 300px;
  }
  div.foot{
    display: flex;
    justify-content:stretch;
  }
  .texto {
    width:100%;
  }
  div.c {
    display:inline-block
    width: 100%;
  }
  .trashIcon {
    display: none;
    position: absolute;
    left: auto;
    right: 0%;
    z-index: 10;
}
  .back-grid {
    color: darkgrey;
    width: 20px;
    height: 20px;
    font-size: 1.7em;
    position: fixed;
    left: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 65px;
    z-indez: 10;
  }
  img.resp {
    width: 100%;
    object-fit: fit;
  }
}
}
`
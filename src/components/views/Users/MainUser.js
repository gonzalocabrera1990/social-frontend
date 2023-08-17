import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  Form,
  Label,
  Input,
  Button, Modal, ModalBody, ModalHeader, ModalFooter,
  Nav, NavItem, NavLink
} from 'reactstrap';
import classnames from 'classnames';
import styled from 'styled-components'
import { RenderComments } from '../../CommentComponent';
import { LikesModal } from '../../LikesModal';
import { Loading } from '../../LoadingComponent';
import { baseUrl } from '../../../shared/baseUrl';
import { getHelper, postHelperBody, deleteHelper } from '../../../redux/fetchsHelpers'

function useWindowSize() {
  const [size, setSize] = useState([0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export const MainUser = withRouter((props) => {
  const [image, setImage] = useState(null)
  const [imageShowen, setImageShowen] = useState(null)
  const [loadWall, setLoadWall] = useState(null)
  const [duration, setDuration] = useState(0)
  const [loadWallType, setLoadWallType] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false)
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false)
  const [likes, setLikes] = useState([])
  const [i, setI] = useState('')
  const [modalType, setModalType] = useState(null)
  const [arraySource, setArraySource] = useState([])
  const [videoArraySource, setVideoArraySource] = useState([]);
  const [imgID, setImgID] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [active, setActive] = useState('')
  const [e, setE] = useState(null)
  const [isItAVideo, setisItAVideo] = useState(false)


  useEffect(() => {
    if (props.user.user) {
      let sourced = props.user.user.imagesWall.map(img => `${baseUrl}${img.filename}`)
      let videosSourced = props.user.user.videosWall.map(vid => `${baseUrl}${vid.filename}`)
      setArraySource(sourced)
      setVideoArraySource(videosSourced)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleimg = (e) => {
    e.preventDefault();
    let loadProfile = e.target.files[0];
    let showImg = URL.createObjectURL(e.target.files[0]);

    setImage(loadProfile)
    setImageShowen(showImg)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const filedata = new FormData();
    filedata.append('image', image, image.name);
    let ID = props.auth.user.username;
    props.imagenUser(ID, filedata)
  }

  //ENVIA LOS DATOS A REDUX PARA LAS IMAGENES DEL MURO
  //CARGA LA IMAGEN EN EL STATE DESDE EL FORM PARA LAS IMAGENS DEL MURO
  var myVideos = [];

  window.URL = window.URL || window.webkitURL;


  const setFileInfo = (e) => {
    let idfoto = e.target.id
    myVideos.length = 0;
    setLoadWallType(idfoto)
    if (idfoto === "story") {
      let files = !e.target.files[0] ? null : e.target.files[0];
      let mediaType = !files ? null : files.type.split('/')[0]
      if (mediaType === "image") handleWallimg(e)
      if (mediaType === "video") Wallvid(e)
    } else if (idfoto === "video") {
      Wallvid(e)
    } else if (idfoto === "imagen") {
      handleWallimg(e);
    }
  }
  function Wallvid(e) {
    var files = !e.target.files[0] ? null : e.target.files[0]
    let loadingType = !files ? null : files.type.split('/')[0]
    if (loadingType === "video") {
      myVideos.push(files);
      var video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        var duration = video.duration;
        myVideos[myVideos.length - 1].duration = duration;
        handleWallvid(e);
      }
      video.src = URL.createObjectURL(files);
    } else {
      setIsFormatModalOpen(true)
    }
  }

  function handleWallvid(e) {
    var testing = myVideos[0].duration;
    if (testing <= 60) {
      let loadingImgWall = e.target.files[0];
      setLoadWall(loadingImgWall)
      setDuration(testing * 1000)
    } else {
      setIsTimeModalOpen(true)
    }
  }

  const handleWallimg = (e) => {
    let loadingImgWall = !e.target.files[0] ? null : e.target.files[0];
    let loadingType = !loadingImgWall ? null : loadingImgWall.type.split('/')[0]
    if (loadingType === "video") {
      setIsFormatModalOpen(true)
    } else {
      setLoadWall(loadingImgWall)
      setDuration(10000)
    }

  }

  const handleWallSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('image', loadWall, loadWall.name);
    fd.append('duration', duration);
    let ID = JSON.parse(localStorage.getItem("id"))
    if (loadWallType === "video" || loadWallType === "imagen") {
      props.imagenWall(ID, fd)
    }
    if (loadWallType === "story") {
      props.storiesCreator(ID, fd)
        .then((f) => {
          window.location.reload();
        });
    }
  }

  const toggleModal = (e, id, modalValue) => {
    if (modalValue === "wall") {
      setisItAVideo(false)
      setIsModalOpen(!isModalOpen)
      setI(e.target.src)
      setModalType(e.target.id)
      setImgID(id)

      fetchComments(id);
      fetchImgLikes(id);
    } else if (modalValue === "profile") {
      setisItAVideo(false)
      setIsModalOpen(!isModalOpen)
      setI(e.target.src)
      setModalType(e.target.id)
      setImgID(id)

    }
    else if (modalValue === "video") {
      setisItAVideo(true)
      setIsModalOpen(!isModalOpen)
      setI(e.target.src)
      setModalType(e.target.id)
      setImgID(id)
      fetchComments(id);
      fetchVideoLikes(id);

    } else if (modalValue === "trashId") {
      setIsTrashModalOpen(!isTrashModalOpen)

    } else if (modalValue === "likemodal") {
      setIsLikesModalOpen(!isLikesModalOpen)

    } else if (modalValue === "trashIdOff") {
      setIsTrashModalOpen(false)

    }
    else {
      setIsModalOpen(false)
      setIsTrashModalOpen(false)
      setIsLikesModalOpen(false)
      setisItAVideo(false)
      setIsTimeModalOpen(false)
      setIsFormatModalOpen(false)
    }
  }

  const backForthModal = (e) => {
    let mode = e.target.id
    let currentlyUserId = JSON.parse(localStorage.getItem("id"))
    if (mode === "back") {
      let currentlyOne = i;
      let back = arraySource.indexOf(currentlyOne) - 1
      let elementBack = arraySource[back]

      setI(elementBack)

      fetchPhotoId(currentlyUserId, elementBack);
    } else {
      let currentlyOne = i;
      let forth = arraySource.indexOf(currentlyOne) + 1
      let elementForth = arraySource[forth]
      setI(elementForth)

      fetchPhotoId(currentlyUserId, elementForth);
    }
  }
  const backForthModalVideo = (e) => {
    let mode = e.target.id
    let currentlyUserId = JSON.parse(localStorage.getItem("id"))
    if (mode === "back") {
      let currentlyOne = i;
      let back = videoArraySource.indexOf(currentlyOne) - 1
      let elementBack = videoArraySource[back]

      setI(elementBack)
      fetchVideoId(currentlyUserId, elementBack);
    } else {
      let currentlyOne = i;
      let forth = videoArraySource.indexOf(currentlyOne) + 1
      let elementForth = videoArraySource[forth]

      setI(elementForth)
      fetchVideoId(currentlyUserId, elementForth);
    }
  }

  const fetchPhotoId = (ID, element) => {
    let bodyPath = element.split(baseUrl)[1]
    var config = {
      foto: bodyPath
    };
    // return fetch(baseUrl + `users/returnid/${ID}`, {
    //   method: "POST",
    //   body: JSON.stringify(config),
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // })
    //   .then(data => data.json())
      postHelperBody(`users/returnid/${ID}`, config)
      .then(response => {
        let result = response.result
        setImgID(result)
        return result;
      })
      .then((result) => {
        fetchComments(result)
        fetchImgLikes(result);
      })
      .catch(err => {
        setE(err)
      })
  }
  const fetchVideoId = (ID, element) => {
    let bodyPath = element.split(baseUrl)[1]
    var config = {
      foto: bodyPath
    };
    // return fetch(baseUrl + `users/returnid-video/${ID}`, {
    //   method: "POST",
    //   body: JSON.stringify(config),
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // })
    //   .then(data => data.json())
    postHelperBody(`users/returnid-video/${ID}`, config)
      .then(response => {
        let result = response.result
        setImgID(result)
        return result;
      })
      .then((result) => {
        fetchComments(result)
        fetchVideoLikes(result);
      })
      .catch(err => {
        setE(err)
      })
  }
  const fetchComments = (ID) => {
    // return fetch(baseUrl + `comments/get-comments-image/${ID}`)
    //   .then(data => data.json())
      getHelper(`comments/get-comments-image/${ID}`)
      .then(json => {
        setComentarios(json)
      })
      .catch(err => {
        setE(err)
      })
  }
  const fetchImgLikes = (img) => {
    let userId = JSON.parse(localStorage.getItem("id"))
    let imgId = img;
    // const bearer = 'Bearer ' + localStorage.getItem("token");
    // return fetch(baseUrl + `likes/get-i-like-it/${userId}/${imgId}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     'Authorization': bearer
    //   },
    //   credentials: "same-origin"
    // })
    //   .then(data => data.json())
    getHelper(`likes/get-i-like-it/${userId}/${imgId}`)
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
    // const bearer = 'Bearer ' + localStorage.getItem("token");
    // return fetch(baseUrl + `likes/get-i-like-it-video/${userId}/${imgId}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     'Authorization': bearer
    //   },
    //   credentials: "same-origin"
    // })
    //   .then(data => data.json())
    getHelper(`likes/get-i-like-it-video/${userId}/${imgId}`)
      .then(json => {
        setLikes(json)
      })
      .catch(err => {
        setE(err)
      })
  }
  const deleteComments = (ID) => {
    //const bearer = 'Bearer ' + localStorage.getItem('token');
    // return fetch(baseUrl + `comments/get-comments-image/${ID}`, {
    //   method: "DELETE",
    //   headers: {
    //     'Authorization': bearer,
    //     "Content-Type": "application/json"
    //   }
    // })
    //   .then(data => data.json())
    deleteHelper(`comments/get-comments-image/${ID}`)
      .then(json => {
        setComentarios(comentarios.filter(item => item._id !== json._id))
      })
      .catch(err => {
        setE(err)
      })
  }

  const deletePhotograph = () => {
    var config = {
      userid: JSON.parse(localStorage.getItem("id")),
      imageid: imgID
    }
    if (modalType === "video") {
      props.removeVideo(config)
      props.history.push("/userpage");
      window.location.reload();
    } else {
      props.removePhotograph(config)
      props.history.push("/userpage");
      window.location.reload();
    }
  }


  const handleCommentSubmit = (e) => {
    e.preventDefault()
    const comment = {
      comment: active,
      author: JSON.parse(localStorage.getItem("id")),
      image: imgID
    }
    props.commentsPost(comment)
      .then(sol => {
        setComentarios(comentarios.concat(sol))
        setActive('')
      })
  }
  const controlPostMessage = (e) => {
    const target = e.target;
    const value = target.value;
    setActive(value)
  }

  if (props.user.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.user.errMess || e) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.user.errMess}</h4>
        </div>
      </div>
    );
  } else {
    return (
      <div>

        <ImgProfile user={props.user.user}

          toggleModal={toggleModal}

          imageShowen={imageShowen}
          isItAVideo={isItAVideo}
          isModalOpen={isModalOpen} isTimeModalOpen={isTimeModalOpen} isFormatModalOpen={isFormatModalOpen} onSubmit={handleSubmit}
          source={i} handleimg={handleimg} imgProfileLoad={image}
          handleWallSubmit={handleWallSubmit} arraySource={arraySource} videoArraySource={videoArraySource} likes={likes}
          modalType={modalType} handlewallimg={setFileInfo} handleCommentSubmit={handleCommentSubmit}
          backForthModal={backForthModal} backForthModalVideo={backForthModalVideo} isTrashModalOpen={isTrashModalOpen} isLikesModalOpen={isLikesModalOpen}
          deletePhotograph={deletePhotograph} commentarios={comentarios} deleteComments={deleteComments}
          controlPostMessage={controlPostMessage} active={active} loadWall={loadWall}
        />
        <ImgWall imagesWall={props.user.user.imagesWall}
          videosWall={props.user.user.videosWall}
          handleWallSubmit={handleWallSubmit}
          handlewallimg={setFileInfo} toggleModal={toggleModal} />
      </div>
    )
  }
})

const ImgProfile = ({ user, toggleModal, imageShowen, isModalOpen, handleCommentSubmit, loadWall, isTimeModalOpen, isFormatModalOpen,
  onSubmit, source, handleimg, arraySource, videoArraySource, backForthModal, backForthModalVideo, isTrashModalOpen, likes, active, controlPostMessage,
  handleWallSubmit, handlewallimg, deletePhotograph, commentarios, deleteComments, isLikesModalOpen, modalType, isItAVideo }) => {
  const [activeVideo, setActiveVideo] = useState(false)
  const measure = (timestamp) => {
    let inicio = new Date(timestamp).getTime();
    let now = Date.now();
    let res = now - inicio;
    const hours = (Math.floor((res) / 1000)) / 3600;
    return hours;
  }
  const storyMeasure = !user ? false : user.stories.some(h => measure(h.timestamp) <= 24)
  let textInput = useRef(null);
  function handleClick() {
    textInput.current.click();
  }
  let textInputVideo = useRef(null);
  function handleClickVideo() {
    textInputVideo.current.click();
  }
  let textInputStory = useRef(null);
  function handleClickStory() {
    textInputStory.current.click();
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
      <ModalTime toggleModal={toggleModal} isTimeModalOpen={isTimeModalOpen} />
      <ModalFormat toggleModal={toggleModal} isFormatModalOpen={isFormatModalOpen} />
      <Modal isOpen={isModalOpen} toggle={() => toggleModal('', '', '')} size="lg" >

        {modalType === "profile" ?
          <div className="modalprofile">
            <Form onSubmit={onSubmit} encType="multipart/form-data">
              <ModalBody >
                <Label htmlFor="img">
                  <div className="imagina">
                    {imageShowen === null ?
                      <div className="hovertextfather" >
                        <h6 className="hovertext">Click To Change Your Profile Picture</h6>
                      </div>
                      : null
                    }
                    <img src={imageShowen !== null ? imageShowen : source} alt="wall grid" className="w-100 h-100 mh-30 juajua" />
                  </div>
                  <Input
                    type="file"
                    id="img"
                    name="image"
                    className="btn-success"
                    onChange={handleimg}
                    style={{ display: "none" }}
                  />
                  <div className=" row foot" style={imageShowen !== null ? { display: "flex", alignItems: "center", justifyContent: "center" } : { display: "none" }}>
                    <Button type="submit" onClick={onSubmit} style={{ position: "absolute" }}>Change</Button>
                  </div>
                </Label>
              </ModalBody>
            </Form>
          </div>
          : modalType === "video" ?
            <div>
              <div className="cursor" style={isModalOpen && modalType === "video" && videoArraySource.indexOf(source) !== 0 ?
                { color: "black", fontSize: "40px", position: "absolute", left: "-50px", top: "40%", zIndex: "1" } : { display: "none" }}>
                <span className="fas fa-angle-left" id="back" onClick={(event) => backForthModalVideo(event)}></span>
              </div>
              <div className="cursor" style={isModalOpen && modalType === "video" && videoArraySource.indexOf(source) !== videoArraySource.length - 1 ?
                { color: "", fontSize: "40px", position: "absolute", right: "-50px", top: "40%", zIndex: "1" } : { display: "none" }}>
                <span className="fas fa-angle-right" id="forth" onClick={(event) => backForthModalVideo(event)}></span>
              </div>
              <Form onSubmit={(event) => handleCommentSubmit(event)}>
                <ModalBody className="modalWithoutPadding">
                  <LikesModal isLikesModalOpen={isLikesModalOpen} toggle={toggleModal} likes={likes} usuario={user.usuario} />
                  <Modalidad>
                    <div className="modalgroup">
                      <div className="c">
                        <div className="access-buttons-media">
                          <div className="trashIcon">
                            <Button onClick={(e) => toggleModal(e, null, "trashId")}><span className=" fa fa-trash-alt "></span></Button>
                          </div>
                        </div>
                        <div className="video-media-items">
                          <span className={"fa fa-play play-icon-start " + (activeVideo ? "play-video" : " ")} style={{ color: '#e4e4e4', fontSize: '8vw' }}></span>
                          <video className="resp" src={source} alt="wall grid"
                            onClick={(e) => play(e)}
                            onEnded={() => show()} />
                        </div>
                      </div>
                      <div className="modalComments">
                        <div className="comm">
                          <RenderComments comentarios={commentarios} deleteComments={deleteComments} usuario={user.usuario} />
                        </div>
                        <div>
                          {
                            likes.length === 1
                              ?
                              <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => toggleModal(event, null, "likemodal")} >{likes.length} person like it.</strong></h6>
                              :
                              likes.length > 1
                                ?
                                <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => toggleModal(event, null, "likemodal")} >{likes.length} people like it.</strong></h6>
                                :
                                <h6 style={{ marginLeft: "10px" }}>Be the first to like.</h6>
                          }
                        </div>
                        <div className="foot">
                          <div className="texto">
                            <Input type="textarea" className="h-100" model=".comment" id="comment" value={active} onChange={(e) => controlPostMessage(e)} />
                          </div>
                          <div className="footButtons">
                            <div className="buton btn-sm h-100" >
                              {active.length === 0 || active.length > 140 ?
                                <Button type="submit" className="btn-sm h-100" disabled><span className="fas fa-paper-plane"></span></Button>
                                :
                                <Button type="submit" className="btn-sm h-100"><span className="fas fa-paper-plane"></span></Button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modalidad>
                </ModalBody>
              </Form>
            </div>
            :
            <div>
              <div className="cursor" style={isModalOpen && modalType === "wall" && arraySource.indexOf(source) !== 0 ?
                { color: "black", fontSize: "40px", position: "absolute", left: "-50px", top: "40%", zIndex: "1" } : { display: "none" }}>
                <span className="fas fa-angle-left" id="back" onClick={(event) => backForthModal(event)}></span>
              </div>
              <div className="cursor" style={isModalOpen && modalType === "wall" && arraySource.indexOf(source) !== arraySource.length - 1 ?
                { color: "", fontSize: "40px", position: "absolute", right: "-50px", top: "40%", zIndex: "1" } : { display: "none" }}>
                <span className="fas fa-angle-right" id="forth" onClick={(event) => backForthModal(event)}></span>
              </div>
              <Form onSubmit={(event) => handleCommentSubmit(event)}>
                <ModalBody className="modalWithoutPadding">
                  <LikesModal isLikesModalOpen={isLikesModalOpen} toggle={toggleModal} likes={likes} usuario={user.usuario} />
                  <Modalidad>
                    <div className="modalgroup">
                      <div className="c">
                        <div className="access-buttons-media">
                          <div className="trashIcon">
                            <Button onClick={(e) => toggleModal(e, null, "trashId")}><span className=" fa fa-trash-alt "></span></Button>
                          </div>
                        </div>
                        <img className="resp" src={source} alt="wall grid" />
                      </div>
                      <div className="modalComments">
                        <div className="comm">
                          <RenderComments comentarios={commentarios} deleteComments={deleteComments} usuario={user.usuario} />
                        </div>
                        <div>
                          {
                            likes.length === 1
                              ?
                              <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => toggleModal(event, null, "likemodal")} >{likes.length} person like it.</strong></h6>
                              :
                              likes.length > 1
                                ?
                                <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => toggleModal(event, null, "likemodal")} >{likes.length} people like it.</strong></h6>
                                :
                                <h6 style={{ marginLeft: "10px" }}>Be the first to like.</h6>
                          }
                        </div>
                        <div className="foot">
                          <div className="texto">
                            <Input type="textarea" className="h-100" model=".comment" id="comment" value={active} onChange={(e) => controlPostMessage(e)} />
                          </div>
                          <div className="footButtons">
                            <div className="buton btn-sm h-100" >
                              {active.length === 0 || active.length > 140 ?
                                <Button type="submit" className="btn-sm h-100" disabled><span className="fas fa-paper-plane"></span></Button>
                                :
                                <Button type="submit" className="btn-sm h-100"><span className="fas fa-paper-plane"></span></Button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modalidad>
                </ModalBody>
              </Form>
            </div>
        }


        <ModalExample isTrashModalOpen={isTrashModalOpen} toggleModal={toggleModal} deletePhotograph={deletePhotograph} />
      </Modal>
      <div className="container ">
        <ProfileImage>
          <div className="image-content cursor">
            <canvas className="outos" />
            <img
              src={baseUrl + user.image.filename}
              alt={user._id}
              value={imageShowen}
              id="profile"
              className={"img-thumbnail " + (storyMeasure ? "active-story" : '')}
              onClick={(e) => toggleModal(e, user._id, "profile")}
            />
          </div>


        </ProfileImage>


        <div className="user-info">
          <div className="user-info-description">
            <h5 className="">{user.firstname} {user.lastname}</h5>
            <h5 className="">{`"${user.phrase}"`}</h5>
            <h5 className="">{user.followers.length} Followers - {user.following.length} Following</h5>
          </div>
          <div>
            {loadWall === null ?
              <div className="media-botonera">
                <div className="user-info-post">

                  <div>
                    <input
                      type="file"
                      id="imagen"
                      name="image"
                      onChange={handlewallimg}
                      ref={textInput}
                      style={{ display: "none" }}
                    />
                    <button className="fa fa-image fa-md" onClick={handleClick} />
                  </div>
                </div>

                <div className="user-info-post">

                  <div>
                    <input
                      type="file"
                      id="video"
                      name="image"
                      onChange={handlewallimg}
                      ref={textInputVideo}
                      style={{ display: "none" }}
                    />
                    <button className="fa fa-film fa-md" onClick={handleClickVideo} />
                  </div>
                </div>

                <div className="user-info-post">
                  <div>
                    <input
                      type="file"
                      id="story"
                      name="image"
                      onChange={handlewallimg}
                      ref={textInputStory}
                      style={{ display: "none" }}
                    />
                    <button className="fa fa-video fa-md" onClick={handleClickStory} />
                  </div>
                </div>
              </div>
              : loadWall.name !== undefined ?
                <Form onSubmit={handleWallSubmit} encType="multipart/form-data" >
                  <Button onClick={handleWallSubmit}>Enviar</Button>
                </Form>
                : null

            }
          </div>
        </div>
      </div>
    </div>
  )
}
const ImgWall = ({ imagesWall, videosWall, handleWallSubmit, handlewallimg, toggleModal }) => {
  const [activeTab, setActiveTab] = useState('1')
  const [width] = useWindowSize();

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  let screen = width >= 600 ? true : false
  const Imagenes =
    imagesWall && screen ?
      imagesWall.map((img) => {
        return (
          <div className="image-content cursor" key={img._id}>
            <img className="img-thumbnail img-grid" id="wall" src={baseUrl + img.filename} alt={img._id} onClick={(e) => toggleModal(e, img._id, "wall")} />
          </div>
        )
      })
      :
      imagesWall.map((img) => {
        return (
          <div className="image-content" key={img._id}>
            <Link to={`/view/imagenwall/${img._id}`}>
              <img className="img-thumbnail img-grid" id="wall" src={baseUrl + img.filename} alt={img._id} onClick={(e) => toggleModal(e, img._id, "wall")} />
            </Link>
          </div>
        )
      })
  const Videos =
    videosWall && screen ?
      videosWall.map((vid) => {
        return (
          <div className="image-content cursor" key={vid._id}>
            <video className="img-thumbnail img-grid" id="video" src={baseUrl + vid.filename} alt={vid._id} onClick={(e) => toggleModal(e, vid._id, "video")} />
          </div>
        )
      })
      :
      videosWall.map((vid) => {
        return (
          <div className="image-content" key={vid._id}>
            <Link to={`/view/imagenwall/${vid._id}`}>
              <video className="img-thumbnail img-grid" id="video" src={baseUrl + vid.filename} alt={vid._id} onClick={(e) => toggleModal(e, vid._id, "video")} />
            </Link>
          </div>
        )
      })


  return (
    <div>
      <div className="wall-container mediatab">
        <Nav tabs className="row h-5 mediatab">
          <NavItem className="col-6 cursor">
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Images
            </NavLink>
          </NavItem>
          <NavItem className="col-6 cursor">
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              Videos
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <div className={(activeTab === '1' ? "wall-container" : 'desactivado')}>
        {Imagenes}
      </div>
      <div className={(activeTab === '2' ? "wall-container" : 'desactivado')}>
        {Videos}
      </div>
    </div>
  )
}

const ModalExample = (props) => {


  return (
    <div>
      <Modal isOpen={props.isTrashModalOpen} >
        <ModalHeader >Delete Photograph</ModalHeader>
        <ModalBody >
          Are you sure you want to DELETE this?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={props.deletePhotograph}>Delete Photo</Button>{' '}
          <Button color="secondary" onClick={(event) => props.toggleModal(event, null, "trashId")}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
const ModalTime = (props) => {


  return (
    <div>
      <Modal isOpen={props.isTimeModalOpen} >
        <ModalHeader >Exceeded Duration</ModalHeader>
        <ModalBody >
          The video you tried to post exceeds the maximum length of 1 minute. Please try another video.        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => props.toggleModal('', '', '')} >Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
const ModalFormat = (props) => {


  return (
    <div>
      <Modal isOpen={props.isFormatModalOpen}>
        <ModalHeader >Format file error.</ModalHeader>
        <ModalBody >
          Please try another file or, choose and press another button.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => props.toggleModal('', '', '')} >Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

const Modalidad = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;

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
video.resp {
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
  @media (max-width: 991px) {
    div.modalComments {
      display: none;
    }
    div.modalgroup {
      padding-right: 0;
    }
  }
`
const ProfileImage = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
.image-content {
  width: 21vw;
  height: 21vw;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 0 35px rgba(0, 0, 0, 0.854);
  transition-duration: .3s;
}
img:hover {
  transform: scale(1.03);
}
`

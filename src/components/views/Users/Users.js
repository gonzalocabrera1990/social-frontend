import React, { useLayoutEffect, useState, useEffect } from 'react';
import styled from 'styled-components'
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, Button, Nav, NavItem, NavLink } from 'reactstrap';
import { Control, LocalForm } from 'react-redux-form';
import { RenderComments } from '../../CommentComponent';
import { LikesModal } from '../../LikesModal';
import { Loading } from '../../LoadingComponent';
import { baseUrl } from '../../../shared/baseUrl';

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

export const UsersComponent = (props) => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(false);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [i, setI] = useState(null);
    const [arraySource, setArraySource] = useState([]);
    const [videoArraySource, setVideoArraySource] = useState([]);
    const [comentarios, setComentarios] = useState();
    const [imgID, setImgID] = useState(null);
    const [likes, setLikes] = useState([]);
    const [active, setActive] = useState('');
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null)
    const [activeVideo, setActiveVideo] = useState(false)


    useEffect(() => {
        setLoading(true)
        setIsModalOpen(false)
        setIsLikesModalOpen(false)
        const ID = {
            host: props.match.params.idhost,
            user: props.match.params.idusers
        }
        let currentUser = !props.user.user ? null : props.user.user.usuario
        if (ID.user === currentUser) {
            props.history.push("/userpage")
            return;
        }
        props.fetchDataUser(ID)

    }, [props.match.params.idhost, props.match.params.idusers]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let userResponse = !props.users ? null : props.users.users
        if (userResponse) {
            let following = userResponse.followers.some(foll => foll.id._id === JSON.parse(localStorage.getItem('id')) ? true : false);

            if (!userResponse.publicStatus) {
                let sourced = userResponse.imagesWall.map(img => `${baseUrl}${img.filename}`)
                let sourcedVideo = userResponse.videosWall.map(vid => `${baseUrl}${vid.filename}`)
                setResults([userResponse]);
                setArraySource(sourced);
                setVideoArraySource(sourcedVideo)
                setLoading(false)
            } else if (userResponse.publicStatus && following) {
                let sourced = userResponse.imagesWall.map(img => `${baseUrl}${img.filename}`)
                let sourcedVideo = userResponse.videosWall.map(vid => `${baseUrl}${vid.filename}`)

                setResults([userResponse]);
                setArraySource(sourced);
                setVideoArraySource(sourcedVideo)
                setLoading(false)

            } else {
                setResults([userResponse]);
                setLoading(false)
            }
        }
    }, [props.users])

    useEffect(() => {
        let likesPhoto = !props.likes ? [] : props.likes
        setLikes(likesPhoto)
    }, [props.likes])
    //   useEffect(() => {
    //     const ID = { host: props.match.params.idhost,
    //         user: props.match.params.idusers
    //      }
    //      let currentUser = !props.user.user ? null : props.user.user.usuario
    //     if (ID.user === currentUser) {
    //         props.history.push("/userpage")
    //         return;
    //       }
    //   }, [props.user]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleFollow = (followerId) => {
        const followingId = props.user.user._id;
        const userData = followerId
        props.followFetch(followingId, userData)
            .then(() => {
                const ID = {
                    host: props.match.params.idhost,
                    user: props.match.params.idusers
                }
                props.fetchDataUser(ID)
            })
    }

    const backForthModal = (e) => {
        e.preventDefault();
        let mode = e.target.id
        let currentlyUserId = results[0]._id;//id del usuario
        if (mode === "back") {
            let currentlyOne = i;
            let back = arraySource.indexOf(currentlyOne) - 1
            let elementBack = arraySource[back]
            setI(elementBack)
            fetchPhotoId(e, currentlyUserId, elementBack);
        } else {
            let currentlyOne = i;
            let forth = arraySource.indexOf(currentlyOne) + 1
            let elementForth = arraySource[forth]
            setI(elementForth)
            fetchPhotoId(e, currentlyUserId, elementForth);
        }
    }
    const backForthModalVideo = (e) => {
        e.preventDefault();
        let mode = e.target.id
        let currentlyUserId = results[0]._id;//id del usuario
        if (mode === "back") {
            let currentlyOne = i;
            let back = videoArraySource.indexOf(currentlyOne) - 1
            let elementBack = videoArraySource[back]
            setI(elementBack)
            fetchVideoId(e, currentlyUserId, elementBack);
        } else {
            let currentlyOne = i;
            let forth = videoArraySource.indexOf(currentlyOne) + 1
            let elementForth = videoArraySource[forth]
            setI(elementForth)
            fetchVideoId(e, currentlyUserId, elementForth);
        }
    }

    const toggleModal = (e, valueId) => {
        e.preventDefault();
        var mgID = e.target.id;//id imagen
        if (valueId === "imagen") {
            setIsModalOpen(!isModalOpen)
            setI(e.target.src)
            setImgID(mgID)
            setModalType(valueId)
            fetchComments(mgID)
            fetchUsersLikes(e, mgID, valueId);
        } else if (valueId === "likemodal") {
            setModalType(valueId)
            setIsLikesModalOpen(!isLikesModalOpen);
        } else if (valueId === "video") {
            setIsModalOpen(!isModalOpen)
            setI(e.target.src)
            setModalType(valueId)
            setImgID(mgID)
            fetchComments(mgID)
            fetchUsersLikes(e, mgID, valueId);
        } else {
            setIsModalOpen(false)
            setModalType('')
            setIsLikesModalOpen(false)
        }
    }

    const fetchPhotoId = (e, ID, element) => {
        let bodyPath = element.split(baseUrl)[1]
        var config = {
            foto: bodyPath
        };
        return fetch(baseUrl + `users/returnid/${ID}`, {
            method: "POST",
            body: JSON.stringify(config),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(data => data.json())
            .then(response => {

                let result = response.result
                setImgID(result)
                return result;
            })
            .then((result) => {
                fetchComments(result)
                fetchUsersLikes(e, result, "imagen")
            })
            .catch(err => {
                setLoading(false)
                setError(err)
            })
    }
    const fetchVideoId = (e, ID, element) => {
        let bodyPath = element.split(baseUrl)[1]
        var config = {
            foto: bodyPath
        };
        return fetch(baseUrl + `users/returnid-video/${ID}`, {
            method: "POST",
            body: JSON.stringify(config),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(data => data.json())
            .then(response => {

                let result = response.result
                setImgID(result)
                return result;
            })
            .then((result) => {
                fetchComments(result)
                fetchUsersLikes(e, result, "video")
            })
            .catch(err => {
                setLoading(false)
                setError(err)
            })
    }
    const fetchComments = (ID) => {
        return fetch(baseUrl + `comments/get-comments-image/${ID}`)
            .then(data => data.json())
            .then(json => {
                setComentarios(json)
            })
            .catch(err => {
                setError(err)
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
                let resultsComments = comentarios.filter(item => item._id !== json._id)
                setComentarios(resultsComments)
            })
            .catch(err => {
                setError(err)
            })
    }
    const handleSubmit = (values) => {
        const comment = {
            comment: values.comment,
            author: localStorage.getItem("id"),
            image: imgID
        }
        props.commentsPost(comment)
            .then(result => {
                let concatComments = comentarios.concat(result)
                setComentarios(concatComments)
                setActive('');
            })
    }
    const controlPostMessage = (e) => {
        const target = e.target;
        const value = target.value;
        setActive(value);
    }
    const handleLike = (event, tag) => {
        event.preventDefault();
        let img = imgID
        var usersData = {
            id: JSON.parse(localStorage.getItem('id')),
            liked: results[0]._id
        }
        if (tag === 'imagen') {
            props.postImageLike(img, usersData)
                .then(async () => {
                    fetchUsersLikes(event, img, tag);
                })
        } else {
            props.postVideoLike(img, usersData)
                .then(async () => {
                    fetchUsersLikes(event, img, tag);
                })
        }
    }

    const fetchUsersLikes = (event, mgID, tag) => {
        event.preventDefault();
        let userId = results[0]._id;
        if (tag === 'imagen') {
            props.fetchLikes(userId, mgID)
        } else {
            props.fetchVideoLikes(userId, mgID)
        }
    }
    function play(e) {
        if (!activeVideo) e.target.play()
        if (activeVideo) e.target.pause()
        setActiveVideo(!activeVideo)
    }
    const show = () => {
        setActiveVideo(!activeVideo)
    }

    let filtrado = JSON.parse(localStorage.getItem("id"));
    let usuario = props.user.user ? props.user.user.usuario : null
    let currentlyPictureId = !likes ? [] : likes.filter(user => user._id === filtrado)[0];

    if (loading) {
        return (
            <div className="container" >
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    } else if (props.user.errMess || error) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.user.errMess}</h4>
                    <h4>{error}</h4>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container-fluid ">
                <Modal isOpen={isModalOpen} toggle={(e) => toggleModal(e, "")} size="lg" >
                    <LikesModal isLikesModalOpen={isLikesModalOpen} toggle={toggleModal} likes={likes} usuario={usuario} />
                    {modalType === "imagen" ?
                        <div>
                            <div className="cursor" style={isModalOpen && arraySource.indexOf(i) !== 0 ?
                                { color: "black", fontSize: "40px", position: "absolute", left: "-50px", top: "40%", zIndex: "1" } : { display: "none" }}>
                                <span className="fas fa-angle-left" id="back" onClick={(event) => backForthModal(event)}></span>
                            </div>
                            <div className="cursor" style={isModalOpen && arraySource.indexOf(i) !== arraySource.length - 1 ?
                                { color: "", fontSize: "40px", position: "absolute", right: "-50px", top: "40%", zIndex: "1" } : { display: "none" }}>
                                <span className="fas fa-angle-right" id="forth" onClick={(event) => backForthModal(event)}></span>
                            </div>
                            <LocalForm onSubmit={(values) => handleSubmit(values)}>
                                <ModalBody className="modalWithoutPadding">
                                    <ModalGrid>
                                        <div className="modalgroup">
                                            <div className="c">
                                                <img className="resp" src={i} alt="wall grid" />
                                            </div>
                                            <div className="modalComments">
                                                <div className="comm">
                                                    <RenderComments comentarios={comentarios} deleteComments={deleteComments} usuario={usuario} />
                                                </div>
                                                <div>
                                                    {
                                                        likes.length === 1
                                                            ?
                                                            <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => toggleModal(event, "likemodal")} >{likes.length} person like it.</strong></h6>
                                                            :
                                                            likes.length > 1
                                                                ?
                                                                <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => toggleModal(event, "likemodal")} >{likes.length} people like it.</strong></h6>
                                                                :
                                                                <h6 style={{ marginLeft: "10px" }}>Be the first to like.</h6>
                                                    }
                                                </div>
                                                <div className="foot">
                                                    <div className="texto">
                                                        <Control.textarea className="h-100" model=".comment" id="comment" value={active} onChange={(e) => controlPostMessage(e)} />
                                                    </div>
                                                    <div className="footButtons">
                                                        <div className="ml-2">
                                                            <Button onClick={(event) => handleLike(event, "imagen")}>
                                                                {
                                                                    !currentlyPictureId
                                                                        ?
                                                                        <span className="fa fa-heart"></span>
                                                                        :
                                                                        <span className="fa fa-heart" style={{ color: 'red' }}></span>

                                                                }
                                                            </Button>
                                                        </div>
                                                        <div className="buton btn-sm" >
                                                            {active.length === 0 || active.length > 140 ?
                                                                <Button type="submit" className="" disabled><span className="fas fa-paper-plane"></span></Button>
                                                                :
                                                                <Button type="submit" className=""><span className="fas fa-paper-plane"></span></Button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ModalGrid>

                                </ModalBody>

                            </LocalForm>
                        </div>
                        : modalType === "video" ?
                            <div>
                                <div className="cursor" style={isModalOpen && videoArraySource.indexOf(i) !== 0 ?
                                    { color: "black", fontSize: "40px", position: "absolute", left: "-50px", top: "40%", zIndex: "1" } : { display: "none" }}>
                                    <span className="fas fa-angle-left" id="back" onClick={(event) => backForthModalVideo(event)}></span>
                                </div>
                                <div className="cursor" style={isModalOpen && videoArraySource.indexOf(i) !== videoArraySource.length - 1 ?
                                    { color: "", fontSize: "40px", position: "absolute", right: "-50px", top: "40%", zIndex: "1" } : { display: "none" }}>
                                    <span className="fas fa-angle-right" id="forth" onClick={(event) => backForthModalVideo(event)}></span>
                                </div>
                                <LocalForm onSubmit={(values) => handleSubmit(values)}>
                                    <ModalBody className="modalWithoutPadding">
                                        <ModalGrid>
                                            <div className="modalgroup">
                                                <div className="c">
                                                    <div className="video-media-items">
                                                        <span className={"fa fa-play play-icon-start " + (activeVideo ? "play-video" : " ")} style={{ color: '#e4e4e4', fontSize: '8vw' }}></span>
                                                        <video className="responsive"
                                                            src={i} alt="wall grid"
                                                            onClick={(e) => play(e)}
                                                            onEnded={() => show()} />
                                                    </div>
                                                </div>
                                                <div className="modalComments">
                                                    <div className="comm">
                                                        <RenderComments comentarios={comentarios} deleteComments={deleteComments} usuario={usuario} />
                                                    </div>
                                                    <div>{
                                                        likes.length === 1
                                                            ?
                                                            <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => toggleModal(event, "likemodal")} >{likes.length} person like it.</strong></h6>
                                                            :
                                                            likes.length > 1
                                                                ?
                                                                <h6 style={{ marginLeft: "10px" }}><strong className="cursor" onClick={(event) => toggleModal(event, "likemodal")} >{likes.length} people like it.</strong></h6>
                                                                :
                                                                <h6 style={{ marginLeft: "10px" }}>Be the first to like.</h6>
                                                    }</div>
                                                    <div className="foot">
                                                        <div className="texto">
                                                            <Control.textarea className="h-100" model=".comment" id="comment" value={active} onChange={(e) => controlPostMessage(e)} />
                                                        </div>
                                                        <div className="footButtons">
                                                            <div className="ml-2">
                                                                <Button onClick={(event) => handleLike(event, "video")}>
                                                                    {
                                                                        !currentlyPictureId
                                                                            ?
                                                                            <span className="fa fa-heart"></span>
                                                                            :
                                                                            <span className="fa fa-heart" style={{ color: 'red' }}></span>

                                                                    }
                                                                </Button>
                                                            </div>
                                                            <div className="buton btn-sm" >
                                                                {active.length === 0 || active.length > 140 ?
                                                                    <Button type="submit" className="" disabled><span className="fas fa-paper-plane"></span></Button>
                                                                    :
                                                                    <Button type="submit" className=""><span className="fas fa-paper-plane"></span></Button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ModalGrid>

                                    </ModalBody>

                                </LocalForm>
                            </div>
                            : null
                    }
                </Modal>
                <div>
                    <Render loading={loading} data={results} handleFollow={handleFollow}
                        followers={props.followers} toggle={toggleModal} error={error} />
                </div>
            </div>
        )
    }
}

const Render = (props) => {
    const [activeTab, setActiveTab] = useState('1')
    const [width] = useWindowSize();

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    const measure = (timestamp) => {
        let inicio = new Date(timestamp).getTime();
        let now = Date.now();
        let res = now - inicio;
        const hours = (Math.floor((res) / 1000)) / 3600;
        return hours;
    }

    let filtrado = JSON.parse(localStorage.getItem("id"));
    let screen = width >= 600 ? true : false
    let dataUsuario = !props.data[0] ? null : props.data
    let imagesWall = !props.data[0] ? null : props.data[0].imagesWall
    let videosWall = !props.data[0] ? null : props.data[0].videosWall
    const storiesNoSeen = !dataUsuario ? false : dataUsuario[0].stories.some(h => measure(h.timestamp) <= 24 && !h.views.some(v => v === filtrado))
    const storiesSeen = !dataUsuario ? false : dataUsuario[0].stories.some(h => measure(h.timestamp) <= 24 && h.views.some(v => v === filtrado))

    const USUARIOS = !dataUsuario ? null : dataUsuario.map(user => {
        let loading = props.loading === true ? true : false
        const foll = user.followers.some(foll => foll.id._id === JSON.parse(localStorage.getItem('id')) ? true : false);
        const noti = user.notifications.some(noti => noti.followingId === JSON.parse(localStorage.getItem('id')) ? true : false);
        return (
            <div key={user._id}>
                <ProfileImage className="">
                    {storiesNoSeen ?
                        <Link to={`/story-user-wall/${user._id}`} >
                            <div className="image-content">
                                <img
                                    src={baseUrl + user.image.filename} alt="Profile One"
                                    className="img-thumbnail active-story"
                                />
                            </div>
                        </Link>
                        : storiesSeen ?
                            <Link to={`/story-user-wall/${user._id}`} >
                                <div className="image-content">
                                    <img
                                        src={baseUrl + user.image.filename} alt="Profile One"
                                        className="img-thumbnail no-active-story"
                                    />
                                </div>
                            </Link>
                            :
                            <div className="image-content">
                                <img
                                    src={baseUrl + user.image.filename} alt="Profile One"
                                    className="img-thumbnail"
                                />
                            </div>
                    }
                </ProfileImage>
                {
                    loading === true ?
                        <div className="">
                            <Button type="button" className="btn-success col-2 offset-5 mt-3 ">
                                <span className="fas fa-spinner fa-spin"></span>
                            </Button>
                        </div> :
                        noti === true ?
                            <div className="">
                                <Button type="button" className="btn-success col-2 offset-5 mt-3 ">
                                    <span className="fas fa-hourglass-half fa-spin mr-2"></span>
                                </Button>
                            </div>

                            : foll === false ?
                                <div>
                                    <Button type="button" className="btn-success col-2 offset-5 mt-3 fas fa-user-plus" onClick={() => props.handleFollow(user._id)} />
                                </div> :

                                <div >
                                    <Button type="button" className="btn-success col-2 offset-5 mt-3" disabled><span className="fas fa-user-check"></span></Button>
                                </div>


                }
                <div className="user-info">
                    <div className="user-info-description">
                        <h5 className="">{user.firstname} {user.lastname}</h5>
                        <h5 className="">{`"${user.phrase}"`}</h5>
                        <h5 className="">{user.followers.length} Followers - {user.following.length} Following</h5>
                    </div>
                </div>
            </div>
        )
    })
    const Imagenes = !imagesWall ? null : imagesWall.map((img) => {
        return (
            <div className="image-content cursor" key={img._id}>
                {screen ?
                    <img className="img-thumbnail img-grid" src={baseUrl + img.filename} alt={img._id} id={img._id} onClick={(e) => props.toggle(e, "imagen")} />
                    :
                    <Link to={`/view/imagenwall/${img._id}`}>
                        <img className="img-thumbnail img-grid" src={baseUrl + img.filename} alt={img._id} id={img._id} />
                    </Link>
                }
            </div>
        )
    })

    const Videos = !videosWall ? null : videosWall.map((vid) => {
        return (
            <div className="image-content cursor" key={vid._id}>
                {screen ?
                    <video className="img-thumbnail img-grid" id={vid._id} src={baseUrl + vid.filename} alt={vid._id} onClick={(e) => props.toggle(e, "video")} />
                    :
                    <Link to={`/view/imagenwall/${vid._id}`}>
                        <video className="img-thumbnail img-grid" id={vid._id} src={baseUrl + vid.filename} alt={vid._id} />
                    </Link>
                }
            </div>
        )
    })
    if (props.error) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.error}</h4>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                {USUARIOS}
                <div>
                    {!dataUsuario ?
                        <div className="container" >
                            <div className="row">
                                <Loading />
                            </div>
                        </div>
                        : dataUsuario[0].message ?
                            <div>
                                <h1>This user has set their account to private. Follow his account to see his content</h1>
                            </div>
                            :
                            <div >
                                <div className="wall-container mediatab">
                                    <Nav tabs className="row h-5 mediatab">
                                        <NavItem className="col-6 cursor">
                                            <NavLink
                                                className={classnames({ active: activeTab === '1' })}
                                                onClick={() => { toggle('1'); }}>
                                                Images
                                            </NavLink>
                                        </NavItem>
                                        <NavItem className="col-6 cursor">
                                            <NavLink
                                                className={classnames({ active: activeTab === '2' })}
                                                onClick={() => { toggle('2'); }}>
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
                    }
                </div>
            </div>
        )
    }
}

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
}
`
const ModalGrid = styled.div`
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
  @media (max-width: 991px) {
    div.modalComments {
      display: none;
    }
    div.c {
        width: 100%;
    }
    div.modalgroup {
        padding-right: 0;
      }
  }
`
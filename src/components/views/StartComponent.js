import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Stories } from './StoriesComponent';
import { ModalComponent } from '../ModalComponent';
import { Loading } from '../LoadingComponent';
import { baseUrl } from '../../shared/baseUrl';
import NoContent from '../../shared/assets/images/start.png';

export const StartComponent = (props) => {
    const [content, setContent] = useState([]);
    const [comments, setComments] = useState([]);
    const [contentLoading, setContentLoading] = useState(true);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
    const [img, setImg] = useState(null);
    const [followingLoading, setFollowingLoading] = useState(true);
    const [active, setActive] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [likes, setLikes] = useState([]);
    const [media, setMedia] = useState('');
    const [error, setError] = useState(false);


    useEffect (() => {
        setContent(props.start.start !== null ? [props.start.start] : []);
        setContentLoading(!props.start ? true : props.start.isLoading)
        setFollowing(!props.following ? [] : props.following.following)
        setFollowers(!props.followers ? [] : props.followers.followers)
        setFollowingLoading(!props.following ? true : props.following.isLoading)
        setUsuario(!props.user.user ? null : props.user.user.usuario)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = (values, event) => {
         event.preventDefault();
         let imageCommentId;

        if(media === "imagen") {
            imageCommentId = img.imageId._id
        } else {
            imageCommentId = img.videoId._id
        }

        const commenta = {
            comment: values.comment,
            author: localStorage.getItem("id"),
            image: imageCommentId
        }
        props.commentsPost(commenta)
        .then(sol =>{
            let test = content[0].map(item => {
                if(item._id === img._id) {
                    if(item.commento.length === 0) {
                        item.commento = [sol] 
                    } else {
                        item.commento[0] = item.commento[0].length > 1 ? item.commento[0].concat(sol) : item.commento.concat(sol)
                    }
                    return item
                } else {
                    return item
            }
            })
            let valor = test.filter(item => item._id === img._id)[0]
            let addComment = valor.commento.length === 0 ? [] : valor.commento[0].length > 1 ? valor.commento[0] : valor.commento
            setContent([test])
            setComments(addComment)
            setActive('')
        })
       
    }
    const controlPostMessage = (e) => {
        const target = e.target;
        const value = target.value;
        setActive(value)
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
            let test = content[0].map(item => {
                if(item._id === img._id) {
                    if(item.commento[0].length > 2) {
                        item.commento[0] = item.commento[0].length > 1 ? item.commento[0].filter(item => item._id !== json._id) : null
                    } else if (item.commento[0].length === 2){
                        item.commento = item.commento[0].filter(item => item._id !== json._id)
                    } else {
                        item.commento = [] 
                    }
                    return item
                } else {
                    return item
            }
            })
            setContent([test])
            setComments(comments.filter(item => item._id !== json._id))
          })
          .catch(err => {
            setError(err)
          })
      }
    const handleLike = async (event, imgID, startID, tag) => {
        event.preventDefault();
        let img = await imgID;
        var usersData = {
            id: JSON.parse(localStorage.getItem('id')),
            liked: img
        }
        if(tag === 'imagen'){
            props.postImageLike(img, usersData)
            .then(() => {
                let test = content[0].map(item => {
                    if(item._id === startID) {
                        let change = item.imageId.likes.some(i => i === usersData.id)
                        if(change){
                            let likeposition = item.imageId.likes.findIndex(item => item === usersData.id)
                            item.imageId.likes.splice(likeposition, 1);
                        } else {
                            item.imageId.likes = item.imageId.likes.concat(usersData.id);
                        }
                        
                    return item
                } else {
                    return item
            }
                })
                
            setContent([test])
            })
        } else {
            props.postVideoLike(img, usersData)
            .then(() => {
                let test = content[0].map(item => {
                    if(item._id === startID) {
                        let change = item.videoId.likes.some(i => i === usersData.id)
                        if(change){
                            let likeposition = item.videoId.likes.findIndex(item => item === usersData.id)
                            item.videoId.likes.splice(likeposition, 1);
                        } else {
                            item.videoId.likes = item.videoId.likes.concat(usersData.id);
                        }
                        
                        return item
                    } else {
                        return item
                    }
                })
                
            setContent([test])
            })
        }

    }

    const toggleModal = (e, modalValue, id, tag) => {
        e.preventDefault();
        setMedia(tag)
        if (modalValue === "wall") {
            let value = content[0].filter(item => item._id === id)[0]
            let lengthComment = value.commento.length === 0 ? [] : value.commento[0].length > 1 ? value.commento[0] : value.commento
            
            setImg(value)
            setComments(lengthComment)
            fetchUsersLikes(e, value, tag)
            setIsModalOpen(!isModalOpen)
        } else if (modalValue === "likemodal") {
            setIsLikesModalOpen(!isLikesModalOpen)
        } 
        else {
            setIsModalOpen(false)
            setIsLikesModalOpen(false)
            setComments([])
            setImg("")
        }
      }
    const fetchUsersLikes = (e, value, tag) => {
        setLikes([])
        e.preventDefault();
        if(tag === "imagen") {
            let userId = value.userId._id;
            let imgId = value.imageId._id;
            const bearer = 'Bearer ' + localStorage.getItem('token');
            return fetch(baseUrl + `likes/get-i-like-it/${userId}/${imgId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
              },
              credentials: "same-origin"
            })
            .then(response => response.json())
            .then(likes => setLikes(likes))
            .catch(error => setError(error.message))
        } else {
            let userId = value.userId._id;
            let vidId = value.videoId._id;
            const bearer = 'Bearer ' + localStorage.getItem('token');
            return fetch(baseUrl + `likes/get-i-like-it-video/${userId}/${vidId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
              },
              credentials: "same-origin"
            })
            .then(response => response.json())
            .then(likes => setLikes(likes))
            .catch(error => setError(error.message))
        }
       
    }
const storyfetcher = !props.storyFetcher ? null : props.storyFetcher
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="speciffic col-12 col-md-8 col-lg-6 offset-md-2 p-0">
                    <Stories story={props.story} storyFetcher={storyfetcher} storiesView={props.storiesView}/>
                </div>
                <div className="col-12 col-md-8 col-lg-6 offset-md-2 ">
                    
                    <ImgWall start={content} handleLike={handleLike}
                        handleSubmit={handleSubmit} Loading={contentLoading} 
                        usuario={usuario} likes={likes} following={following}
                        isModalOpen={isModalOpen} isLikesModalOpen={isLikesModalOpen}
                        toggleModal={toggleModal} media={media}
                        img={img} comments={comments} deleteComments={deleteComments}
                        active={active} controlPostMessage={controlPostMessage} error={error}/>
                </div>
                
                    <Amigos following={following} followers={followers}
                            LoadState={followingLoading} usuario={usuario} 
                    />
            </div>
        </div>
    )
}

const ImgWall = (props) => {
    const [activeVideo, setActiveVideo] = useState(false)
    const [activeVideoId, setActiveVideoId] = useState('')
    let playContainer = React.createRef();
    const play = (e) => {
        if(!activeVideo) e.target.play()
        if(activeVideo) e.target.pause()
        setActiveVideo(!activeVideo)
        setActiveVideoId(e.currentTarget.id)
    }
    const show = () => {
        setActiveVideo(!activeVideo)
        setActiveVideoId('')
    }
    let load = props.Loading;
    if (load === true) {
        return (
            <div >
                <Loading />
            </div>
        )
    }  else {
        const aaa = props.start === [] ? [] : props.start[0];
        const WALL = !aaa ? null : aaa.map((first) => {
        let filtrado = JSON.parse(localStorage.getItem("id"));
        let imgOrVideo = !first.imageId

            if(imgOrVideo){
                let currentlyPictureId = first.videoId.likes.some(user => user === filtrado);
                return (
                    <div className="row" key={first._id}>
                        <div className="backi">
                            <div className=" imagenesWallHeadFrame">
                                <Link to={`/profiles/
                                ${props.usuario}/
                                ${first.userId.usuario}`} >
                                    <div className="frameOne">
                                        <img className="imagenesWallHead" src={baseUrl + first.userId.image.filename} alt={first.userId.image._id} />
                                        <h6 className="ml-3">{first.userId.firstname} {first.userId.lastname}</h6>
                                    </div>
                                </Link>
                                <div className="frameTwo">
                                    <Button className="corazon" onClick={(event) => props.handleLike(event, first.videoId._id, first._id, "video")}>
                                        {
                                            currentlyPictureId ?
                                            <span className="fa fa-heart" style={{ color: 'red' }}></span>
                                                :
                                            <span className="fa fa-heart" style={{ color: 'grey' }}></span>
                                        }
                                    </Button>
                                </div>
                            </div>
    
                            <div id="aaa" className=" img-thumbnail imagenesWallFrame" >
                            <span className={"fa fa-play play-icon-start " + (activeVideo && activeVideoId === first.videoId._id ? "play-video" : " ")} style={{ color: '#e4e4e4', fontSize: '8vw' }}></span>
                                <video ref={playContainer} className="imagenesWall" src={baseUrl + first.videoId.filename}
                                id={first.videoId._id} onClick={(e)=> play(e)} onEnded={()=> show()} />
                            </div>
                            <div className="commentsAndForm">
                            <div className="commentsWallHeadFrame">
                                <div>
                                {first.commento[0] !== undefined ?
                                    <div className="mt-2">
                                        <h6 className="">Hay {first.commento[0].length} comentarios</h6>
                                    </div>
                                    :
                                    (
                                    <div className="mt-2 ml-0">
                                        <h6 className="" >No hay comentarios todavia</h6>
                                    </div>
                                )}
                                {first.commento[0] === undefined ? null : 
                                    first.commento[0] !== undefined && first.commento[0][1] !== undefined ?
                                        (
                                        <div>
                                            <div className="commentsContent">
                                                <Link to={`/profiles/
                                                ${props.usuario}/
                                                ${first.commento[0][first.commento[0].length -2].author.usuario}`}>
                                                    <h6 className="author" >{first.commento[0][first.commento[0].length -2].author.usuario}</h6>
                                                </Link>
                                                <h6 className="comments" >{first.commento[0][first.commento[0].length -2].comment}</h6>
                                            </div>
                                            <div className="commentsContent">
                                                <Link to={`/profiles/
                                                ${props.usuario}/
                                                ${first.commento[0][first.commento[0].length -1].author.usuario}`} >
                                                    <h6 className="author" >{first.commento[0][first.commento[0].length -1].author.usuario}</h6>
                                                </Link>
                                                <h6 className="comments" >{first.commento[0][first.commento[0].length -1].comment}</h6>
                                            </div>
                                        </div>
                                        )
                                    :
                                    first.commento[0] !== undefined ?
                                    (
                                    <div className="commentsContent">
                                        <Link to={`/profiles/
                                        ${props.usuario}/
                                        ${first.commento[0].author.usuario}`} >
                                            <h6 className="author" >{first.commento[0].author.usuario}</h6>
                                        </Link>
                                        <h6 className="comments" >{first.commento[0].comment}</h6>
                                    </div> 
                                    )
                                    :
                                    null
                                    }
                                    </div>
                                        <Button className="buttonComment" onClick={e => props.toggleModal(e, "wall", first._id, "video")}><span className="fa fa-comment-alt"></span></Button>
                                    </div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                let currentlyPictureId = first.imageId.likes.some(user => user === filtrado);
                return (
                    <div className="row" key={first._id}>
                        <div className="backi">
                            <div className=" imagenesWallHeadFrame">
                                <Link to={`/profiles/
                                ${props.usuario}/
                                ${first.userId.usuario}`} >
                                    <div className="frameOne">
                                        <img className="imagenesWallHead" src={baseUrl + first.userId.image.filename} alt={first.userId.image._id} />
                                        <h6 className="ml-3">{first.userId.firstname} {first.userId.lastname}</h6>
                                    </div>
                                </Link>
                                <div className="frameTwo">
                                    <Button className="corazon" onClick={(event) => props.handleLike(event, first.imageId._id, first._id, 'imagen')}>
                                        {
                                            currentlyPictureId ?
                                            <span className="fa fa-heart" style={{ color: 'red' }}></span>
                                                :
                                                <span className="fa fa-heart" style={{ color: 'grey' }}></span>
                                        }
                                    </Button>
                                </div>
                            </div>
    
                            <div className=" img-thumbnail imagenesWallFrame">
                                <img className="imagenesWall" src={baseUrl + first.imageId.filename} alt={first.imageId._id} />
                            </div>
                            <div className="commentsAndForm">
                            <div className="commentsWallHeadFrame">
                                <div>
                                {first.commento[0] !== undefined ?
                                    <div className="mt-2">
                                        <h6 className="">Hay {first.commento[0].length} comentarios</h6>
                                    </div>
                                    :
                                    (
                                    <div className="mt-2 ml-0">
                                        <h6 className="" >No hay comentarios todavia</h6>
                                    </div>
                                )}
                                {first.commento[0] === undefined ? null : 
                                    first.commento[0] !== undefined && first.commento[0][1] !== undefined ?
                                        (
                                        <div>
                                            <div className="commentsContent">
                                                <Link to={`/profiles/
                                                ${props.usuario}/
                                                ${first.commento[0][first.commento[0].length -2].author.usuario}`}>
                                                    <h6 className="author" >{first.commento[0][first.commento[0].length -2].author.usuario}</h6>
                                                </Link>
                                                <h6 className="comments" >{first.commento[0][first.commento[0].length -2].comment}</h6>
                                            </div>
                                            <div className="commentsContent">
                                                <Link to={`/profiles/
                                                ${props.usuario}/
                                                ${first.commento[0][first.commento[0].length -1].author.usuario}`} >
                                                    <h6 className="author" >{first.commento[0][first.commento[0].length -1].author.usuario}</h6>
                                                </Link>
                                                <h6 className="comments" >{first.commento[0][first.commento[0].length -1].comment}</h6>
                                            </div>
                                        </div>
                                        )
                                    :
                                    first.commento[0] !== undefined ?
                                    (
                                    <div className="commentsContent">
                                        <Link to={`/profiles/
                                        ${props.usuario}/
                                        ${first.commento[0].author.usuario}`} >
                                            <h6 className="author" >{first.commento[0].author.usuario}</h6>
                                        </Link>
                                        <h6 className="comments" >{first.commento[0].comment}</h6>
                                    </div> 
                                    )
                                    :
                                    null
                                    }
                                    </div>
                                        <Button className="buttonComment" onClick={e => props.toggleModal(e, "wall", first._id, "imagen")}><span className="fa fa-comment-alt"></span></Button>
                                    </div>
                            </div>
                        </div>
                    </div>
                )
            }
          
        })
        return (
            <div>
                <ModalComponent isModalOpen={props.isModalOpen} isLikesModalOpen={props.isLikesModalOpen}
                                toggleModal={props.toggleModal} img={props.img} comments={props.comments}
                                handleSubmit={props.handleSubmit} deleteComments={props.deleteComments}
                                likes={props.likes} active={props.active} controlPostMessage={props.controlPostMessage}
                                usuario={props.usuario} media={props.media} />
                {aaa.length === 0
                ?
                <div className="nocontentitem">
                    <img src={NoContent} alt="no content" className="nocontentimage"/>
                    <h6>Follow other users and <br/> see their content here</h6>
                </div>
                :
                WALL}
            </div>
        )
    }
}

const Amigos = (props) => {

    const [activeTab, setActiveTab] = useState('1')

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
        let loadS = props.LoadState
        if (loadS === true) {
            return (
                <div >

                    <Loading />

                </div>
            )
        }
        else {
            const mapeoFollowing = props.following ? props.following : [];
            const mapeoFollowers = props.followers ? props.followers : [];

            const FOLLOW = mapeoFollowing.map(f => {
                return (
                    <div key={f._id}>
                        <Link to={`/profiles/
                        ${props.usuario}/
                        ${f.id.usuario}`}>
                            <div className="" >
                                <ImageGrida>
                                    <div>
                                        <img src={baseUrl + f.id.image.filename} alt="chatimgstatus" />
                                    </div>

                                    <div >
                                        <h6 id={f.id._id}>{`${f.id.firstname} ${f.id.lastname}`}</h6>
                                    </div>
                                </ImageGrida>
                            </div>
                        </Link>
                    </div>

                )

            })
            const FOLLOWERS = mapeoFollowers.map(f => {
                return (
                    <div key={f._id}>
                        <Link to={`/profiles/
                        ${props.usuario}/
                        ${f.id.usuario}`} >
                            <div className="" >
                                <ImageGrida>
                                    <div>
                                        <img src={baseUrl + f.id.image.filename} alt="chatimgstatus" />
                                    </div>

                                    <div >
                                        <h6 id={f.id._id} >{`${f.id.firstname} ${f.id.lastname}`}</h6>
                                    </div>
                                </ImageGrida>
                            </div>
                        </Link>
                    </div>

                )

            })

            return (
                <div className="d-none d-lg-block  col-3 sidenav" >
                    <Nav tabs className="row h-5">
                        <NavItem className="col-6 cursor">
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1'); }}>
                                Siguiendo
                            </NavLink>
                        </NavItem>
                        <NavItem className="col-6 cursor">
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2'); }}>
                                Seguidores
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <div className="row scroll-aside" style={{ backgroundColor: "aliceblue", borderRadius: "5%" }}>
                                <h6 className="col-md-12">{FOLLOW}</h6>
                            </div>
                        </TabPane>
                        <TabPane tabId="2">
                            <div className="row scroll-aside" style={{ backgroundColor: "aliceblue", borderRadius: "5%" }}>
                                <h6 className="col-md-12">{FOLLOWERS}</h6>
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
            )
        }
}


const ImageGrida = styled.div`
display: grid;
grid-gap: 10px;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: 1fr;
grid-auto-rows: minmax(30%, 30%);
grid-auto-columns: minmax(30%, 30%);
align-items: center;
border-radius: 20%;

h6 {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    align-items: center;
    margin-left: 30px;
}
img{
  margin-top: 10px;
  margin-left: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  max-width: auto;
  min-whidth: auto;
  object-fit: cover;
}

@media (max-width: 1000px) {
  img{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  max-width: auto;
  min-whidth: auto;
  object-fit: cover;
  }
}
@media (max-width: 767px) {
  img{
  width: 25px;
  height: 25px;
  border-radius: 50%;
  max-width: auto;
  min-whidth: auto;
  object-fit: cover;
  }
}
@media (max-width: 520px) {
  img{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  max-width: auto;
  min-whidth: auto;
  object-fit: cover;
  }
}
@media (max-width: 343px) {
  img{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  max-width: auto;
  min-whidth: auto;
  object-fit: cover;
  }
}
`
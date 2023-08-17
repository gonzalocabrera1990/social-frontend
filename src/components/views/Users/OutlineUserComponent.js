import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import classnames from 'classnames';
import { withRouter} from 'react-router-dom';
import { Button, Nav, NavItem, NavLink } from 'reactstrap';
import { baseUrl } from '../../../shared/baseUrl';
import { getHelper } from '../../../redux/fetchsHelpers'

export const Outline = withRouter((props) => {
    const [user, setUser] = useState([])
    const [error, setError] = useState(null)
    
    useEffect(() => {
      (function(){
        const ID = props.match.params.idUsuario
        // return fetch(`${baseUrl}out-auth/get-outline-user/${ID}`, {
        //     method: "GET",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //   })
        //   .then(response => response.json())
        getHelper(`out-auth/get-outline-user/${ID}`)
          .then(response => {
            if (!response) {
                props.history.push("/")
                return;
              }
            setUser([response]);
          })
          .catch(err => {
            setError(err.message)
          })
      })()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    const redirecting = () => {
        props.history.push("/")
    }
  return (
    <div>
        <Render data={user} redirecting={redirecting} error={error}/>
    </div>
  )
})

const Render = (props) => {
  const [activeTab, setActiveTab] = useState('1')

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
      }
    const Data = props.data;
    const USUARIOS = Data.map(user => {
        return (
            <div key={user._id}>
                <ProfileImage className="">
                    <div className="image-content">
                        <img
                            src={baseUrl + user.image.filename} alt="Profile One"
                            className="img-thumbnail"
                        />
                     </div>
                </ProfileImage>
                    <div>
                        <Button type="button" className="btn-success col-2 offset-5 mt-3 fas fa-user-plus" onClick={props.redirecting} />
                    </div>
                    <div className="user-info">
                    <div className="user-info-description">
                        <h5 className="">{user.firstname} {user.lastname}</h5>
                        <h5 className="">{`"${user.phrase}"`}</h5>
                        <h5 className="">{user.followers.length} Followers - {user.following.length} Following</h5>
                    </div>
                    </div>
                        <ImageGrids className="image-grid">
                          {
                            user.message ? 
                            <div>
                                <h5>This user has set their account to private. Follow his account to see his content.</h5>
                            </div>
                            :
                            <div className="container-fluid">
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
                            {  user.imagesWall.map((img) => {
                                    return (
                                        
                                            <div className="image-content cursor" key={img._id}>
                                                <img className="img-thumbnail img-grid" onClick={props.redirecting} src={baseUrl + img.filename} alt={img._id} id={img._id} />
                                            </div>
                                    )
                                    })
                            }
                        </div>
                        <div className={(activeTab === '2' ? "wall-container" : 'desactivado')}>
                        {  user.videosWall.map((vid) => {
                                return (
                                    
                                        <div className="image-content cursor" key={vid._id}>
                                            <video className="img-thumbnail img-grid" onClick={props.redirecting} src={baseUrl + vid.filename} alt={vid._id} id={vid._id} />
                                        </div>
                                )
                                })
                            }
                        </div>
                        </div>
                          }
                        </ImageGrids>
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

        <div  >{USUARIOS}</div>

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

const ImageGrids = styled.div`

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin: auto 5%;

.image-content {
    width: 33%;
    height: 26vw;
  }
  
  
  .img-grid{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

`


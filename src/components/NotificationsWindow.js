//Dependencis
import React, {useEffect, useState} from 'react';
import { Media, Button } from 'reactstrap';
import styled from 'styled-components'
import { withRouter } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

 export const Notifications = withRouter((props) => {
    const [data, setData] = useState([])

    useEffect(() => {
        let notificationResult = props.notifications.results
        setData(notificationResult)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    const handleRequestFriendship = (action, followerId, notiId) => {
        const dataNotification = {
            action: action,
            followerId: followerId,
            notiId: notiId
        }
        props.friendRequestResponse(dataNotification)
            .then(() => {
                props.history.push("/");
                window.location.reload();
            })
    }

        let notif = data ? data : []
        let view = data.length
        const NOTIFICACIONES = !notif ? [] : notif.map((n) => {
            return (
                <div key={n._id} >
                    <Searching className="mt-1 mb-1 " >
                        <div className="row ">
                            <Media tag="li" className="col-12 align-notification">
                                <Media left className="col-3 mx-0 px-0">
                                    <Media className="imagen-navbar-profile" object src={baseUrl + n.followingId.image.filename} ></Media>
                                </Media>
                                <div className="col-9" >
                                    <div className="row">
                                        <div className="col-6" >
                                            <Media body className="col-8">
                                                <Media heading><span>{n.message}</span></Media>
                                            </Media>
                                        </div>
                                        <div className="col-3" >
                                            <Button className="fas fa-thumbs-up" style={{ color: 'rgb(62, 247, 62)' }} onClick={() => handleRequestFriendship(true, n.followingId._id, n._id)} />
                                        </div>
                                        <div className="col-3" >
                                            <Button className="fas fa-thumbs-down" style={{ color: 'rgb(245, 53, 19)' }} onClick={() => handleRequestFriendship(false, n.followingId._id, n._id)} />
                                        </div>
                                    </div>
                                </div>
                            </Media>
                        </div>
                        </Searching>
                    </div>
                
            );
        })
        if (view <= 0) {
        return (
            <Searching>
            <div className="container position-absolute noti-message">
                    NO NOTIFICATIONS YET
            </div>
        </Searching>

        )
        } else {
            return (
            <Searching>
            <div className="container position-absolute ">
                <div className="row ">
                    <Media list className="p-0 ">
                        {NOTIFICACIONES}
                    </Media>
                </div>
            </div>
        </Searching>
            )
        }
})


const Searching = styled.div`
background-color: rgb(91, 179, 94);
position: relative;
padding:0px;
width: 100%;
z-index: 1;
color: white;
font-size: 1em;
margin: 0px;
align-items:center;
.align-notification{
    display: flex;
    align-items:center;
}
img{
    margin: 15%;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    max-width: auto;
    min-whidth: auto;
    object-fit: cover;
  }
  span {
      font-size: 1rem;
  }
`
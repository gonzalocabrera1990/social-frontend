import React from 'react';
import styled from 'styled-components'
import { Loading } from '../../LoadingComponent';
import { baseUrl } from '../../../shared/baseUrl';

export const Chats = (props) => {
    let usuario = JSON.parse(localStorage.getItem('id'));
    const talksStatusMap = props.talks ? props.talks : []
    const TALKS = talksStatusMap.map(t => {
        const imagen = t.members.userOne._id === JSON.parse(localStorage.getItem('id')) ? t.members.userTwo.image.filename : t.members.userOne.image.filename
        const name = t.members.userOne._id === JSON.parse(localStorage.getItem('id')) ? `${t.members.userTwo.firstname} ${t.members.userTwo.lastname}` : `${t.members.userOne.firstname} ${t.members.userOne.lastname}`
        let seenIt = t.talk.some(element => element.author !== usuario && !element.seen)
        const inboxdata = {
            ID: t._id,
            room: t.room
        }
        return (
            <div key={t._id}>
                { seenIt ?
                <div className="chats cursor" onClick={(e) => props.inboxTalksHandler(e, inboxdata)}>
                    <ChatGrid>
                        <div>
                            <img src={baseUrl + imagen} alt="chatimgstatus" />
                        </div>

                        <div >
                            <h6 id={t._id} >{name}</h6>
                        </div>
                    </ChatGrid>
                </div>
                :
                <div className="cursor" onClick={(e) => props.inboxTalksHandler(e, inboxdata)}>
                <ChatGrid>
                    <div>
                        <img src={baseUrl + imagen} alt="chatimgstatus" />
                    </div>

                    <div >
                        <h6 id={t._id}>{name}</h6>
                    </div>
                </ChatGrid>
            </div>
            }
         </div>
        )
    })
        return (
            <div className="container-fluid inbox">
                <div className="row p-0 ml-2">
                    <h5>Chats</h5>
                </div>
                <div className="row inboxes">
                    { props.inboxLoading ?
                        <Loading />
                    :
                        TALKS
                    }
                </div>

            </div>
        )
}
const ChatGrid = styled.div`
display: grid;
grid-gap: 10px;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: 1fr;
grid-auto-rows: minmax(30%, 30%);
grid-auto-columns: minmax(30%, 30%);
align-items: center;
h6 {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    align-items: center;
    margin-left: 15%;
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
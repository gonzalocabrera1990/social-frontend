import React from 'react';
import styled from 'styled-components'
import { baseUrl } from '../../../shared/baseUrl';

export const AmigosComponent = (props) => {
    const FOLLOW  = !props.followers ? null : props.followers
    const mapeoFollow = !FOLLOW ? null : FOLLOW.map(f => {
    const user_id = f.id._id
        return (
            <div key={f._id}>
                <div className="cursor"  onClick={(e) => props.inboxHandler(e, user_id)}>
                    <FriendsListStyle >
                        <div >
                            <img src={baseUrl + f.id.image.filename} alt="chatimgstatus"/>
                        </div>

                        <div >
                            <h6>{`${f.id.firstname} ${f.id.lastname}`}</h6>
                        </div>
                    </FriendsListStyle>
                </div>
            </div>

        )
    })
    return (
        <div className="container-fluid inbox">
            <div className="row p-0 ml-2">
                <h5>Amigos</h5>
            </div>
            <div className="row inboxes">
                <h6>{mapeoFollow}</h6>
            </div>

        </div>

    )
}
const FriendsListStyle = styled.div`
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
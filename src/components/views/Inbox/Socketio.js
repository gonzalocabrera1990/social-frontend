import React, {useEffect, useState} from 'react';
import { Chats } from './ChatsComponent';
import { Mensajes } from './MensajesComponent';
import { AmigosComponent } from './AmigosComponent';
import { baseUrl } from '../../../shared/baseUrl';

export const RenderInbox = (props) => {

    const [room, setRoom] = useState("");
    const [followers, setFollowers] = useState([]);
    const [talks, setTalks] = useState([]);
    const [chatTitle, setChatTitle] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [inboxLoading, setInboxLoading] = useState(true);
    const [error, setError] = useState(null);
    const [active, setActive] = useState("");

    useEffect(() => {
        const getFollowers = props.followers ? props.followers.followers : []
        setFollowers(getFollowers)
        handleInboxFetch()
        return function cleanRoom() {
            let id = JSON.parse(localStorage.getItem('id'));
            props.socketConection.emit("removeuser", id);
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        props.socketConection.on("sendChat", data => {
            let filterInbox = !props.inbox.inbox ? [] : props.inbox.inbox
            let getinbox = filterInbox.some( i => i._id === data._id) ? null : handleInboxFetch()

            setUserState(data);
        })
        return function clean() {
            setRoom('')
        }
    }, [props.socketConection]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInboxFetch = () => {
        setInboxLoading(true)
        const bearer = 'Bearer ' + localStorage.getItem('token');
        var config = {
          headers: { 'Authorization': bearer }
        };
        const QUERY = JSON.parse(localStorage.getItem('id'));;
        fetch(baseUrl + `inbox-message/getch/${QUERY}`, config)
        .then(data => data.json())
        .then(json => {
            setInboxLoading(false)
            setTalks(json)
        })
        .catch(err => {
          setError(err)
        })
      }

    //FETCH A SPECIFICT CHAT BY ID. CLICK LEFT COLUMN
    const inboxTalksHandler = async (e,{ID, room}) => {
        e.preventDefault();
        var query = ID
        let usuario = JSON.parse(localStorage.getItem('id'));
        let datos = {
            query,
            usuario,
            room
        }
        props.socketConection.emit("fetchChat", datos);
    }


    //SAVE FRIEND STATE. CLICK RIGHT COLUMN
    const inboxHandler = async (e, userid) => {
        e.preventDefault();
        var ids = userid
        let usuario = JSON.parse(localStorage.getItem('id'));
        let charla = await existChat(ids)
        let result = charla[0] ? true : false
        //if exist a chat with these users fetch it
            if(result){
                let room = charla[0].room
                let query = charla[0]._id
                let data = {
                    query, usuario, room
                }
                props.socketConection.emit("fetchChat", data);
            }
            setRoom("")
    
            //set the information in the messege state
            let select = followers.filter(s => s.id._id === ids)
            let talkselect = talks === null ? [] : 
                                talks.filter(t => {//return complete chat with these conditions
                                return t.members.userOne._id === usuario && t.members.userTwo._id === ids ? 
                                        t.members.userOne._id === usuario && t.members.userTwo._id === ids : 
                                        t.members.userTwo._id === usuario && t.members.userOne._id === ids
            })
            const getroom = talkselect[0] ? talkselect[0].room : ""
                setChatTitle(select)
                setChatUsers(talkselect)
                setRoom(getroom)
    }

    const existChat = ID =>{
        let userMain = JSON.parse(localStorage.getItem('id'));
        let frienid = ID
        let findTalk = talks === null ? [] : 
                            talks.filter(t => {//return complete chat with these conditions
                            return t.members.userOne._id === userMain && t.members.userTwo._id === frienid ? 
                                    t.members.userOne._id === userMain && t.members.userTwo._id === frienid : 
                                    t.members.userTwo._id === userMain && t.members.userOne._id === frienid
        })
        return findTalk;
    }

    const setUserState = (data) => {
        const localid = JSON.parse(localStorage.getItem('id'))
        const userOne = data.members.userOne
        const userTwo = data.members.userTwo
        const getChatTitle = [{
            id: {
                _id: userOne._id === localid ? userTwo._id : userOne._id,
                image: userOne._id === localid ? userTwo.image : userOne.image,
                firstname: userOne._id === localid ? userTwo.firstname : userOne.firstname,
                lastname: userOne._id === localid ? userTwo.lastname : userOne.lastname,
                username: userOne._id === localid ? userTwo.username : userOne.username
            }
        }]
        setRoom(data.room)
        setChatUsers([data])
        setChatTitle(getChatTitle)
    }
    //CREATE A NEW TALK. RECIVE DATA FROM THE SEND FORM
    const handleSubmitInbox = (e) => {
        e.preventDefault();
        const talkId = chatUsers[0] ? chatUsers[0]._id : ''
        const RECEPTOR = chatTitle[0].id._id
        const EMISOR = JSON.parse(localStorage.getItem('id'))
        const roomSocket = room
        const datad = {
            contenido: {
                members: {
                    userOne: EMISOR,
                    userTwo: RECEPTOR
                },
                talk: {
                    author: EMISOR,
                    content: e.target.message.value
                }
            },
            talkId,
            roomSocket
        }
        e.target.message.value = ""
        props.socketConection.emit('sendMessage', datad)
        setActive("")
    }
    const setActiveValue = (e) =>{
        let value = e.target.value
        setActive(value)
    }
    if (error) {
        return (
          <div className="container">
            <div className="row">
              <h4>{props.error}</h4>
            </div>
          </div>
        );
      } else {
        return (
         
                <div className=" grid-inbox">
                    <div className="grid-inbox-one">
                        <Chats talks={talks} inboxTalksHandler={inboxTalksHandler}
                                inboxLoading={inboxLoading} />
                    </div>
                    <div className=" grid-inbox-two">
                        <Mensajes chatTitle={chatTitle} chatUsers={chatUsers}
                            handleSubmitInbox={handleSubmitInbox} 
                            active={active} setActiveValue={setActiveValue}/>
                    </div>
                    <div className=" grid-inbox-three">
                        <AmigosComponent followers={followers} talks={talks} inboxHandler={inboxHandler} />
                    </div>
                </div>
           
        )
    }    
}
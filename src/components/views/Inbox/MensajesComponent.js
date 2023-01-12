import React, {useEffect} from 'react';
import styled from 'styled-components';
import { Input, FormGroup, Form } from 'reactstrap'
import { baseUrl } from '../../../shared/baseUrl';

export const Mensajes = (props) => {
    let chatContainer = React.createRef();
    useEffect(()=>{
        scrollToMyRef()
    }, [chatContainer]) // eslint-disable-line react-hooks/exhaustive-deps

    const scrollToMyRef = () => {
        let scroll = chatContainer.current.scrollHeight - chatContainer.current.clientHeight;
        chatContainer.current.scrollTo(0, scroll);
      };

        const inboxStatus = !props.chatTitle ? [] :props.chatTitle
        const inboxMessages = props.chatUsers !== [] ? props.chatUsers : []
        const inboxMessagesWindow = inboxMessages[0]
        const INBOX = inboxStatus.map((i,index) => {
        let imagenChatUser = i.id.image.filename;
        return (
            <div key={index}>
                    <ImageTitle>
                        <div>
                            <img src={baseUrl + imagenChatUser} alt="chatimgstatus" />
                        </div>

                        <div className="hide-name">
                            <h6>{i.id.firstname} {i.id.lastname}</h6>
                        </div>
                    </ImageTitle>
            </div>
        )
        })
        let MESSAGES = !inboxMessagesWindow ? [] : inboxMessagesWindow.talk.map(l => {
            let styling = l.author === JSON.parse(localStorage.getItem("id"))
            return (

                <div key={l._id} className={( styling ? "chat-own-style-margin" : "chat-they-style-margin")} >
                    <div className={( styling ? "chat-own-style" : "chat-they-style")} >
                        <h6>{l.content}</h6>
                    </div>
                </div>

            )
        })

        return (
            <div  className="container-fluid inbox" >
                <div className="row p-0 ml-2 align-items-center">
                    <h5>Messages</h5>
                    <div className="justify-content-end">{INBOX}</div>
                </div>
                <div ref={chatContainer} className="inboxes">
                    {!props.chatTitle[0] ?
                        <div>
                            <h1>Chat condition</h1>
                            <h4>Click and choose a chat or followers</h4>
                        </div>
                        :
                        <div className="message-display"> 
                            <div className="">
                                {MESSAGES}
                            </div>
                            <div>
                                <Form onSubmit={(e) => props.handleSubmitInbox(e)}>
                                    <FormGroup className="in-inbox">
                                        <div className="chat-field">
                                                <div className="chat-input">
                                                    <Input
                                                        type="text"
                                                        id="message"
                                                        name="message"
                                                        className="h-100"
                                                        onChange={(e)=> props.setActiveValue(e)}
                                                    />
                                                </div>
                                                { props.active.length === 0 || props.active.length > 140 ?
                                                    <button type="submit" className="fas fa-paper-plane button-chat" disabled/>
                                                    :
                                                    <button type="submit" className="fas fa-paper-plane button-chat" />
                                                }
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </div>
                }
                </div>
            </div>
    )
}
const ImageTitle = styled.div`
display:flex;
align-items: center;
justify-content: center;
margin-left: 15px;
img{
    margin-right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    max-width: auto;
    min-whidth: auto;
    object-fit: cover;
  }
`
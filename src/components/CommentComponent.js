import React from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { Loading } from './LoadingComponent';
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

export const RenderComments = (props) => {
    const sss = !props.comentarios ? null : props.comentarios.length === 0 ? [] : props.comentarios[0].length > 1 ? props.comentarios[0] : props.comentarios;
    let storage = JSON.parse(localStorage.getItem('id'));
    const uuu = !sss ?  null : sss.map(comm => {
        let commId = comm._id
        return (
            <div key={comm._id} className="container">
                <div className="comment-row">
                    <div className="d-flex">
                    <div>
                        <Link to={`/profiles/
                        ${props.usuario}/
                        ${comm.author.usuario}`}>
                            <img className="comment" src={baseUrl + comm.author.image.filename} alt="user/friend" />
                        </Link>
                    </div>
                    <div>
                        <h6 className="col-7">{comm.comment}</h6>
                    </div>
                    </div>
                    <UncontrolledDropdown>
                        <DropdownToggle nav >
                            <span className="fas fa-ellipsis-v"
                                style={comm.author._id === storage ? { fontSize: "10px" } : { display: "none" }}></span>
                        </DropdownToggle>
                        <DropdownMenu right top="true" className="dropmenu" >
                            <DropdownItem onClick={() => props.deleteComments(commId)} >
                                Delete Comment
                        </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>

            </div>
        )
    })
    return (
        <div className="w-100">
             {
                !uuu ?
                <div className='loading-comment'>
                    <Loading />
                </div>
                :
                uuu
            }
        </div>
    )
}
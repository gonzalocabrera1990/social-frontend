//Dependencis
import React from 'react';
import { Media } from 'reactstrap';
import styled from 'styled-components'
import { Loading } from './LoadingComponent'
import { Link, withRouter } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

export const SearchRender = withRouter( (props) => {
        const usuario =  props.user.user ? props.user.user.usuario : null
        let view = props.search.length ? props.search : [];
        const USUARIOS = !view ? [] : view.map((user) => {
            return (     
                <div key={user._id}>
                <Searching className="col-12 col-md-4 mt-1 mb-1 p-0" >
                    <Link to={`/profiles/${usuario}/${user.usuario}`} >
                    <div  >
                            <div className="acc">
                                <ImageGrida>
                                    <div className="">
                                        <img className="" src={baseUrl + user.image.filename} alt="user" />
                                    </div>

                                    <div className="">
                                        <h6>{`${user.firstname} ${user.lastname}`}</h6>
                                    </div>
                                </ImageGrida>
                            </div>
                        </div>
                    </Link>
                </Searching>
                </div>
            );
        });
        if (props.searchLoading) {
            return (
                <Searching>
                    
                <div className="pik pick-search"></div>
                      <div className="container position-absolute acc search-window">
                          <div className="row">
                              <div className="col-12">
                                  <Media list>
                                      <Loading />
                                  </Media>
                              </div>
                          </div>
                      </div>
                  </Searching>
            )
        } else if (view <= 0) {
            return (
                <Searching>
                    <div className="container position-absolute iinvisible">
                        <div className="row">
                            <Media list>
                                {USUARIOS}
                            </Media>
                        </div>
                    </div>
                </Searching>
            )
        } else {
            return (
                <Searching>
                    
              <div className="pik pick-search"></div>
                    <div className="container position-absolute acc search-window">
                        <div className="row">
                            <div className="col-12">
                                <Media list>
                                    {USUARIOS}
                                </Media>
                            </div>
                        </div>
                    </div>
                </Searching>
            )
        }
})
const ImageGrida = styled.div`
background-color: rgb(91, 179, 94);
display: grid;
text-overflow: ellipsis;
grid-gap: 10px;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: 1fr;
grid-auto-rows: minmax(30%, 30%);
grid-auto-columns: minmax(30%, 30%);
align-items: center;

h6 {
    
    white-space: nowrap;
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
}
`
const Searching = styled.div`
position: relative;
display: flex;
flex-direction: column;
width: 100%;
z-index: 1;
color: white;
margin: 0px;
justify-content: start;
.acc {
    align-items: start;
}
@media (max-width: 560px) {
    .acc {
        width: 100%;
    }
}
`

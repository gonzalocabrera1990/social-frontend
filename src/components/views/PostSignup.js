import React, {useEffect, useState} from 'react';
import { Loading } from '../LoadingComponent';
export const PostSignup = props => {
const [loading, setLoading] = useState(true)
useEffect(()=>{
  if(props.signup.successMess) setLoading(false)
}, [props.signup])
  if (loading) {
    return (
        <div >
            <Loading />
        </div>
    )
}
else {
  return (
    <div className="container">
      <div className="row">
        <h3 className="col-12 text-center">{props.signup.successMess}</h3>
      </div>
      <div className="row">
          <button className="btn-success col-12">
            <a href="/"> <span className="fa fa-user fa-lg text-light" /></a>
          </button>
      </div>
    </div>
  );
}
};
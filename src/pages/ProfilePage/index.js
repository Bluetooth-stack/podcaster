import React from 'react'
import { useSelector } from 'react-redux'
import Loader from '../../components/common/Loading'

function Profile() {
  const loggedUser = useSelector((state)=>(state.user.user));

  return (
    <div>
      {
        loggedUser?
        <p>{loggedUser.name}</p>
        :
        <Loader />
      }
    </div>
  )
}

export default Profile
import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../components/common/Loading';
import ProfileDetails from '../../components/ProfileDetails';


function Profile() {
  const loggedUser = useSelector((state) => (state.user.user));

  return (
    <>
      {
        loggedUser ?
          // <p>{loggedUser.name}</p>
          <ProfileDetails loggedUser={loggedUser} />
          :
          <Loader />
      }
    </>
  )
}

export default Profile
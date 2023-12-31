import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../components/common/Loading';
import ProfileDetails from '../../components/ProfileDetails';
import PageTransition from '../../PageTransition';

function Profile() {
  const loggedUser = useSelector((state) => (state.user.user));

  return (
    <PageTransition>
      {
        loggedUser ?
          <ProfileDetails loggedUser={loggedUser} />
          :
          <Loader />
      }
    </PageTransition>
  )
}

export default Profile
import React from 'react'
import Main from '../../components/homeComponent';
import PageTransition from '../../PageTransition';

function Home() {
  return (
    <PageTransition>
      <Main />
    </PageTransition>
  )
}

export default Home
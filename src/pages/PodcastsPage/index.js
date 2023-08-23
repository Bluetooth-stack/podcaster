import React from 'react'
import PodcastMain from '../../components/podcastsPageComponents'
import PageTransition from '../../PageTransition';

function PodcastsPage() {
    return (
        <PageTransition>
            <PodcastMain />
        </PageTransition>
    )
}

export default PodcastsPage
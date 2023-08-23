import React from 'react'; 
import PodcastCreator from '../../components/startPodcastComponents';
import PageTransition from '../../PageTransition';

function StartPodcastPage() {
    return (
        <PageTransition>
            <PodcastCreator />
        </PageTransition>
    )
}

export default StartPodcastPage
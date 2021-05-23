import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Header, Item, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import ActivityListitem from './ActivityListitem'



export default observer(function ActivityList() {

    const {activityStore : { groupedActivities}} = useStore()


    
    

    return (
        <>
            {groupedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {activities.map((activity) => (
                        <ActivityListitem key={activity.id} activity={activity} />
                    ))}
                </Fragment>
            ))}
        </>
        
    )
})

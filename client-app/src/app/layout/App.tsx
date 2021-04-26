import React, { useEffect, useState } from 'react';
import {  Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid'
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const {activityStore} = useStore()

  const[activities, setAvtivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
  const [editMode, seteditMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    activityStore.loadActivities()
  },[activityStore])

  
  
  const handleCreateOrEditActivity = (activity: Activity) => {
      setSubmitting(true)
      if(activity.id){
        agent.Activities.update(activity).then(() => {
          setAvtivities([...activities.filter(x => x.id !== activity.id), activity])
          setSelectedActivity(activity)
          seteditMode(false)
          setSubmitting(false)
        })
      } else {
        activity.id = uuid()
        agent.Activities.create(activity).then(() => {
          setAvtivities([...activities, activity])
          setSelectedActivity(activity)
          seteditMode(false)
          setSubmitting(false)
        })
      }
  }

  const handleDeleteActivity = (id: string) => {
    setSubmitting(true)
    agent.Activities.delete(id).then(() => {
      setAvtivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false)
    })
    
  }
  
  if(activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

  return (
    <>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
        
        <ActivityDashboard 
          activities={activityStore.activities}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
      
    </>
  );
}

export default observer(App);

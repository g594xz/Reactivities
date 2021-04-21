import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid'
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {

  const[activities, setAvtivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
  const [editMode, seteditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    agent.Activities.list().then((response) => {
      let activities: Activity[] = []
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0]
        activities.push(activity)
      })
      setAvtivities(activities)
      setLoading(false)
    })
  },[])

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(x=> x.id === id));
  }

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined)
  }

  const handleFormOpen = (id?: string) => {
    id ? handleSelectActivity(id) : handleCancelSelectActivity()
    seteditMode(true)
  }
  
  const handleFormClose = () => {
    seteditMode(false)
  }
  
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
  
  if(loading) return <LoadingComponent content='Loading app' />

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
      
    </>
  );
}

export default App;

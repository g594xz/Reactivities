import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid'

function App() {

  const[activities, setAvtivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
  const [editMode, seteditMode] = useState(false)

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then((response) => {
      setAvtivities(response.data)
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
      activity.id ? 
      setAvtivities([...activities.filter(x => x.id !== activity.id), activity]) :
      setAvtivities([...activities, {...activity, id: uuid()}]);
      seteditMode(false)
      setSelectedActivity(activity)
  }

  const handleDeleteActivity = (id: string) => {
    setAvtivities([...activities.filter(x => x.id !== id)])
  }
  
  

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
        />
      </Container>
      
    </>
  );
}

export default App;

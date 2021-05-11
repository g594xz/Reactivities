import { observer } from 'mobx-react-lite'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Button, Form, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useStore } from '../../../app/stores/store'
import {v4 as uuid} from 'uuid'
import { Link } from 'react-router-dom'

export default observer(function ActivityForm() {
    const history = useHistory()
    const {activityStore: { createActivity, updateActivity, loading, loadActivity, loadingInitial}} = useStore()
    const {id} = useParams<{id: string}>()
    const [activityObj, setActivityObj] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    })
    
    useEffect(() => {
        if(id) loadActivity(id).then( activity => setActivityObj(activity!))
    }, [id, loadActivity])
    

    const handleSubmit = () => {
        if (activityObj.id.length === 0) {
            let newActivity = {
                ...activityObj,
                id: uuid()
            }
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        } else {
            updateActivity(activityObj).then(() => {
                history.push(`/activities/${activityObj.id}`)
            })
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setActivityObj({...activityObj, [name]: value})
    }
    
    if(loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activityObj.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' value={activityObj.description} name='description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activityObj.category} name='category' onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' value={activityObj.date} name='date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activityObj.city} name='city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activityObj.venue} name='venue' onChange={handleInputChange}/>
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated='right'  type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})

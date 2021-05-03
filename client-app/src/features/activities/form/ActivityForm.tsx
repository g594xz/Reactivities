import { observer } from 'mobx-react-lite'
import React, { ChangeEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'

export default observer(function ActivityForm() {
    const {activityStore: {selectedActivity, closeForm, createActivity, updateActivity, loading}} = useStore()

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    }

    const [activityObj, setActivityObj] = useState(initialState)

    const handleSubmit = () => {
        activityObj.id ? updateActivity(activityObj) : createActivity(activityObj)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setActivityObj({...activityObj, [name]: value})
    }
    
    

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
                <Button  onClick={closeForm} floated='right' positive type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})

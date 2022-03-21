import Toggle from 'react-toggle'
import Button from './Button'
import { useState } from 'react'
import { useUpdateTimeSlotMutation, useDeleteTimeSlotMutation } from '../features/api'

const EditRowPickupTime = ({timeSlot, index, setEditRowObjectId}) => {
  const [ updateTimeSlot, updateResults ] = useUpdateTimeSlotMutation()
  const [ deleteTimeSlot, deleteResults ] = useDeleteTimeSlotMutation()
  const [ updatedTimeSlot, setUpdatedTimeSlot ] = useState({...timeSlot})
  const formattedTime = updatedTimeSlot.time.slice(0, 2).concat(":", updatedTimeSlot.time.slice(2, 4))

  const handleTimeChange = (event) => {
    event.preventDefault()
    let updatedTime = (event.target.value.slice(0, 2)).concat(event.target.value.slice(3, 5))
    setUpdatedTimeSlot(prev => {
      return{
        ...prev,
        time: updatedTime
      }
    })
  }

  const handleInputChange = (event) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setUpdatedTimeSlot(prev => {
      return{
        ...prev,
        [name]: value
      }
    })
  }

  const handleSave = async (event) => {
    event.preventDefault()
    await updateTimeSlot(updatedTimeSlot)
    if(updateResults.isError){
      alert(`An Error Occured: ${updateResults.error.message}`)
      return
    }
    setUpdatedTimeSlot({...timeSlot})
    setEditRowObjectId(null)
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    await deleteTimeSlot(timeSlot._id)
    if(deleteResults.isError){
      alert(`An Error Occured: ${deleteResults.error.message}`)
      return
    }
    setUpdatedTimeSlot({...timeSlot})
    setEditRowObjectId(null)
  }
  
  return (
    <tr 
      className={`${timeSlot.active ? 'timeslot-active' : 'timeslot-inactive'}`}
      key={index}
    >
      <td>
        <input type='time' name='time' value={formattedTime} onChange={e=>handleTimeChange(e)}/>
      </td>
      <td>
        <input type='number' name='startingQuantity' value={updatedTimeSlot.startingQuantity} onChange={e=>handleInputChange(e)}/>
      </td>
      <td>
        <input type='number' name='currentQuantity' value={updatedTimeSlot.currentQuantity} onChange={e=>handleInputChange(e)}/>
      </td>
      <td>
        <Toggle name='active' checked={updatedTimeSlot.active} onChange={e=>handleInputChange(e)}/>
      </td>
      <td>
        <Button color='green' text='Save' onClick={e=>handleSave(e)}/>
        <Button color='crimson' text='Delete' onClick={e=>handleDelete(e)}/>
      </td>
    </tr>
  )
}

export default EditRowPickupTime
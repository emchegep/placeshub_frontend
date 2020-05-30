import React, {useContext} from "react";
import { useHistory } from 'react-router-dom'

import './PlaceForm.css'
import Input from "../../shared/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/util/validators";
import Button from "../../shared/FormElements/Button";
import {useForm} from "../../shared/hooks/form-hook";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import {AuthContext} from "../../shared/context/auth-context";
import ImageUpload from "../../shared/FormElements/ImageUpload";



const NewPlace = ()=>{
    const {isLoading, error, sendRequest,clearError} = useHttpClient()

    const auth = useContext(AuthContext)

    const history = useHistory()

    const [formState, inputHandler]=useForm({
        title:{
            value:'',
            isValid: false
        },
        description:{
            value:'',
            isValid: false
        },
        address:{
            value:'',
            isValid: false
        },
        image:{
            value:null,
            isValid:false
        }
    },
        false)


    const placeSubmitHandler = async event =>{
    event.preventDefault()

    try {
        let formData = new FormData()
        formData.append('title',formState.inputs.title.value)
        formData.append('description',formState.inputs.description.value)
        formData.append('address',formState.inputs.address.value)
        formData.append('image',formState.inputs.image.value)


        await sendRequest(process.env.REACT_APP_BACKEND_URL +'/places',
            'POST',
            {Authorization: `Bearer ${auth.token}`},
            formData
        )

        history.push('/')
    } catch (err) {}

    }
    return (
        <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
       <form className="place-form" onSubmit={placeSubmitHandler}>
           {isLoading && <LoadingSpinner asOverlay/>}
           <Input
               element="input"
               type="text"
               label="Title"
               id="title"
               errorText='Please Enter a valid Title.'
               validators={[VALIDATOR_REQUIRE()]}
               onInput={inputHandler}
           />
           <Input
               element="textarea"
               label="Description"
               id="description"
               errorText='Please Enter a valid Description (atleast 5 characters).'
               validators={[VALIDATOR_MINLENGTH(5)]}
               onInput={inputHandler}
           />
           <Input
               element="input"
               type="text"
               label="Address"
               id="address"
               errorText='Please Enter a valid Address.'
               validators={[VALIDATOR_REQUIRE()]}
               onInput={inputHandler}
           />
           <ImageUpload center id="image" onInput={inputHandler} validators={[]}/>
           <Button type="submit" disabled={!formState.isValid}>Add Place</Button>
       </form>
        </React.Fragment>
    )
}
export default NewPlace

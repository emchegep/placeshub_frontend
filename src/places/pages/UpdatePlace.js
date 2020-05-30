import React, {useContext, useEffect, useState} from "react";
import  { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import Input from "../../shared/FormElements/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/util/validators";
import Button from "../../shared/FormElements/Button";
import {useForm} from "../../shared/hooks/form-hook";

import './PlaceForm.css'
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import {AuthContext} from "../../shared/context/auth-context";

const UpdatePlace = props =>{
    const placeId = useParams().placeId;

    const [loadedPlace,setLoadedPlace]=useState()

    const history = useHistory()

    const auth = useContext(AuthContext)

    const {isLoading, error, sendRequest, clearError } = useHttpClient()



    const [formState,inputHandler,setFormData]= useForm({
        title:{
            value:'',
            isValid: false
        },
        description:{
            value: '',
            isValid: false
        }
    },
        false
    )


    useEffect(()=>{
        const fetchPlace = async ()=>{
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
                setLoadedPlace(responseData.place)
                    setFormData({
                        title:{
                            value:responseData.place.title,
                            isValid: true
                        },
                        description:{
                            value: responseData.place.description,
                            isValid: true
                        }
                    },true)
            } catch (err) {}

        }
        fetchPlace();
    },[setFormData,sendRequest,placeId])

    if (isLoading){
        return  (
            <div className="center">
                <LoadingSpinner asOverlay/>
            </div>
        )
    }

    if(!loadedPlace && !error) {
        return  (
            <div className="center">
                <h2>Could not find a place</h2>
            </div>
        )
    }

    const placeUpdateHandler = async e =>{
        e.preventDefault()
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                'PATCH',
                {
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${auth.token}`
                },
                JSON.stringify({
                    title:formState.inputs.title.value,
                    description:formState.inputs.description.value
                }))
            history.push(`/${auth.userId}/places`)
        }catch (err) {}
    }

    return (
        <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <LoadingSpinner asOverlay/>}
            {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateHandler}>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialValue={loadedPlace.title}
                initialValid={true}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description.(atleast 5 characters)"
                onInput={inputHandler}
                initialValue={loadedPlace.description}
                initialValid={true}
            />
            <Button type="submit"  disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>}
        </React.Fragment>
    )
}
export default UpdatePlace

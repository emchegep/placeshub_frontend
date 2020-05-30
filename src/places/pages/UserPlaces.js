import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import PlaceList from "../components/PlaceList";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";

const UserPlaces = props =>{
    const [loadedPlaces, setLoadedPlaces]=useState()
    const userId = useParams().userId;

    const {isLoading, error, sendRequest, clearError} = useHttpClient()

    useEffect(()=>{
        const fetchUserPlaces = async ()=>{
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`)
                setLoadedPlaces(responseData.places)
            } catch (err) {}
        }
        fetchUserPlaces()
    },[sendRequest, userId])

const placeDeleteHandler =(deletePlaceId)=>{
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place=>place.id !== deletePlaceId))
}
return <React.Fragment>
    <ErrorModal error={error} onClear={clearError}/>
    {isLoading && <LoadingSpinner asOverlay/>}
    {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
</React.Fragment>
}
export default UserPlaces

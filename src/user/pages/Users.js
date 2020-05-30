import React, {useEffect, useState} from "react";
import UserList from "../components/UserList";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import {useHttpClient} from "../../shared/hooks/http-hook";

const Users =  ()=>{
    const [loadedUsers, setLoadedUsers]=useState([])
    const { isLoading, error, sendRequest, clearError} = useHttpClient()

useEffect(()=>{
    const getUsers = async ()=>{
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`)
            setLoadedUsers(responseData.users)
        } catch (err) {}
    }
  getUsers();
},[sendRequest])

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && (<div className="center">
            <LoadingSpinner asOverlay/>
        </div>
        )}
        {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
    </React.Fragment>
}
export default Users

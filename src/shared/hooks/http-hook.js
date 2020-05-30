import {useCallback, useEffect, useRef, useState} from "react";
import { useHistory} from 'react-router-dom'
export const useHttpClient =()=>{
    const [isLoading, setIsLoading ] = useState(false)
    const [error, setError] = useState()

    const history = useHistory()
    const activeHttpRequests = useRef([])

    const sendRequest = useCallback(async (url,method='GET',headers={},body=null,)=>{
        setIsLoading(true)
        const HttpAbortCtrl = new AbortController()
        activeHttpRequests.current.push(HttpAbortCtrl)
        try {
            const response = await fetch(url,{
                method,
                headers,
                body,
                signal: HttpAbortCtrl.signal
            })

            const responseData = await response.json()

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl=>reqCtrl !== HttpAbortCtrl)

            if(!response.ok){

                throw new Error(responseData.message)
            }
            setIsLoading(false)
            return responseData
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
            throw err
        }
    },[])

    const clearError = ()=>{
        history.push('/')
        setError(null)
    }

    useEffect(()=>{
        return ()=>{
            activeHttpRequests.current.forEach(abortCtrl=>abortCtrl.abort())
        }
    },[])
    return {isLoading,error,sendRequest,clearError}
}

import React, {useContext, useState} from "react";
 import './Auth.css'
import Input from "../../shared/FormElements/Input";
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/form-hook";
import Button from "../../shared/FormElements/Button";
import Card from "../../shared/UIElements/Card";
import {AuthContext} from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/FormElements/ImageUpload";

const Auth = props =>{
    const auth = useContext(AuthContext)

    const [isLoginMode,setIsLoginMode] = useState(true)

    const { isLoading, error, sendRequest, clearError }= useHttpClient()

    const [formState, inputHandler,setFormData] = useForm({
        email:{
            value:'',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)

    const switchModeHandler = ()=>{
        if (!isLoginMode){
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            },formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode=> !prevMode)
    }
    const authSubmitHandler = async event =>{
        event.preventDefault()
        console.log(formState.inputs)
        if (isLoginMode){
            try {
               const responseData= await sendRequest(
                   process.env.REACT_APP_BACKEND_URL+'/users/login',
                    'POST',
                    {
                    'Content-Type':'application/json'
                    },
                    JSON.stringify({
                        email:formState.inputs.email.value,
                        password:formState.inputs.password.value
                    }))
                auth.login(responseData.userId, responseData.token)
            } catch (err) {}
        } else {
            try {
                let formData = new FormData()
                formData.append('name',formState.inputs.name.value)
                formData.append('email',formState.inputs.email.value)
                formData.append('password',formState.inputs.password.value)
                formData.append('image',formState.inputs.image.value)
              const responseData=  await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users/signup', 'POST', {}, formData)
                auth.login(responseData.userId,responseData.token)
            } catch (err) {}
        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
        <Card className="authentication" style={{padding:'0 1rem 1rem'}}>
            {isLoading && <LoadingSpinner asOverlay/>}
            <h2>{isLoginMode?'LOGIN':'SIGNUP'}</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode &&
                <Input
                    id="name"
                    element="input"
                    title="name"
                    label="Your Name"
                    type="text"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter username."
                    onInput={inputHandler}
                />
                }
                <Input
                    id="email"
                    element="input"
                    title="email"
                    label="Email"
                    type="email"
                    validators={[VALIDATOR_EMAIL(),VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid email."
                    onInput={inputHandler}
                />
                <Input
                    id="password"
                    element="input"
                    title="password"
                    label="Password"
                    type="password"
                    validators={[VALIDATOR_MINLENGTH(6) ]}
                    errorText="Please enter a password (atleast 6 characters)."
                    onInput={inputHandler}

                />
                {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} validators={[VALIDATOR_REQUIRE()]}/>}
                <Button type="submit" disabled={!formState.isValid}>
                    {isLoginMode? 'LOGIN':'SIGNUP'}
                </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode?'SIGNUP':'LOGIN'}</Button>
        </Card>
        </React.Fragment>
    )
}

export default Auth

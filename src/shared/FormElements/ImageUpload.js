import React, {useEffect, useRef, useState} from "react";
import Button from "./Button";

import './ImageUpload.css'

const ImageUpload = props =>{
    const [file,setFile] = useState()
    const [previewUrl,setPreviewUrl]=useState()
    const [isValid, setIsValid] = useState(false)

    const filePickerRef = useRef()

    useEffect(()=>{
        if (!file){
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = ()=>{
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    },[file])

    let pickedFile;
    let fileIsValid = isValid
    const pickedHandler = event =>{
        if (event.target.files && event.target.files.length !== 0){
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true
        } else  {
            setIsValid(false)
            fileIsValid = false
        }
        props.onInput(props.id,pickedFile,fileIsValid)
    }

    const pickImageHandler = ()=>{
        filePickerRef.current.click()
    }
    return (
        <div className="form-control">
            <input
                type="file"
                id={props.id}
                style={{display: 'none'}}
                accept=".jpg,.jpeg,.png"
                ref={filePickerRef}
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview"  onClick={pickImageHandler}>
                    {previewUrl && <img src={previewUrl} alt="preview"/>}
                    {!previewUrl && <p>UPLOAD IMAGE</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
}

export default ImageUpload

import React from "react";
import UserItem from "./UserItem";
import './UserList.css'
import Card from "../../shared/UIElements/Card";

const UserList =({items})=>{
if (items.length === 0){
    return (
        <div className="center">
            <Card  style={{padding:'0 1rem 1rem'}}>
            <h2>No Items found.</h2>
            </Card>
        </div>
    )}
    return (
        <ul className="users-list">
            {
                items.map(item=><UserItem key={item.id} id={item.id} name={item.name} image={item.image} placeCount={item.places.length}/>)
            }
        </ul>
    )
}
export default UserList

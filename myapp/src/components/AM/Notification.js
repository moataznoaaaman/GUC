import React from "react";
import axios from 'axios';

import {ListGroup,Spinner} from 'react-bootstrap';

class Notification extends React.Component
{

    constructor()
    {
        super()
 
        this.state=
        {
           info:<Spinner animation="border" variant="warning" />
        }
    }

    async componentDidMount()
    {
       
                await axios.get('http://localhost:4000/am/getnotifications', {
        headers: {
            'token': this.props.token
        }
        })

        .then(res=>
            {   //console.log(this.props.token)
                const listItems = res.data.notifications.map((d) => <ListGroup.Item key={d}>{d}</ListGroup.Item>);
                //console.log(listItems)
                this.setState(
                    {
                        info:listItems
                    }
                )
                //console.log(this.state.info)  
            })


            .catch(err=>
                {
                    this.setState(
                        {
                            info:null
                        }
                    )
                })
    }

    render()
    {
        return (
        <ListGroup>
            <ListGroup.Item key={"notification"}>notifications</ListGroup.Item>
            {this.state.info}
            </ListGroup>)
    }
}

export default Notification
import React from "react";
import axios from 'axios';

import {ListGroup,Spinner} from 'react-bootstrap';

class Schedule extends React.Component
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
       
                await axios.get('http://localhost:4000/am/viewschedule', {
        headers: {
            'token': this.props.token
        }
        })

        
        .then(res=>
            {  
                console.log(res.data); //console.log(this.props.token)
                const listItems = res.data.map((d) => <ListGroup.Item key={d._id}>{"  courseid: "+d.courseid+"||  day: "+d.day+"||  slot: "+d.slot+"||  location: "+d.location+"||  replacment(id,date): "+d.replacment}</ListGroup.Item>);
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
            <ListGroup.Item key={"schedule"}>Schedule</ListGroup.Item>
            {this.state.info}
            </ListGroup>)
    }
}

export default Schedule
import React from "react";
import axios from 'axios';
import {Container,Row,Col, ListGroup,Spinner} from 'react-bootstrap';
class StaffDept1 extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:<Spinner animation="border" variant="warning" />
           
        }
        
    }


    async  componentDidMount()
    {
        await axios.get('http://localhost:4000/ci/staffindept', { headers: {
            'token': this.props.token
        }})
        .then(res => {
           
            if (res.data==="please double check enterd data"||res.data==="an err happend while in progress") {
                this.setState(
                    {
                        info:"please double check data"
                    }
                )
            } else {
                if (res.data.length===0) {
                    this.setState(
                        {
                            info:"no data availabel"
                        }
                    )
                } else {
                    const listItems = res.data.map((d) => <ListGroup.Item key={d.id}>{"  userid: "+d.id+"||  name: "+d.name+"||  dayoff: "+d.dayoff+"||  department: "+d.department+"||email: "+d.email+"||  office: "+d.office}</ListGroup.Item>);
                
                    this.setState(
                        {
                            info:listItems
                        }
                    )
                }
               
                
            }   
        }).catch(err=>
            {
                console.log(err)
            })
    }
   

    render()
        {
            return(

<Container>
                    <Row>
                        <Col>                       
                            <ListGroup>{this.state.info}</ListGroup>       
                        </Col>
                        
                    </Row>
 </Container>
               
            )
        }
}

export default StaffDept1
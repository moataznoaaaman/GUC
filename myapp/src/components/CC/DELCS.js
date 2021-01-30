import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col} from 'react-bootstrap';
class DELCS extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:"Wating for input.....",
           coursedata:"",
           day:"",
           slot:"",
           location:"",
           

        }
        this.HandleSubmit4 = this.HandleSubmit4.bind(this);
    }

    async HandleSubmit4(event)
   {
    this.setState(
        {
            info:"loading"
        })
    
     event.preventDefault()
    await axios.delete('http://localhost:4000/cc/editcourseschedule',{ headers: {
        'token': this.props.token
    },data :{
        courseid:this.state.coursedata,
        
        day:this.state.day,
        slot:this.state.slot,
        location:this.state.location,
       
        }})
    .then(res => {
       
       this.setState(
        {
            info:res.data
        }
    )
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
                            <Card style={{ width: '15rem',height:'15rem' }}>
                                <Card.Body>
                                <Card.Title>Add course slot</Card.Title>
                                <Card.Text>
                                {this.state.info} 
                                </Card.Text>
                                </Card.Body>
                            </Card>       
                        </Col>
                        <Col>
                            <Form onSubmit={this.HandleSubmit4}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>               </Form.Label>
                                <Form.Control   placeholder="Enter Course Id" onChange={e => this.setState({ coursedata: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid ex. csen1
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>              </Form.Label>
                                <Form.Control  placeholder="Enter day" onChange={e => this.setState({ day: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid ex.["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"];
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control type="number"  placeholder="slot number" onChange={e => this.setState({ slot: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid ex. 1
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="location" onChange={e => this.setState({ location: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid d4-102
                                </Form.Text>
                            </Form.Group>
                            
                            <Button variant="primary" type="submit">
                                Delet
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default DELCS
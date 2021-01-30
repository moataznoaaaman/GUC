import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col} from 'react-bootstrap';
class UpdateSlot extends React.Component{
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
           olduserid:"",
           newuserid:"",
           replace:0

        }
        this.HandleSubmit6 = this.HandleSubmit6.bind(this);
    }

    async HandleSubmit6(event)
   {
    
     event.preventDefault()
     this.setState(
        {
            info:"loading"
        })
     await  axios.put('http://localhost:4000/ci/assignacmemtoslot',{
        courseid:this.state.coursedata,
        amidold:this.state.olduserid,
        amidnew:this.state.newuserid,
        day:this.state.day,
        slot:this.state.slot,
        location:this.state.location,
        replace:this.state.replace
    }, {
        headers: {
            'token': this.props.token
        },
        
      })
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
                                <Card.Title>update assignment of slot </Card.Title>
                                <Card.Text>
                                {this.state.info} 
                                </Card.Text>
                                </Card.Body>
                            </Card>       
                        </Col>
                        <Col>
                            <Form onSubmit={this.HandleSubmit6}>
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
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="old user id" onChange={e => this.setState({ olduserid: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="new user id" onChange={e => this.setState({ newuserid: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                               Update Assignment
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default UpdateSlot
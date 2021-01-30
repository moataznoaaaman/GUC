import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,Spinner} from 'react-bootstrap';
class UpdateCi extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:null,
           coursedata:"",
           insidold:"",
           insidnew:""

        }
        this.HandleSubmit4 = this.HandleSubmit4.bind(this);
    }

    async HandleSubmit4(event)
   {
    this.setState(
        {
            info:<Spinner animation="border" variant="warning" />
        })
     event.preventDefault()
    await axios.put('http://localhost:4000/hod/courseinstructor', {
        courseid:this.state.coursedata,
        insidold:this.state.insidold,
        insidnew:this.state.insidnew
        },{ headers: {
        'token': this.props.token
    }})
    .then(res => {
       
       this.setState(
        {
            info:<Card style={{ width: '15rem',height:'15rem' }}>
            <Card.Body>
            <Card.Title>Update course instructor</Card.Title>
            <Card.Text>
            {res.data} 
            </Card.Text>
            </Card.Body>
        </Card> 
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
                            
                                {this.state.info} 
                                      
                        </Col>
                        <Col>
                            <Form onSubmit={this.HandleSubmit4}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>               </Form.Label>
                                <Form.Control   placeholder="Course Id" onChange={e => this.setState({ coursedata: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid ex. csen1
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>               </Form.Label>
                                <Form.Control   placeholder="old staff member id" onChange={e => this.setState({ insidold: e.target.value })}/>
                                
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>              </Form.Label>
                                <Form.Control  placeholder="new staff member id" onChange={e => this.setState({ insidnew: e.target.value })}/>
                                
                            </Form.Group>
                            
                            <Button variant="primary" type="submit">
                                update
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default UpdateCi
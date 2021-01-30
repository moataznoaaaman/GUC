import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,Spinner} from 'react-bootstrap';
class DeletCi extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:null,
           coursedata:"",
           insid:""

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
     await  axios.delete('http://localhost:4000/hod/courseinstructor', {
        headers: {
            'token': this.props.token
        },
        data: {
            courseid:this.state.coursedata,
        insid:this.state.insid
        }
      })
    .then(res => {
       
       this.setState(
        {
            info:<Card style={{ width: '15rem',height:'15rem' }}>
            <Card.Body>
            <Card.Title>Delet course instructor</Card.Title>
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
                                <Form.Control   placeholder="Enter Course Id" onChange={e => this.setState({ coursedata: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid ex. csen1
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>              </Form.Label>
                                <Form.Control  placeholder="Enter staff member id" onChange={e => this.setState({ insid: e.target.value })}/>
                                
                            </Form.Group>
                            
                            <Button variant="primary" type="submit">
                                Delete
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default DeletCi
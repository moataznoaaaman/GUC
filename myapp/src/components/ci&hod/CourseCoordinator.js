import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,Spinner} from 'react-bootstrap';

class CourseCoordinator extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:null,
           coursedata:"",
           amid:""
        }
        this.HandleSubmit8 = this.HandleSubmit8.bind(this);
    }

    async HandleSubmit8(event)
   {
    // console.log(this.state)
    event.preventDefault()
    this.setState(
        {
            info:<Spinner animation="border" variant="warning" />
        }
    )
    await axios.post('http://localhost:4000/ci/assigncoordinator', {
        courseid:[this.state.coursedata],
            amid:this.state.amid
        },{ headers: {
        'token': this.props.token
    }})
    
    .then(res => {
       
       this.setState(
        {
            info:<Card style={{ width: '15rem',height:'15rem' }}>
            <Card.Body>
            <Card.Title>Assign coordinator</Card.Title>
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
                            <Form onSubmit={this.HandleSubmit8}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="Enter Course Id" onChange={e => this.setState({ coursedata: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that you are related to this course
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="Enter user id" onChange={e => this.setState({ amid: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that it is valid
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Assign
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default CourseCoordinator
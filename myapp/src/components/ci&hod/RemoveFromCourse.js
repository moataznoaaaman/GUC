import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,Spinner} from 'react-bootstrap';
class RemoveFromCourse extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:null,
           coursedata:"",
           amid:""
        }
        this.HandleSubmit7 = this.HandleSubmit7.bind(this);
    }

    async HandleSubmit7(event)
   {
    // console.log(this.state)
    event.preventDefault()
    this.setState(
        {
            info:<Spinner animation="border" variant="warning" />
        })
    await  axios.delete('http://localhost:4000/ci/removememfromcourse', {
        headers: {
            'token': this.props.token
        },
        data: {
            courseid:[this.state.coursedata],
            amid:this.state.amid
        }
      })
    .then(res => {
       
       this.setState(
        {
            info:<Card style={{ width: '15rem',height:'15rem' }}>
            <Card.Body>
            <Card.Title>Remove member from course</Card.Title>
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
                            <Form onSubmit={this.HandleSubmit7}>
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
                                remove
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default RemoveFromCourse
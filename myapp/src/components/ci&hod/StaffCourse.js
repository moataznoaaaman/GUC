import React from "react";
import axios from 'axios';
import { Form ,Button,Container,Row,Col,ListGroup,Spinner,Card} from 'react-bootstrap';
class StaffInCourse extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:null,
           coursedata:""
        }
        this.HandleSubmit3 = this.HandleSubmit3.bind(this);
    }

    async HandleSubmit3(event)
   {
    this.setState(
        {
            info:<Spinner animation="border" variant="warning" />
        }
    )
    // console.log(this.state)
    event.preventDefault()
    await axios.post('http://localhost:4000/ci/staffincourse', {courseid:[this.state.coursedata]},{ headers: {
        'token': this.props.token
    }}) 
    .then(res => {
        //console.log(res.data)
        if (res.data==="please double check data"||res.data==="an err happend while in progress") {
            this.setState(
                {
                    info:<Card style={{ width: '15rem',height:'5rem' }}>
                    <Card.Body>
                    
                        <Card.Text>
                       no such course
                        </Card.Text>
                        
                    </Card.Body>
                    </Card>
                }
            )
        } else {
            const listItems = res.data.map((d) => <ListGroup.Item key={d.id}>{"  userid: "+d.id+"||  name: "+d.name+"||  dayoff: "+d.dayoff+"||  department: "+d.department+"||  email: "+d.email+"||  office: "+d.office}</ListGroup.Item>);
            //console.log(res.data)
           //"courseid: "+this.state.info[0].courseid+"  coverage:"+this.state.info[0].coverage
            this.setState(
                {
                    info:listItems
                }
            )
            // console.log(listItems)
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
                        <Col>
                            <Form onSubmit={this.HandleSubmit3}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="Enter Course Id" onChange={e => this.setState({ coursedata: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that you are related to this course
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Get Staff
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default StaffInCourse
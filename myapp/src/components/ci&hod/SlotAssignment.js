import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,ListGroup,Spinner} from 'react-bootstrap';
class SlotAssignment extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:null,
           coursedata:""
        }
        this.HandleSubmit2 = this.HandleSubmit2.bind(this);
    }

    async HandleSubmit2(event)
   {
    this.setState(
        {
            info:<Spinner animation="border" variant="warning" />
        }
    )
    // console.log(this.state)
    event.preventDefault()
    await axios.post('http://localhost:4000/ci/slotsassignment', {courseid:[this.state.coursedata]},{ headers: {
        'token': this.props.token
    }})
    .then(res => {
       // const resbo = res.data;
        if (res.data==="please double check data"||res.data==="an err happend while in progress") {
            this.setState(
                {
                    info:<Card style={{ width: '15rem',height:'10rem' }}>
                    <Card.Body>
                    <Card.Text>
                    please double check data
                    </Card.Text>
                    </Card.Body>
                </Card>
                }
            )
        } else {
            const listItems = res.data.map((d) => <ListGroup.Item key={d.userid}>{"  courseid: "+d.courseid+"||  day: "+d.day+"||  slot: "+d.slot+"||  location: "+d.location+"||  replacment(id,date): "+d.replacment+"||  userid: "+d.userid}</ListGroup.Item>);
            //console.log(res.data.token)
           //"courseid: "+this.state.info[0].courseid+"  coverage:"+this.state.info[0].coverage
            this.setState(
                {
                    info:<ListGroup>{listItems}</ListGroup>
                }
            )
            //console.log(listItems)
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
                            
                                {this.state.info} 
                                       
                        </Col>
                        <Col>
                            <Form onSubmit={this.HandleSubmit2}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="Enter Course Id" onChange={e => this.setState({ coursedata: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that you are related to this course
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Get Slot Assignment
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default SlotAssignment
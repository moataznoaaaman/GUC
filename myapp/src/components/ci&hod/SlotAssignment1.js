import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,ListGroup,Spinner} from 'react-bootstrap';
class SlotAssignment1 extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:"Wating for input.....",
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
    await axios.post('http://localhost:4000/hod/teachingassignments', {courseid:this.state.coursedata},{ headers: {
        'token': this.props.token
    }})
    .then(res => {
       // const resbo = res.data;
       //console.log(res.data)
        if (res.data==="please double check the enterd data"||res.data==="an err happend while in progress") {
            this.setState(
                {
                    info:<Card style={{ width: '15rem',height:'15rem' }}>
                    <Card.Body>
                        
                         
                         <Card.Text>
                         please double check the enterd data
                         </Card.Text>
                         
                     </Card.Body>
                     </Card>
                }
            )
        } else {//<ListGroup.Item key={d.id}>{" request id: "+d.id+"||  reason: "+d.reason+"||  sender id: "+d.senderid+"||  targetdate: "+d.targetdate+"||  type: "+d.type+"||  replacment id: "+d.replacmentid}</ListGroup.Item>
            const listItems = res.data.map((d) => <ListGroup.Item key={d.userid}>{"  courseid: "+d.courseid+"||  day: "+d.day+"||  slot: "+d.slot+"||  location: "+d.location+"||  replacment(id,date): "+d.replacment+"||  userid: "+d.userid}</ListGroup.Item>);
            //console.log(res.data.token)
           //"courseid: "+this.state.info[0].courseid+"  coverage:"+this.state.info[0].coverage
            this.setState(
                {
                    info:listItems
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
            let x;
            if (this.state.info==="Wating for input.....") {
                x=(<Card style={{ width: '15rem',height:'15rem' }}>
                <Card.Body>
                     <Card.Title>Teaching assignment</Card.Title>
                     
                     <Card.Text>
                    {this.state.info}
                     </Card.Text>
                     
                 </Card.Body>
                 </Card>)
            } else {
                x=(this.state.info)
            }
            return(

<Container>
                    <Row>
                        <Col>                       
                        <ListGroup>
                        {x}
                       </ListGroup>   
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

export default SlotAssignment1
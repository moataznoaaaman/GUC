import React from "react";
import axios from 'axios';
import { Form ,Button,Container,Row,Col,Spinner,Card} from 'react-bootstrap';
export default class SendRepReq extends React.Component
{
    constructor()
    {
        super()
        this.state=(
            {
              info:null,
              reqid:"",
              day:"",
              slot:"",
              location:"",
              courseid:""
            }
        )

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
    
    await axios.post('http://localhost:4000/am1/sendlinkingrequest', {reqid:this.state.reqid,id:this.props.userid,day:this.state.day,slot:this.state.slot,location:this.state.location,course:this.state.courseid},{ headers: {
        'token': this.props.token
    }}) 
    .then(res => {
        //console.log(res.data)
        
            this.setState(
                {
                    info:<Card style={{ width: '15rem',height:'5rem' }}>
                    <Card.Body>
                    
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
            //console.log(this.props.token)
            return(

<Container>
                    <Row>
                        <Col>                       
                            {this.state.info}     
                        </Col>
                        <Col>
                            <Form onSubmit={this.HandleSubmit3}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="reqest id" onChange={e => this.setState({ reqid: e.target.value })}/>
                                <Form.Text className="text-muted">
                               make a unique id for your request
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="day" onChange={e => this.setState({ day: e.target.value })}/>
                                <Form.Text className="text-muted">
                                ex: sunday, monday, tuesday, wednesday, thursday, friday, saturday
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="slot" onChange={e => this.setState({ slot: e.target.value })}/>
                                <Form.Text className="text-muted">
                                must be number ex 1 4 2
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="location" onChange={e => this.setState({ location: e.target.value })}/>
                                <Form.Text className="text-muted">
                                the location of the slot
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="course id" onChange={e => this.setState({ courseid: e.target.value })}/>
                                <Form.Text className="text-muted">
                                the target course of that slot
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                send
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}


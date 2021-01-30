import React from "react";
import axios from 'axios';
import { Form ,Button,Container,Row,Col,Spinner,Card} from 'react-bootstrap';
export default class ChangeDayOff extends React.Component
{
    constructor()
    {
        super()
        this.state=(
            {
              info:null,
              reqid:"",
              newday:""
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
    await axios.post('http://localhost:4000/am/changedayoff', {requestid:this.state.reqid,newday:this.state.newday},{ headers: {
        'token': this.props.token
    }}) 
    .then(res => {
        //console.log(res.data)
        if (res.data==="please double check enterd data"||res.data==="an err happend while in progress") {
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
        } else {
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
                            <Form onSubmit={this.HandleSubmit3}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="request id" onChange={e => this.setState({ reqid: e.target.value })}/>
                                <Form.Text className="text-muted">
                               make a unique id for your request
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="day" onChange={e => this.setState({ newday: e.target.value })}/>
                                <Form.Text className="text-muted">
                               ex: sunday, monday, tuesday, wednesday, thursday, friday, saturday
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                create
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}


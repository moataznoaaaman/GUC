import React from "react";
import axios from 'axios';
import { Form ,Button,Container,Row,Col,ListGroup,Spinner,Card} from 'react-bootstrap';
class StaffInCourse extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
            info:<Spinner animation="border" variant="warning" />,
           actioninfo:null,
           reqdata:""
        }
        this.HandleSubmit3 = this.HandleSubmit3.bind(this);
    }

    async  componentDidMount()
    {
        await axios.get('http://localhost:4000/am/getrequests', { headers: {
            'token': this.props.token
        }})
        .then(res => {
           
            if (res.data==="please double check enterd data"||res.data==="an err happend while in progress") {
                this.setState(
                    {
                        info:"please double check data"
                    }
                )
            } else {
                if (res.data.length===0) {
                    this.setState(
                        {
                            info:"no data availabel"
                        }
                    )
                } else {
                    const listItems = res.data.map((d) => <ListGroup.Item key={d.id}>{"  id: "+d.id+"||  type: "+d.type+"||  status: "+d.status+"||  target date: "+d.targetdate}</ListGroup.Item>);
                
                    this.setState(
                        {
                            info:listItems
                        }
                    )
                }
               
                
            }   
        }).catch(err=>
            {
                console.log(err)
            })
    }
    async  componentDidUpdate()
    {
        await axios.get('http://localhost:4000/am/getrequests', { headers: {
            'token': this.props.token
        }})
        .then(res => {
           
            if (res.data==="please double check enterd data"||res.data==="an err happend while in progress") {
                this.setState(
                    {
                        info:<Card style={{ width: '15rem',height:'5rem' }}>
                        <Card.Body>
                        
                            <Card.Text>
                            please double check enterd data
                            </Card.Text>
                            
                        </Card.Body>
                        </Card>
                    }
                )
            } else {
                if (res.data.length===0) {
                    this.setState(
                        {
                            info:<Card style={{ width: '15rem',height:'5rem' }}>
                            <Card.Body>
                            
                                <Card.Text>
                                no data available
                                </Card.Text>
                                
                            </Card.Body>
                            </Card>
                        }
                    )
                } else {
                    const listItems = res.data.map((d) => <ListGroup.Item key={d.id}>{"  id: "+d.id+"||  type: "+d.type+"||  status: "+d.status}</ListGroup.Item>);
                
                    this.setState(
                        {
                            info:listItems
                        }
                    )
                }
               
                
            }   
        }).catch(err=>
            {
                console.log(err)
            })
    }
    

    async HandleSubmit3(event)
   {
    this.setState(
        {
            actioninfo:<Spinner animation="border" variant="warning" />
        }
    )
    // console.log(this.state)
    event.preventDefault()
    await  axios.delete('http://localhost:4000/am/cancelrequest', {
        headers: {
            'token': this.props.token
        },
        data: {
            requestid:this.state.reqdata
        }
      })
    .then(res => {
        //console.log(res.data)
        if (res.data==="please double check enterd data"||res.data==="an err happend while in progress") {
            this.setState(
                {
                    actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
                    <Card.Body>
                    
                        <Card.Text>
                       no such request
                        </Card.Text>
                        
                    </Card.Body>
                    </Card>
                }
            )
        } else {
            this.setState(
                {
                    actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
                    <Card.Body>
                    
                        <Card.Text>
                       {res.data}
                        </Card.Text>
                        
                    </Card.Body>
                    </Card>
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
                            <ListGroup>{this.state.actioninfo}</ListGroup>       
                        </Col>
                        <Col>
                            <Form onSubmit={this.HandleSubmit3}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="Request Id" onChange={e => this.setState({ reqdata: e.target.value })}/>
                                
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                cancel request
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default StaffInCourse
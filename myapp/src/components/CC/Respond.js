import React from "react";
import axios from 'axios';
import { Form ,Button,Container,Row,Col,Spinner,Card, ListGroup} from 'react-bootstrap';
export default class Respond extends React.Component
{
    constructor()
    {
        super()
        this.state=(
            {
              info:null,
              actioninfo:<Spinner animation="border" variant="warning" />,
              
              reqid:""
              
            }
        )

        this.HandleSubmit3 = this.HandleSubmit3.bind(this);
        this.HandleSubmit4 = this.HandleSubmit4.bind(this);
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
    await axios.post('http://localhost:4000/cc/acceptslotlinking', {id:this.state.reqid},{ headers: {
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

async HandleSubmit4(event)
{
    this.setState(
        {
            info:<Spinner animation="border" variant="warning" />
        }
    )
    // console.log(this.state)
    event.preventDefault()
    await axios.post('http://localhost:4000/cc/rejectslotlinking', {id:this.state.reqid},{ headers: {
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
async  componentDidMount()
    {
       
        await axios.get('http://localhost:4000/cc/viewslotlinking',{headers:{
            'token':this.props.token
        }})

        .then(res=>
            {
                
                
                if (res.data==="please double check enterd data"||res.data==="an err happend while in progress") {
                    this.setState(
                        {
                            actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
                                <Card.Body>
                                
                                    <Card.Text>error occerd  
                                    </Card.Text>
                                    
                                </Card.Body>
                                </Card>
                        }
                    )
                } else {
                    if (res.data.length===0) {
                        this.setState(
                            {
                                actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
                                <Card.Body>
                                
                                    <Card.Text>
                                     there are no requests
                                    </Card.Text>
                                    
                                </Card.Body>
                                </Card>
                            }
                        )
                    } else {
                        const listItems = res.data.map((d) => <ListGroup.Item key={d.id}>{"  id: "+d.id+"||  type: "+d.type+"||  status: "+d.status+"||   course: "+d.course+"||   slot: "+d.slot+"  ||location:"+d.location}</ListGroup.Item>);
                    
                        this.setState(
                            {
                                actioninfo:<ListGroup>{listItems}</ListGroup>
                            }
                        )
                    }
                   
                    
                }   
            })
            .catch(err=>
                {
                    console.log(err)
                })
            }
    
    async  componentDidUpdate()
    {
        
       
        await axios.get('http://localhost:4000/cc/viewslotlinking',{headers:{
            'token':this.props.token
        }})

        .then(res=>
            {
                
                
                if (res.data==="please double check enterd data"||res.data==="an err happend while in progress") {
                    this.setState(
                        {
                            actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
                                <Card.Body>
                                
                                    <Card.Text>error occerd  
                                    </Card.Text>
                                    
                                </Card.Body>
                                </Card>
                        }
                    )
                } else {
                    if (res.data.length===0) {
                        this.setState(
                            {
                                actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
                                <Card.Body>
                                
                                    <Card.Text>
                                     there are no requests
                                    </Card.Text>
                                    
                                </Card.Body>
                                </Card>
                            }
                        )
                    } else {
                        const listItems = res.data.map((d) => <ListGroup.Item key={d.id}>{"  id: "+d.id+"||  type: "+d.type+"||  status: "+d.status+"||   course: "+d.course+"||   slot: "+d.slot+"  ||location:"+d.location}</ListGroup.Item>);
                    
                        this.setState(
                            {
                                actioninfo:<ListGroup>{listItems}</ListGroup>
                            }
                        )
                    }
                   
                    
                }   
            })
            .catch(err=>
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
                            {this.state.actioninfo}     
                        </Col>
                        <Col>                       
                            {this.state.info}     
                        </Col>
                        <Col>
                            <Form onSubmit={this.HandleSubmit3}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="request id" onChange={e => this.setState({ reqid: e.target.value })}/>
                                
                            </Form.Group>

                           
                            <Button variant="primary" type="submit">
                                accept
                            </Button>
                            </Form>

                            <Form onSubmit={this.HandleSubmit4}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="request id" onChange={e => this.setState({ reqid: e.target.value })}/>
                                
                            </Form.Group>

                           
                            <Button variant="primary" type="submit">
                                reject
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}


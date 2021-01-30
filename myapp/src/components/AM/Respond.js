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
    await axios.post('http://localhost:4000/am/ansewrrequest', {answer:"accepted",requestid:this.state.reqid},{ headers: {
        'token': this.props.token
    }}) 
    .then(res => {
        //console.log(res.data)
        if (res.data==="no such course"||res.data==="an err happend while in progress") {
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

async HandleSubmit4(event)
{
 this.setState(
     {
         info:<Spinner animation="border" variant="warning" />
     }
 )
 // console.log(this.state)
 event.preventDefault()
 await axios.post('http://localhost:4000/am/ansewrrequest', {answer:"rejected",requestid:this.state.reqid},{ headers: {
     'token': this.props.token
 }}) 
 .then(res => {
     //console.log(res.data)
     if (res.data==="no such course"||res.data==="an err happend while in progress") {
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
async  componentDidMount()
    {
        await axios.get('http://localhost:4000/am/replacmentrequest', { headers: {
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
                    const listItems = res.data.map((d) => <ListGroup.Item key={d.id}>{"  id: "+d.id+"||  type: "+d.type+"||  status: "+d.status+"||  target date: "+d.targetdate}</ListGroup.Item>);
                
                    this.setState(
                        {
                            actioninfo:<ListGroup>{listItems}</ListGroup>
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
        await axios.get('http://localhost:4000/am/replacmentrequest', { headers: {
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
                    const listItems = res.data.map((d) => <ListGroup.Item key={d.id}>{"  id: "+d.id+"||  type: "+d.type+"||  status: "+d.status+"||  target date: "+d.targetdate+"||email: "}</ListGroup.Item>);
                
                    this.setState(
                        {
                            actioninfo:<ListGroup>{listItems}</ListGroup>
                        }
                    )
                }
               
                
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


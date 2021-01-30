import React from "react";
import axios from 'axios';

import { ListGroup,Spinner,Col,Form,Button,Card} from 'react-bootstrap';
export default class ViewLeaveRequest extends React.Component
{
    constructor()
    {
        super()
        this.state ={
          info:null,
          acceptreq:"",
          
          rejectreq:"",
          comment:"NA",
          actioninfo:null
        }
        this.HandleSubmit10 = this.HandleSubmit10.bind(this);
        this.HandleSubmit11 = this.HandleSubmit11.bind(this);
    } 
    
    async HandleSubmit11(event)
   {
    
     event.preventDefault()
     this.setState(
         {
            actioninfo:<Spinner animation="border" variant="warning" />
         }
     )
         //console.log(this.props.token)
     await  axios.delete('http://localhost:4000/hod/leaverequests', {
        headers: {
            'token': this.props.token
        },
        data: {
            requestid:this.state.rejectreq,
            comment:this.state.comment
        }
      })
    .then(res => {
       
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
    }).catch(err=>
        {
            console.log(err)
        })
}
 

    async HandleSubmit10(event)
    {
        event.preventDefault()
        this.setState(
            {
               actioninfo:<Spinner animation="border" variant="warning" />
            }
        )
    await axios.post('http://localhost:4000/hod/leaverequests', {requestid:this.state.acceptreq},{ headers: {
        'token': this.props.token
    }})
    .then(res => {
       // const resbo = res.data;
        
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
            
    }).catch(err=>
        {
            console.log(err)
        })
    }

    async componentDidUpdate()
    {
        await axios.get('http://localhost:4000/hod/leaverequests', {
            headers: {
                'token': this.props.token
            }
            })
            .then(res=>
                {
                    
                    //console.log(res.data)
                    const listItems = res.data.map((d) =>{
                        if (d.type==="annualleaverequest") {
                            return <ListGroup.Item key={d.id}>{" request id: "+d.id+"||  reason: "+d.reason+"||  sender id: "+d.senderid+"||  targetdate: "+d.targetdate+"||  type: "+d.type+"||  replacment id: "+d.replacmentid}</ListGroup.Item>
                        } else {
                            return <ListGroup.Item key={d.id}>{" request id: "+d.id+"||  reason: "+d.reason+"||  sender id: "+d.senderid+"||  targetdate: "+d.targetdate+"||  type: "+d.type}</ListGroup.Item>
                        }
                        });
                    //console.log(this.state)
                    this.setState( 
                        {
                            info:listItems
                        }
                    )
                   // console.log(this.state)  
                }).catch(err=>
                    {
                        console.log(err)
                    })
    }
    async componentDidMount()
    {
        await axios.get('http://localhost:4000/hod/leaverequests', {
        headers: {
            'token': this.props.token
        }
        })
        .then(res=>
            {
                
                //console.log(res.data)
                const listItems = res.data.map((d) =>{
                    if (d.type==="annualleaverequest") {
                        return <ListGroup.Item key={d.id}>{" request id: "+d.id+"||  reason: "+d.reason+"||  sender id: "+d.senderid+"||  targetdate: "+d.targetdate+"||  type: "+d.type+"||  replacment id: "+d.replacmentid}</ListGroup.Item>
                    } else {
                        return <ListGroup.Item key={d.id}>{" request id: "+d.id+"||  reason: "+d.reason+"||  sender id: "+d.senderid+"||  targetdate: "+d.targetdate+"||  type: "+d.type}</ListGroup.Item>
                    }
                    });
                //console.log(listItems)
                this.setState( 
                    {
                        info:<ListGroup>{listItems}</ListGroup>
                    }
                )
                //console.log(this.state.info)  
            }).catch(err=>
                {
                    console.log(err)
                })
    }
    render()
    {let x;
        if (this.state.info===null) {
            x=(<Spinner animation="border" variant="warning" />)
        } else {
            x=(this.state.info)
        }
        return(<Col>
                   
                        {x}
                   
               
                    {this.state.actioninfo}
                <Form onSubmit={this.HandleSubmit10}>
                            <Form.Group controlId="formBasicEmail1">
                                <Form.Label style={{color:"white"}}>  Accept request </Form.Label>
                                <Form.Control  placeholder="Enter request id" onChange={e => this.setState({ acceptreq: e.target.value })}/>
                                {/* <Form.Text className="text-muted">
                                pleas make sure that you are related to this course
                                </Form.Text> */}
                            </Form.Group>
                            
                            <Button variant="primary" type="submit">
                                accept request
                            </Button>
                            </Form>
                
                    
                    <Form onSubmit={this.HandleSubmit11}>
                            <Form.Group controlId="formBasicEmail3">
                                <Form.Label style={{color:"white"}}>  Reject request </Form.Label>
                                <Form.Control  placeholder="Enter request id" onChange={e => this.setState({ rejectreq: e.target.value })}/>
                                {/* <Form.Text className="text-muted">
                                pleas make sure that you are related to this course
                                </Form.Text> */}
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail4">
                                <Form.Label style={{color:"white"}}> comment </Form.Label>
                                <Form.Control  placeholder="Enter optional comment" onChange={e => this.setState({ comment: e.target.value })}/>
                                {/* <Form.Text className="text-muted">
                                pleas make sure that you are related to this course
                                </Form.Text> */}
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                reject request
                            </Button>
                            </Form>
                    
                
        </Col>
            
            
        )
    }
}
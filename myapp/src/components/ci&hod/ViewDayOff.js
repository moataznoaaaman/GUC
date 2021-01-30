import React from "react";
import axios from 'axios';

import { ListGroup,Spinner,Col,Form,Button,Card} from 'react-bootstrap';
export default class ViewDayOff extends React.Component
{
    constructor()
    {
        super()
        this.state ={
          info:null,
          dayoffsingle:"", 
          actioninfo:null
        }
        this.HandleSubmit11 = this.HandleSubmit11.bind(this);
        this.HandleSubmit12 = this.HandleSubmit12.bind(this);
    } 
    
    async HandleSubmit12(event)
   {//all
    this.setState(
        {
            actioninfo:<Spinner animation="border" variant="warning" />
        }
    )
     event.preventDefault()
     this.setState(
         {
            actioninfo:<Spinner animation="border" variant="warning" />
         }
     )
         //console.log(this.props.token)
         await axios.get('http://localhost:4000/hod/getdoffall',{ headers: {
            'token': this.props.token
        }})
        .then(res => {
           // console.log(res.data)
       if (res.data.length!==0) {
        let result=res.data.map(d=><ListGroup.Item key={d.id}>{" user id: "+d.id+"||  dayoff: "+d.dayoff+"||  name: "+d.name}</ListGroup.Item>)
        this.setState(
            {
                info:result,
                actioninfo:null
            }
        )   
       } else {
        this.setState(
            {
               actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
               <Card.Body>
               
                   <Card.Text>
                   no data
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
 

    async HandleSubmit11(event)
    {//single
        event.preventDefault()
     this.setState(
         {
            actioninfo:<Spinner animation="border" variant="warning" />
         }
     )
         
         await axios.post('http://localhost:4000/hod/getdoffsingle', {userid:this.state.dayoffsingle},{ headers: {
        'token': this.props.token
    }})
        .then(res => {
            //console.log(res.data)
            if (res.data==="please double check enterd data") {
                this.setState(
                    {  info:null,
                       actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
                       <Card.Body>
                       
                           <Card.Text>
                           no such user
                           </Card.Text>
                           
                       </Card.Body>
                       </Card>
                    }
                )
            }
            else if (res.data.length!==0) {
                this.setState(
                    {
                        info:<ListGroup.Item key={res.data[0].id}>{" user id: "+res.data[0].id+"||  dayoff: "+res.data[0].dayoff+"||  name: "+res.data[0].name}</ListGroup.Item>,
                        actioninfo:null
                    }
                )   
            }
            else{
                this.setState(
                    {  info:null,
                       actioninfo:<Card style={{ width: '15rem',height:'5rem' }}>
                       <Card.Body>
                       
                           <Card.Text>
                           no such user
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
    {let x;
        if (this.state.info===null) {
            x=(null)//<Spinner animation="border" variant="warning" />
        } else {
            x=(this.state.info)
        }
        return(<Col>
                   <ListGroup>
                        {x}
                    </ListGroup>
                    <ListGroup>
                        {this.state.actioninfo}
                    </ListGroup>
                    <Button variant="primary"  onClick={this.HandleSubmit12}>
                                get dayoff of all members
                            </Button>
                            <Form onSubmit={this.HandleSubmit11}>
                            <Form.Group controlId="formBasicEmail4">
                                <Form.Label style={{color:"white"}}>user id</Form.Label>
                                <Form.Control  placeholder="Enter user id" onChange={e => this.setState({ dayoffsingle: e.target.value })}/>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                get dayoff
                            </Button>
                            </Form> 
                    
                
        </Col>
            
            
        )
    }
}
import React from "react";
import axios from 'axios';
import { Form ,Button,Container,Row,Col,Spinner,Card} from 'react-bootstrap';
export default class MatLeave extends React.Component
{
    constructor()
    {
        super()
        this.state=(
            {
              info:null,
              reqid:"",
              targetdate:"",
              document:null,
              reason:"none"
              
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
    await axios.post('http://localhost:4000/am/maternityleave', {requestid:this.state.reqid,targetdate:this.state.targetdate,document:this.state.document,reason:this.reason},{ headers: {
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
                                <Form.Control  placeholder="req id" onChange={e => this.setState({ reqid: e.target.value })}/>
                                <Form.Text className="text-muted">
                               make a unique id for your request
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="target date" onChange={e => this.setState({ targetdate: e.target.value })}/>
                                <Form.Text className="text-muted">
                                ex: 2020-12-25T13:19:37.143+00:00
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="document" onChange={e => this.setState({ document: e.target.value })}/>
                                <Form.Text className="text-muted">
                               required
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


import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,Spinner} from 'react-bootstrap';
class CoursCoverag extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:null,
           coursedata:""
        }
        this.HandleSubmit1 = this.HandleSubmit1.bind(this);
    }

    async HandleSubmit1(event)
   {
    this.setState(
        {
            info:<Spinner animation="border" variant="warning" />
        }
    )
    // console.log(this.state)
    event.preventDefault()
    await axios.post('http://localhost:4000/ci/coursecoverage', {courseid:[this.state.coursedata]},{ headers: {
        'token': this.props.token
    }})
    .then(res => {
        const resbo = res.data;
        if (resbo==="please double check data"||resbo==="an err happend while in progress") {
            this.setState(
                {
                    info:<Card style={{ width: '15rem',height:'15rem' }}>
                    <Card.Body>
                    <Card.Title>desired course coverage</Card.Title>
                    <Card.Text>
                    please double check data
                    </Card.Text>
                    </Card.Body>
                </Card>  
                }
            )
        } else {
            //console.log(res.data.token)
           //"courseid: "+this.state.info[0].courseid+"  coverage:"+this.state.info[0].coverage
            this.setState(
                {
                    info:<Card style={{ width: '15rem',height:'15rem' }}>
                    <Card.Body>
                    <Card.Title>desired course coverage</Card.Title>
                    <Card.Text>
                    {"courseid: "+resbo[0].courseid+",  coverage:"+resbo[0].coverage}
                    </Card.Text>
                    </Card.Body>
                </Card>  
                }
            )
            //console.log(res.data)
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
                            <Form onSubmit={this.HandleSubmit1}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>                   </Form.Label>
                                <Form.Control  placeholder="Enter Course Id" onChange={e => this.setState({ coursedata: e.target.value })}/>
                                <Form.Text className="text-muted">
                                pleas make sure that you are related to this course
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Get Coverage
                            </Button>
                            </Form>
                         </Col>
                    </Row>
 </Container>
               
            )
        }
}

export default CoursCoverag
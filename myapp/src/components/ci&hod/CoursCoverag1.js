import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col} from 'react-bootstrap';
class CoursCoverag extends React.Component{
    constructor()
    {
        super()

        this.state=
        {
           info:"wating for input......",
           coursedata:""
        }
        this.HandleSubmit1 = this.HandleSubmit1.bind(this);
    }

    async HandleSubmit1(event)   
   {
    // console.log(this.state)
    event.preventDefault()
    this.setState(
        {
            info:"loading...."
        }
    )
    await axios.post('http://localhost:4000/hod/coursecoverage', {courseid:this.state.coursedata},{ headers: {
        'token': this.props.token
    }})
    .then(res => {
        const resbo = res.data;
        //console.log(res.data)
        if (resbo==="please double check the enterd data"||resbo==="an err happend while in progress") {
            this.setState(
                {
                    info:resbo
                }
            )
        } else {
            //console.log(res.data)
           //"courseid: "+this.state.info[0].courseid+"  coverage:"+this.state.info[0].coverage
            this.setState(
                {
                    info:"  coverage:"+resbo.coverage
                }
            )
            //console.log(this.state)
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
                            <Card style={{ width: '20rem',height:'15rem' }}>
                                <Card.Body>
                                <Card.Title>the desired course coverage</Card.Title>
                                <Card.Text>
                                {this.state.info} 
                                </Card.Text>
                                </Card.Body>
                            </Card>       
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
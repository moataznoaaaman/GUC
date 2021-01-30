import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,Spinner} from 'react-bootstrap';

class UpdateProfile extends React.Component{
    constructor(){
        super()
        this.state={
            info:null,
            newEmail:""
        }
        this.HandleUpdate=this.HandleUpdate.bind(this)
    }
    async HandleUpdate(event){
        event.preventDefault()
        this.setState({
            info:<Spinner animation="border" variant="warning" />
        })
        await axios.put('http://localhost:4000/authentication/profile',{email:this.state.newEmail},{headers:{
            'token':this.props.token
        }}).then(result=>{
            if(result.data==="user updated"){
                this.setState({
                    info:
                    <Card bg={'success'} style={{ width: '15rem',height:'10rem' }}>
                        <Card.Body>
                            <Card.Text style={{color: 'white'}}>
                                Profile is Updated Successfully
                            </Card.Text>
                        </Card.Body>
                    </Card>
                })
            }
            else{
                this.setState({
                    info:
                    <Card bg={'warning'} style={{ width: '15rem',height:'10rem' }}>
                        <Card.Body>
                            <Card.Text style={{color: 'white'}}>
                                An error has ocurred while updating profile
                            </Card.Text>
                        </Card.Body>
                    </Card>
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    render(){
        return(
            <Container>
                <Row>
                    <Col>
                        {this.state.info}
                    </Col>
                    <Col>
                        <Form onSubmit={this.HandleUpdate}>
                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>        </Form.Label>
                                <Form.Control type="email" placeholder="Enter your new email" onChange={e => this.setState({ newEmail: e.target.value })}/>
                                <Form.Text className="text-muted">
                                    pleas make sure that your email is unique
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Update Profile
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default UpdateProfile
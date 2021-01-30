import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,Spinner} from 'react-bootstrap';

class ResetPassword extends React.Component{
    constructor(){
        super()
        this.state={
            info:null,
            newPass:""
        }
        this.HandleNewPass=this.HandleNewPass.bind(this)
    }
    async HandleNewPass(event){
        event.preventDefault()
        this.setState({
            info:<Spinner animation="border" variant="warning" />
        })
        if(this.state.newPass.length<6){
            this.setState({
                info:
                <Card bg={'warning'} style={{ width: '15rem',height:'10rem' }}>
                    <Card.Body>
                        <Card.Text style={{color: 'white'}}>
                            Password must be 6 characters long
                        </Card.Text>
                    </Card.Body>
                </Card>
            })
        }
        await axios.post('http://localhost:4000/authentication/resetpassword',{newPassword:this.state.newPass},{headers:{
            'token':this.props.token
        }}).then(result=>{
            if(result.data==="password updated"){
                this.setState({
                    info:
                    <Card bg={'success'} style={{ width: '15rem',height:'10rem' }}>
                        <Card.Body>
                            <Card.Text style={{color: 'white'}}>
                                Password is Updated Successfully
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
                                An error has ocurred while updating password
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
                        <Form onSubmit={this.HandleNewPass}>
                            <Form.Group controlId="formGroupEmail">
                                <Form.Label style={{color:"white"}}>New Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your new password" onChange={e => this.setState({ newPass: e.target.value })}/>
                                <Form.Text className="text-muted">
                                    pleas make sure that your new password length is greater than 6 characters
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Reset Password
                            </Button>
                        </Form>
                        
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ResetPassword;
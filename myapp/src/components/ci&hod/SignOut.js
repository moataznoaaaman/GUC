import React from "react";
import axios from 'axios';
import { Card,Spinner} from 'react-bootstrap';

class SignOut extends React.Component{
    constructor(){
        super()
        this.state={
            info:null
        }

    }
    async componentDidMount(event){
        console.log("here")
        this.setState({
            info:<Spinner animation="border" variant="warning" />
        })
        this.documentData = JSON.parse(localStorage.getItem('document'));
        await axios.post('http://localhost:4000/authentication/signout',{id:this.documentData.userId},{headers:{
            'token':this.props.token
        }}).then(result=>{
            if(result.data ==="sign out recorded"){
                this.setState({
                    info:
                    <Card bg={'success'} style={{ width: '15rem',height:'10rem' }}>
                        <Card.Body>
                            <Card.Text style={{color: 'white'}}>
                                Signined Out Successfully
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
                                Error occurred while signing Out
                            </Card.Text>
                        </Card.Body>
                    </Card>
                })
            }
        })
    }
    render(){
        return(
            <div>{this.state.info}</div>
        )
    }
}
export default SignOut
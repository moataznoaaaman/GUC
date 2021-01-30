import React from "react";
import axios from 'axios';
import {Card,Spinner} from 'react-bootstrap';

class ViewHours extends React.Component{
    constructor(){
        super()
        this.state={
            info:null
        }

    }
    async componentDidMount(event){
        this.setState({
            info:<Spinner animation="border" variant="warning" />
        })
        this.documentData = JSON.parse(localStorage.getItem('document'));
        await axios.get('http://localhost:4000/authentication/viewHours',{headers:{
            'token':this.props.token
        }}).then(result=>{
            if (result.data === "error happened while getting missing hours"){
                this.setState({
                    info:
                    <Card bg={'warning'} style={{ width: '15rem',height:'10rem' }}>
                        <Card.Body>
                            <Card.Text style={{color: 'white'}}>
                                Error occurred while signing in
                            </Card.Text>
                        </Card.Body>
                    </Card>
                })
            }
            else{
                this.setState({
                    info:
                    <Card style={{ width: '15rem',height:'10rem' }}>
                        <Card.Body>
                            <Card.Text>
                            {result.data.split("\n").map((i,key) => {
                                return <div key={key}>{i}</div>;
                            })}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                })
            }
        })
    }
    render(){
        return(
            <div>
                {this.state.info}
            </div>
        )
    }
}

export default ViewHours
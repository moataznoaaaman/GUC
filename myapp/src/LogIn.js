import React from "react";
import { Form ,Button,Badge} from 'react-bootstrap';
import axios from 'axios';
//import LogIn from "./components/login";

class LogIn extends  React.Component
{
    constructor (){
        super()
        this.state = {
            info:"please enter your guc email and password",
            email: "",
            password:""
          };
          this.HandleSubmit = this.HandleSubmit.bind(this);
    }


   async HandleSubmit(event)
   {
    //console.log(this.state)
    event.preventDefault()
    await axios.post('http://localhost:4000/authentication/login', {
        
      email:this.state.email,
      password:this.state.password
    })
    .then(res => {
        const resbo = res.data;
        if (resbo==="This email doesnt exist") {
            this.setState(
                {
                    info:"please double check the data you enterd"
                }
            )
        } else if (resbo==="Wrong password please try again") {
            this.setState(
                {
                    info:"Wrong password"
                }
            )
        }
        else if (resbo==="An error has ocurred while logging in") {
            this.setState(
                {
                    info:"An error has ocurred while logging in try again"
                }
            )
        }
        else {
            //console.log(res.data.token)
            this.setState(
                {
                    info:"correct",
                    correct:true
                }
            )
            this.props.confirm(res.data.token)
        }   
    })
}
    render()
    {
        return(
        <div>
            <h1 style={{color:"white"}}>
                Welcome to the  <Badge variant="secondary">GUC</Badge>
            </h1>
            <Form onSubmit={this.HandleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label style={{color:"white"}}>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={e => this.setState({ email: e.target.value })}/>
                <Form.Text className="text-muted">
                {this.state.info}
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label style={{color:"white"}}>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value })} />
            </Form.Group>
           
            <Button variant="primary" type="submit">
                login
            </Button>
            </Form>
        </div>
            
        )
    }
}

export default LogIn;


// import React, { Component } from "react";
// import { Form, Button } from "react-bootstrap";

// export default class App2 extends Component {
//   state = {
//     val: ""
//   };

//   onSubmit = () => {
//     console.log(this.state.val);
//   };

//   render() {
//     return (
//       <Form.Group className="m-0">
//         <Form.Control
//           className="textFeedback"
//           as="textarea"
//           rows="3"
//           placeholder="feedback"
//           value={this.state.val}
//           onChange={e => this.setState({ val: e.target.value })}
//           type="text"
//         />
//         <Button
//           className="btnFormSend"
//           variant="outline-success"
//           onClick={this.onSubmit}
//         >
//           Send Feedback
//         </Button>
//       </Form.Group>
//     );
//   }
// }

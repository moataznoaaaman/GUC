import React from "react";
import axios from 'axios';
import Profile from './Profile'
import Schedule from './Schedule'
import VorCreq from './VorCreqs'
import ChangeDayOff from './ChangeDayOff'
import SendRepReq from './SendRepReq'
import Respond from './Respond'
import AnnualLeave from './AnnualLeave'
import MatLeave from './MatLeave'
import SickLeave from './SickLeave'
import AccLeave from './AccLeave'
import CompLeave from './CompLeave'
import SLLR from './SLLR'
import Notification from './Notification'
import {Navbar,Button,Nav,ButtonGroup,Dropdown,DropdownButton,Container,Row,Col} from 'react-bootstrap';
//import { event } from "jquery";

export default class AcademicMem extends React.Component
{
    constructor()
    {
        super();
        this.state=
        ({
            current:"main",
            navigation:"Main AM"
        })
        this.HandleHome = this.HandleHome.bind(this)
        this.HandleVORC = this.HandleVORC.bind(this)
        this.HandleCDO = this.HandleCDO.bind(this)
        this.HandleSRR = this.HandleSRR.bind(this)
        this.HandleRES = this.HandleRES.bind(this)
        this.HandleALR = this.HandleALR.bind(this)
        this.HandleMLR = this.HandleMLR.bind(this)
        this.HandleSLR = this.HandleSLR.bind(this)
        this.HandleAcLR = this.HandleAcLR.bind(this)
        this.HandleCLR = this.HandleCLR.bind(this)
        this.HandleSLLR = this.HandleSLLR.bind(this)
        this.HandleNOT = this.HandleNOT.bind(this)
    }

    store()
    {
        localStorage.setItem('am',JSON.stringify(this.state));
    }
    componentDidMount()
  {
    try {
        this.documentData = JSON.parse(localStorage.getItem('am'));
        //localStorage.clear()
        if (localStorage.getItem('document')) {
            this.setState({
              current: this.documentData.current,
              navigation: this.documentData.navigation,
              
        })
         }
         else {
          this.setState({
            current:"main",
            navigation:"Main AM"
          })
      }
      } catch (error) {
        this.setState({
            current:"main",
         navigation:"Main AM"
            
      })
      }
  }
  HandleHome(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"main",
                navigation:"Main AM"
            }
            ,()=>this.store() )
    }
    HandleNOT(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"NOT",
                navigation:"Main AM/notification"
            }
            ,()=>this.store() )
    }
    HandleVORC(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"VORC",
                navigation:"Main AM/View or Cancel Requests"
            }
            ,()=>this.store() )
    }

    HandleCDO(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"CDO",
                navigation:"Main AM/Change Day Off Request"
            }
            ,()=>this.store() )
    }
    HandleSRR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"SRR",
                navigation:"Main AM/Send Replacment Request"
            }
            ,()=>this.store() )
    }

    HandleRES(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"RES",
                navigation:"Main AM/respond to replacement request"
            }
            ,()=>this.store() )
    }

    HandleALR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"ALR",
                navigation:"Main AM/Annual Leave Request"
            }
            ,()=>this.store() )
    }

    HandleMLR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"MLR",
                navigation:"Main AM/Matrernity Leave Request"
            }
            ,()=>this.store() )
    }
    HandleSLR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"SLR",
                navigation:"Main AM/Sick Leave Request"
            }
            ,()=>this.store() )
    }

    HandleAcLR(event)
    {
        event.preventDefault()
        this.setState(
            {
                current:"AcLR",
                navigation:"Main AM/Acceidential Leave Request"
            }
            ,()=>this.store() )
    }
    HandleCLR(event)
    {
       // console.log("lol")
        event.preventDefault()
        this.setState(
            {
                current:"CLR",
                navigation:"Main AM/compensation Leave Request"
            }
            ,()=>this.store() )
    }

    HandleSLLR(event)
    {
       // console.log("lol")
        event.preventDefault()
        this.setState(
            {
                current:"SLLR",
                navigation:"Main AM/slot linking request Request"
            }
            ,()=>this.store() )
    }
    HandleLogOut(token){
                   
        axios.post('http://localhost:4000/authentication/logout',{headers:{
            'token':token
        }})

        .then(res=>
            {
                
                
                localStorage.clear();
                window.location.reload();
               // this.HandleLogOut()
            })
            .catch(err=>
                {
                    console.log(err)
                })
    }
    render()
    {
        let x,y;
        switch (this,this.state.current) {
            case "main":{x=(<Schedule token={this.props.token} userid={this.props.userId}/>);y=(<Profile token={this.props.token} userid={this.props.userId}/>);break;}
            
            case "VORC":{x=(<VorCreq token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
            
            case "CDO":{x=(<ChangeDayOff token={this.props.token} userid={this.props.userId}/>);y=(null);break;}

            case "SRR":{
               x=(<SendRepReq token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
            
            case "RES":{
                    x=(<Respond token={this.props.token} userid={this.props.userId}/>);y=(null);break;}
                
            case "ALR":{
                    x=(<AnnualLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;}   
            case "MLR":{
                     x=(<MatLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;}   
            case "SLR":{
                     x=(<SickLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;} 
            case "AcLR":{
                     x=(<AccLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;}   
            case "CLR":{
                     x=(<CompLeave token={this.props.token} userid={this.props.userId}/>);y=(null);break;} 
            case "SLLR":{
                     x=(<SLLR token={this.props.token} userid={this.props.userId}/>);y=(null);break;}   
            case "NOT":{
                     x=(<Notification token={this.props.token} userid={this.props.userId}/>);y=(null);break;}                      
            default:
                break;
        }
        return(
            <div >
        
        
        <div >
                <Navbar bg="dark" variant="dark" >
                    <Navbar.Brand >{this.state.navigation}</Navbar.Brand>
                    <Nav className="mr-auto">
                    <Nav.Link href="#features" onClick={this.HandleNOT}>Notifications</Nav.Link>
                    </Nav>
                    <Button variant="outline-info" onClick={()=>{console.log()
                    this.HandleLogOut(this.props.token)
         }}>Log Out</Button>
                    <Button variant="outline-info" onClick={this.HandleHome}>home</Button>
                </Navbar>
        </div>
        <Container>
                    <Row>
                        <Col>                       
                        <ButtonGroup vertical>
                        <Button onClick={()=>{this.props.back()}} style={{background:"gold",color:"grey"}} >Back</Button>
                        <Button onClick={this.HandleVORC} >View or cancel sent requests</Button>
                        <Button onClick={this.HandleSLLR}>send slot linking request</Button>
                        <Button onClick={this.HandleCDO}>change dayoff request</Button>



                        <DropdownButton as={ButtonGroup} title="Replacment requests" id="bg-vertical-dropdown-1">
                            <Dropdown.Item eventKey="1" onClick={this.HandleSRR} >send</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={this.HandleRES} >responde</Dropdown.Item>
                            
                        </DropdownButton>

                        <DropdownButton as={ButtonGroup} title="Leave requests" id="bg-vertical-dropdown-1">       
                            <Dropdown.Item eventKey = "1" onClick={this.HandleAcLR}>AccidentalLeaveRequest</Dropdown.Item>
                            <Dropdown.Item eventKey = "2" onClick={this.HandleCLR}>CompensationLeaveRequest</Dropdown.Item>
                            <Dropdown.Item eventKey = "3" onClick={this.HandleSLR}>SickLeavesRequest</Dropdown.Item>
                            <Dropdown.Item eventKey = "4" onClick={this.HandleMLR}>MaternityLeaveRequest</Dropdown.Item>
                            <Dropdown.Item eventKey = "5" onClick={this.HandleALR}>annualleaverequest</Dropdown.Item>
                        </DropdownButton>
                       
                        </ButtonGroup>        </Col>
                        <Col>
                        {x}
                         </Col>
                    </Row>
                    <Row>
                            <Col>
                                
                            </Col>
                        <Col>
                        {/* <Profile token={this.props.token} userid={this.props.userId}/> */}
                         
                        {y}
                        </Col>
                        
                        
                    </Row>
        </Container>
    </div>
        )
    }
}
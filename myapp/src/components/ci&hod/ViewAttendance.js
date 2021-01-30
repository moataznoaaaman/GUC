import React from "react";
import axios from 'axios';
import { Form ,Button,Card,Container,Row,Col,Spinner, ListGroup} from 'react-bootstrap';

class ViewAttendance extends React.Component{
    constructor(){
        super()
        this.state={
            info:null,
            month:0
        }
        this.HandleViewAttendance=this.HandleViewAttendance.bind(this)
        this.ChangeMonth=this.ChangeMonth.bind(this)
    }

    ChangeMonth=(event)=>{
        
        switch(event.target.value){
            case "All":
                this.setState({month:0})
                return;
            case "January":
                this.setState({month:1})
                return;
            case "February":
                this.setState({month:2})
                return;
            case "March":
                this.setState({month:3})
                return;
            case "April":
                this.setState({month:4})
                return;
            case "May":
                this.setState({month:5})
                return;
            case "June":
                this.setState({month:6})
                return;
            case "July":
                this.setState({month:7})
                return;
            case "August":
                this.setState({month:8})
                return;
            case "September":
                this.setState({month:9})
                return;
            case "October":
                this.setState({month:10})
                return;
            case "November":
                this.setState({month:11})
                return;
            case "December":
                this.setState({month:12})
                return;
            default:
        }
    }

    async HandleViewAttendance(event){
        event.preventDefault()
        this.setState({
            info:<Spinner animation="border" variant="warning" />
        })
        this.documentData = JSON.parse(localStorage.getItem('document'));
        if(this.state.month===0){
            await axios.post('http://localhost:4000/authentication/viewAllAttendance',{id:this.documentData.userId},{headers:{
                'token':this.props.token
            }}).then(result=>{
                let Attend=[]
                let Record=[]
                for(let i=0;i<result.data.length;i++){
                    for(let j=0;j<result.data[i].signs.length;j++){
                        if(result.data[i].signs[j].signin !=null)
                            Record.push(result.data[i].signs[j])
                        if(result.data[i].signs[j].signout !=null)
                            Record.push(result.data[i].signs[j])
                    }
                    Record.push(result.data[i].date)
                    Record.push(result.data[i].dayname)
                    Attend.push(Record)
                    Record=[]
                }
                console.log(result.data[0])
                this.setState({
                    info:
                        Attend.map(key=>{
                            return <ListGroup.Item>{key.map(d=>{
                                if(d.signin != null){
                                    return <ListGroup.Item>{"SignIn: "+d.signin}</ListGroup.Item>
                                }
                                else {
                                    if(d.signout != null){
                                        return <ListGroup.Item>{"SignOut: "+d.signout}</ListGroup.Item>
                                    }
                                    else{
                                        if(!isNaN(d.charAt(0))){
                                            return <ListGroup.Item>{"Date: "+d}</ListGroup.Item>
                                        }
                                        else{
                                            return <ListGroup.Item>{"Day: "+d}</ListGroup.Item>
                                        }
                                    }
                                }
                            })
                            }</ListGroup.Item>
                        })
                })
            })
        }
        else{
            await axios.post('http://localhost:4000/authentication/viewMonthAttendance',{month:this.state.month},{headers:{
                'token':this.props.token
            }}).then(result=>{
                console.log(result.data)
                if(result.date !=="error ocurred while retrieving attendance" && result.data.length !== 0 ){
                    let Attend=[]
                    let Record=[]
                    for(let i=0;i<result.data.length;i++){
                        for(let j=0;j<result.data[i].signs.length;j++){
                            if(result.data[i].signs[j].signin !=null)
                                Record.push(result.data[i].signs[j])
                            if(result.data[i].signs[j].signout !=null)
                                Record.push(result.data[i].signs[j])
                        }
                        Record.push(result.data[i].date)
                        Record.push(result.data[i].dayname)
                        Attend.push(Record)
                        Record=[]
                    }
                    this.setState({
                        info:
                            Attend.map(key=>{
                                return <ListGroup.Item>{key.map(d=>{
                                    if(d.signin != null){
                                        return <ListGroup.Item>{"SignIn: "+d.signin}</ListGroup.Item>
                                    }
                                    else {
                                        if(d.signout != null){
                                            return <ListGroup.Item>{"SignOut: "+d.signout}</ListGroup.Item>
                                        }
                                        else{
                                            if(!isNaN(d.charAt(0))){
                                                return <ListGroup.Item>{"Date: "+d}</ListGroup.Item>
                                            }
                                            else{
                                                return <ListGroup.Item>{"Day: "+d}</ListGroup.Item>
                                            }
                                        }
                                    }
                                })
                                }</ListGroup.Item>
                            })
                    })
                }
                else{
                    if(result.date != null){
                        this.setState({
                            info:
                            <Card bg={'warning'} style={{ width: '15rem',height:'10rem' }}>
                                <Card.Body>
                                    <Card.Text style={{color: 'white'}}>
                                        error ocurred while retrieving attendance
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        })
                    }
                    else{
                        this.setState({
                            info:
                            <Card bg={'success'} style={{ width: '15rem',height:'10rem' }}>
                                <Card.Body>
                                    <Card.Text style={{color: 'white'}}>
                                        There is no attendance for this month
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        })
                    }
                }
            })
        }
    }

    render(){
        return(
            <Container>
            <Row>
                    <Col>
                        {this.state.info}
                    </Col>
                    <Col>
                        <Form onSubmit={this.HandleViewAttendance}>
                            <Form.Group controlId="formGroupEmail">
                                <Form.Label style={{color:"white"}}>Month</Form.Label>
                                <Form.Control onChange={this.ChangeMonth} as="select" custom>
                                    <option>All</option>
                                    <option>January</option>
                                    <option>February</option>
                                    <option>March</option>
                                    <option>April</option>
                                    <option>May</option>
                                    <option>June</option>
                                    <option>July</option>
                                    <option>August</option>
                                    <option>September</option>
                                    <option>October</option>
                                    <option>November</option>
                                    <option>December</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Show Attendance
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default ViewAttendance;
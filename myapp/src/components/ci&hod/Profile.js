import React from "react";
import axios from 'axios';
import {Card,Spinner} from 'react-bootstrap';
class Profile extends React.Component
{  
    constructor()
    {
        super()

        this.state=
        {
           info:"loading....."
        }
    }

    async componentDidMount() 
    {
        this.setState(
            {
                info:<Spinner animation="border" variant="warning" />
            }
        )
                await axios.post('http://localhost:4000/authentication/profile',{ id:this.props.userid }, {
        headers: {
            'token': this.props.token
        }
        })

        .then(res=>
             {  // let reso=res.data
                 
                this.setState(//{ dayoff: 'monday', hourspermonth: 164.8, annualleavebalance: -6, gender: 'male', notifications: [ 'request :rfrf is accepted ' ], missingdays: 0, missinghours: 0, extrahours: 0, workedhours: 0, name: 'ci1', id: 'am-1', salary: 60, office: 'req.body.office', userType: 'ci', department: 'cs', __v: 0 }
                    {
                        info:<Card style={{ width: '30rem',height:'30rem' }}>
                        <Card.Body>
                        <Card.Title>Profile</Card.Title>
                        <Card.Text>
                         {"id:"+res.data.id+"  ||name:"+res.data.name+"  ||dayoff:"+res.data.dayoff+"  ||annual leave balance:"+res.data.annualleavebalance+"  ||hours per month:"+res.data.hourspermonth+"  ||missing days:"+res.data.missingdays+"  ||missing hours:"+res.data.missinghours+"  ||extrahours:"+res.data.extrahours+"  ||worked hours:"+res.data.workedhours+"  ||salary:"+res.data.salary+"  ||office:"+res.data.office+"  ||email:"+res.data.email} 
                        </Card.Text>
                        </Card.Body>
                     </Card>
                    }
                )
                
            })


            .catch(err=>
                {
                    console.log(err)
                })
    }
    render()
    {
        return (this.state.info)
    }
}

export default Profile
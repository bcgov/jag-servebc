import React, {useEffect} from 'react'
import UserService from '../services/UserService'
import NavBar from "../containers/NavBar";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

const publicFormURL = `/public/form/servelegaldocuments`; // based on the form name: Serve Legal Documents
const HomePage =({store})=>{

    useEffect(()=>{
        UserService.authenticateAnonymousUser(store)
    },[store])
    return (
          <div className="container">
                <NavBar/>
                <section className="mx-auto">
                    <div className="home mx-auto" style={{ width: '90vw', paddingTop: '3rem' }}>
                        <h3>Serve Legal Documents</h3> 
                        This optional service is offered to facilitate serving Notices of Constitutional Question and supporting documents on 
                        the Attorney General of British Columbia. Other options to serve the Attorney General of British Columbia and 
                        His Majesty the King in right of the Province of British Columbia are listed 
                        at <a href="https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/justice-attorney-general/ministry-contacts/serving-legal-documents">
                             Serving Legal Documents on the Attorney General of British Columbia
                        </a>.
                        <br/><br/>
                        <Card style={{ width: '90vw', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }}>
                            <Card.Header className="bg-default">Information Collection Notice</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                Personal information contained on this form is collected under the <i>Freedom of Information and 
                                Protection of Privacy Act</i> and will be used only for the purpose of confirming service of your 
                                document(s) and serving documents on you. If you have any questions about the collection, use 
                                or disclosure of this information, please call Information Access Operations at 250-387-1321.
                                    <br /><br /><br />
                                    <div className="w-100 text-center">
                                        <Link to={publicFormURL} className="btn btn-primary">Continue</Link>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        
                    </div>
                </section>
          </div>
       )
}

export default HomePage;

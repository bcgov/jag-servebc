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
                        <p>This optional service is offered to facilitate service of certain specified filed court documents on the Attorney General of British Columbia.</p>
                        <p>The currently accepted forms are:</p>
                      <ul>
                        <li><b>Notice of Constitutional Question</b></li>
                        <li><b>Notice of Civil Claim</b></li>
                        <li><b>Notice of Appeal</b></li>
                        <li><b>Notice of Claim (Small Claims)</b></li>
                        <li><b>Notice of Application</b></li>
                        <li><b>Petition</b></li>
                      </ul>
                      <p>
                        Other options to serve the Attorney General of British Columbia and His Majesty the King in right of the Province of British Columbia are listed at 
                        <a href="https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/attorney-general/ministry-contacts/serving-legal-documents" target="_blank" rel="noopener noreferrer">
                          Serving Legal Documents on the Attorney General of British Columbia
                        </a>.
                      </p>
                        <Card style={{ width: '90vw', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }}>
                            <Card.Header className="bg-default">Information Collection Notice</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                Personal information contained on this form is collected under the <i>Freedom of Information and 
                                Protection of Privacy Act</i> and will be used only for the purpose of confirming service of your 
                                document(s) and serving documents on you. If you have any questions about the collection, use 
                                or disclosure of this information, please call Information Access Operations at 250-387-1321.
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

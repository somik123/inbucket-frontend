import React, {Component} from "react";
//import {Redirect, Route} from "react-router-dom";
import EmailService from "../Services/EmailDataService";

export default class MainPage extends Component{
    constructor(props){
        super(props);

        // Declare all methods
        this.loadNameList = this.loadNameList.bind(this);
        this.retrieveEmailList = this.retrieveEmailList.bind(this);
        this.onClickGenerateRandomMailbox = this.onClickGenerateRandomMailbox.bind(this);
        this.onClickGenerateReadableMailbox = this.onClickGenerateReadableMailbox.bind(this);
        this.onChangeEmailUser = this.onChangeEmailUser.bind(this);
        this.onChangeDomain = this.onChangeDomain.bind(this);
        this.onClickOpenEmail = this.onClickOpenEmail.bind(this);
        this.onClickDeleteEmail = this.onClickDeleteEmail.bind(this);
        this.onClickLoadHtml = this.onClickLoadHtml.bind(this);
        this.onClickLoadSource = this.onClickLoadSource.bind(this);
        this.copyEmailAddress = this.copyEmailAddress.bind(this);
        this.onClickOpenMailbox = this.onClickOpenMailbox.bind(this);
        

        // State variables
        this.state = {
            domainList: ["kfels.com","somx.us","team1ad.site","hooks.cc","thinpcb.com","ziox.win"],
            emailList: [],
            emailUser: "",
            emailDomain: "kfels.com",
            emailBody: [],
            emailSource: "",
            emailLoaded: false,
            mailboxSet: false,
            loadHtml: false,
            interval: null
        }
        
    }

    // Load initial name list and retrieve emails every X seconds
    componentDidMount(){
        this.loadNameList();
        var tempInterval = setInterval(() => {
            var emailAcc = this.state.emailUser + "@" + this.state.emailDomain;
            this.retrieveEmailList(emailAcc);
          }, 8000);
        this.setState({interval: tempInterval});
    }


    // Load name list and create a random account for user
    loadNameList(){
        // Load from cookie if exists
        var user = this.getCookie("user");
        var domain = this.getCookie("domain");
        var emailAcc = user + "@" + domain;
        
        if(user !== "" && domain !== ""){
            this.setState({emailUser: user});
            this.setState({emailDomain: domain});

            // Load emails
            this.retrieveEmailList(emailAcc);
        }
        else{
            // Call API through EmailService
            EmailService.getNameList()
            .then(response =>{
                var nameArray = response.data.split("\n");
                var rand = Math.floor(Math.random() * nameArray.length);
                var randNum = Math.floor(Math.random() * 99);

                user = nameArray[rand].toLowerCase() + randNum;
                this.setState({emailUser: user});
                console.log(user);

                domain = this.loadRandomDomain();

                // Save to cookie
                this.setCookie("user", user, 30);
                this.setCookie("domain", domain, 30);

                // Load emails with new details
                emailAcc = user + "@" + domain;
                this.retrieveEmailList(emailAcc);
            })
            .catch(e => {console.log(e)});
        }
    }


    // User clicked button manually
    onClickOpenMailbox(){
        if(this.state.emailUser !== "" && this.state.emailDomain !== ""){
            var emailAcc = this.state.emailUser + "@" + this.state.emailDomain;
            // Save to cookie
            this.setCookie("user", this.state.emailUser, 30);
            this.setCookie("domain", this.state.emailDomain, 30);

            this.retrieveEmailList(emailAcc);
        }

    }


    // Get list of emails in account
    retrieveEmailList(emailAcc){
        // Call API through EmailService
        EmailService.getEmailList(emailAcc)
            .then(response =>{
                if(response.data.length > 0){
                    this.setState({emailList: response.data.reverse()});
                    console.log(response.data);
                }
                else{
                    this.setState({emailList: []});
                }
            })
            .catch(e => {console.log(e)});
    }


    // Open email clicked by user
    onClickOpenEmail(id){
        if(this.state.emailUser !== "" && this.state.emailDomain !== ""){
            var emailAcc = this.state.emailUser + "@" + this.state.emailDomain;
            // Call API through EmailService
            EmailService.getEmailById(emailAcc, id)
                .then(response =>{
                    this.setState({
                        emailBody: response.data, 
                        emailLoaded: true,
                        loadHtml: false,
                        emailSource: null
                    });
                    console.log(response.data);

                    var data = { seen: true };

                    // Mark enail as read
                    EmailService.markEmailAsRead(emailAcc,id,data)
                        .then(response =>{
                            this.retrieveEmailList(emailAcc);
                            console.log(response.data);
                        });
                })
                .catch(e => {console.log(e)});
        }
    }


    // Delete email clicked by user
    onClickDeleteEmail(id){
        if(this.state.emailUser !== "" && this.state.emailDomain !== ""){
            var emailAcc = this.state.emailUser + "@" + this.state.emailDomain;

            EmailService.deleteEmailById(emailAcc, id)
                .then(response =>{
                    this.setState({
                        emailSource: null,
                        loadHtml: false,
                        emailLoaded: false,
                        emailBody: []
                    });
                    this.retrieveEmailList(emailAcc);
                    console.log(response.data);
                })
                .catch(e => {console.log(e)}); 
        }
    }


    // Change email body view to HTML
    onClickLoadHtml(){
        this.setState({
            loadHtml: !this.state.loadHtml, 
            emailSource: null
        });
    }


    // Change email body view to source
    onClickLoadSource(id){
        if(this.state.emailUser !== "" && this.state.emailDomain !== ""){
            var emailAcc = this.state.emailUser + "@" + this.state.emailDomain;
            EmailService.getEmailSourceById(emailAcc, id)
                .then(response =>{
                    this.setState({
                        emailSource: response.data,
                        loadHtml: true
                    });
                    console.log(response.data);
                })
                .catch(e => {console.log(e)});
        }
    }


    // Create a readable email account
    onClickGenerateReadableMailbox(){
        // Clear cookie
        this.setCookie("user", "", -30);
        this.setCookie("domain", "", -30);
        this.loadNameList();

    }

    // User typed in manually
    onChangeEmailUser(e){
        this.setState({emailUser: e.target.value});
        console.log(e.target.value);
    }

    // User changed domain manually
    onChangeDomain(e){
        this.setState({emailDomain: e.target.value});
        console.log(e.target.value);
    }

    // Generate a random email account. Not readable
    onClickGenerateRandomMailbox(){
        var len = 12;
        var a2z_upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        var a2z_lower = "abcdefghijkmnpqstuvwxyz";
        var numeric = "23456789";
        
        var user = "";

        var patt2 = new RegExp(/[A-Z]/gm);
        var patt3 = new RegExp(/[a-z]/gm);
        var patt4 = new RegExp(/[0-9]/gm);
        
        var keyspace = a2z_upper + a2z_lower + numeric;
        var keyspace_len = keyspace.length;
        
        // Nothing selected
        if(keyspace_len < 8){
            return null;
        }
        
        // Always output password with 1 upper, 1 lower, 1 special and 1 number
        for(var j=0; j<=200; j++){
            
            user = "";
            for (var i = 0;  i<len; ++i) {
                user += keyspace.charAt(Math.floor(Math.random() * keyspace_len));
            }
            if( patt2.test(user) && patt3.test(user) && patt4.test(user) ) break;
            if(j===200) alert("Maxed...");
        }

        this.setState({emailUser: user});
        console.log(user);

        var domain = this.loadRandomDomain();

        // Save to cookie
        this.setCookie("user", user, 30);
        this.setCookie("domain", domain, 30);
    }


    // Load a random domain from list
    loadRandomDomain(){
        var rand2 = Math.floor(Math.random() * this.state.domainList.length);
        var domain = this.state.domainList[rand2].toLowerCase();
        this.setState({emailDomain: domain});
        return domain;
    }


    // Copy email address to clipboard
    copyEmailAddress(){
        if(this.state.emailUser !== "" && this.state.emailDomain !== ""){
            var emailAcc = this.state.emailUser + "@" + this.state.emailDomain;
            navigator.clipboard.writeText(emailAcc);
        }
    }


    // Save to cookie
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }


    // Read from cookie
    getCookie(cname){
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }



    render(){
        
        const {emailList, emailUser, emailDomain, emailBody, emailLoaded, loadHtml, emailSource, domainList } = this.state;

        return(
<div className="container-fluid">
    <div className="row mb-3 mt-5 form-box">
        <div className="col-md-3 pl-1 pr-1 mb-2">
            <input className="form-control" type="text" id="user" onChange={this.onChangeEmailUser} value={emailUser} />
        </div>
        <div className="col-md-3 pl-1 pr-1 mb-2">
            <select className="form-control" id="domain" onChange={this.onChangeDomain} value={emailDomain}>
                { domainList && domainList.map( (domain,index) =>(
                    <option key={index}>{domain}</option>
                ))
                }
                
            </select>
        </div>
        <div className="col-md-3 pl-1 pr-1 mb-2">
            <button className="form-control btn btn-outline-primary" onClick={this.onClickOpenMailbox}>Open Mailbox</button>
        </div>
        <div className="col-md-3 pl-1 pr-1 mb-2">
            <button className="form-control btn btn-outline-info" onClick={this.copyEmailAddress}>Copy Address</button>
        </div>
    </div>
    <div className="row mb-3 mt-1 form-box">
        <div className="col-md-2 pl-1 pr-1 mb-2"></div>
        <div className="col-md-4 pl-1 pr-1 mb-2">
            <button className="form-control btn btn-sm btn-outline-secondary" onClick={this.onClickGenerateReadableMailbox}>Generate Readable Mailbox</button>
        </div>
        <div className="col-md-4 pl-1 pr-1 mb-2">
            <button className="form-control btn btn-sm btn-outline-secondary" onClick={this.onClickGenerateRandomMailbox}>Generate Random Mailbox</button>
        </div>
        <div className="col-md-2 pl-1 pr-1 mb-2"></div>
    </div>
    <hr />
    <div className="row">
        <div className="col-md-4">
            <div className="list-group">
                <div className="list-group-item list-header pr-2 pl-2">
                    <strong>Mailbox: </strong>
                    <span>{emailUser + "@" + emailDomain}</span>
                </div>
                {
                    emailList && emailList.map( (emailItem, index) => (
                        <div className="list-group-item p-2 mouse-pointer" key={index} onClick={ () => this.onClickOpenEmail(emailItem.id)}>
                            { 
                                !emailItem.seen ? (
                                    <span className="new-mail">New</span>
                                ) : ""
                            }
                            <h6 className="list-group-item-heading" id="emailSubject">
                                {emailItem.subject}
                            </h6>
                            <div className="list-group-item-text small-text">
                                <span className="font-weight-bold">From: </span>
                                <span id="emailSender">{emailItem.from}</span><br />

                                <span className="font-weight-bold">To: </span>
                                <span id="emailSender">{emailItem.to.join(", ")}</span><br />
                                
                                <span className="font-weight-bold">Sent: </span>
                                <span id="emailTime">{emailItem.date.replace("T"," ").substring(0, emailItem.date.indexOf('.'))}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        <div className="col-md-8">
            {
                emailLoaded ? (
                    <div className="card">
                        <div className="card-header">
                            <h5>{emailBody.subject}</h5>
                            <span className="font-weight-bold">From: </span>
                                <span id="emailSender">{emailBody.from}</span><br />

                                <span className="font-weight-bold">To: </span>
                                <span id="emailSender">{emailBody.to.join(", ")}</span><br />
                                
                                <span className="font-weight-bold">Sent: </span>
                                <span id="emailTime">{emailBody.date.replace("T"," ").substring(0, emailBody.date.indexOf('.'))}</span>

                                <div className="button-box mt-2">
                                    { emailBody.body.html.length > 0 ? (
                                        <button className="btn btn-sm btn-outline-secondary mr-2" onClick={this.onClickLoadHtml}>
                                            { loadHtml ? "Load Text" : "Load HTML" }
                                        </button>
                                    ) : "" }
                                    <button className="btn btn-sm btn-outline-info mr-2" onClick={ () => this.onClickLoadSource(emailBody.id)}>Load Source</button>
                                    <button className="btn btn-sm btn-outline-danger mr-2" onClick={ () => this.onClickDeleteEmail(emailBody.id)}>Delete</button>
                                </div>
                        </div>
                        <div className="card-body">
                            <div className="card-text">
                                { 
                                emailSource ? (
                                    <div>
                                        {emailSource.split('\n').map(function(item, idx) {
                                            return (
                                                <span key={idx}>
                                                    {item}
                                                    <br/>
                                                </span>
                                            )
                                        })}
                                    </div>
                                ) : ( 
                                    loadHtml ? (
                                        <div dangerouslySetInnerHTML={{__html: emailBody.body.html}}></div>
                                    ) : (
                                        <div>
                                            {emailBody.body.text.split('\n').map(function(item, idx) {
                                                return (
                                                    <span key={idx}>
                                                        {item}
                                                        <br/>
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    ) )
                                }
                            </div>
                        </div>
                        <div className="card-footer">
                            { emailBody.body.html.length > 0 ? (
                                <button className="btn btn-sm btn-outline-secondary mr-2" onClick={this.onClickLoadHtml}>
                                    { loadHtml ? "Load Text" : "Load HTML" }
                                </button>
                            ) : "" }
                            <button className="btn btn-sm btn-outline-info mr-2" onClick={ () => this.onClickLoadSource(emailBody.id)}>Load Source</button>
                            <button className="btn btn-sm btn-outline-danger mr-2" onClick={ () => this.onClickDeleteEmail(emailBody.id)}>Delete</button>
                        </div>
                    </div>
                ) : ""
            }
        </div>
    </div>
</div>
        ) 
    }
}

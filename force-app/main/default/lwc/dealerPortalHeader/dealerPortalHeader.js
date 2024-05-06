import { LightningElement, track } from 'lwc';
import doLogin from '@salesforce/apex/DealerPortalController.doLogin';
//import logInStatus from '@salesforce/apex/DealerPortalController.logInStatus';
import checkLoginStatus from '@salesforce/apex/DealerPortalController.checkLoginStatus';
import updateDealerSession from '@salesforce/apex/DealerPortalController.updateDealerSession';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import RGS_logo from '@salesforce/resourceUrl/RGS_logo';

export default class DealerPortalHeader extends LightningElement {
    @track showViewAccountContact = false;
    @track showCaseCardContainer = false;
    isLoggedIn = false;
    isAfterLoggedIn = false;
    cust_username = '';
    cust_password = '';
    contact;
    errorMessage = '';
    logoUrl = RGS_logo;
    userAgent ;
    connectedCallback(){
        this.handleCheckLoginStatus();
    }

    handleSearchOption() {
        this.showViewAccountContact = true;
        this.showCaseCardContainer = false;
    }

    handleViewCasesOption() {
        this.showViewAccountContact = false;
        this.showCaseCardContainer = true;
    }
    
   

    handleInputChange(event) {
       const { name, value } = event.target;
       this[name] = value;
    }

    handleLogin() {
        doLogin({
            userName: this.cust_username,
            password: this.cust_password
        })
        .then(result => {
            this.contact = result;
            console.log('this.contact record '  + JSON.stringify(this.contact));
            // Call the separate logInStatus method
            if (this.contact != null) {                
               // this.isLoggedIn = true;
               // this.showCaseCardContainer = true;
               //this.isAfterLoggedIn = true;
               this.handleCheckLoginStatus();
            } else {
                // this.displayError("Invalid username or password!");
                this.isLoggedIn = true;
                this.errorMessage = 'Invalid username or password!';
            }
        })
        .catch(error => {
            console.log('error ' + JSON.stringify(error));
        });
    }
    
    // checkLoginStatus() {
    //     logInStatus({
    //         userName: this.cust_username,
    //         password: this.cust_password   
    //     })
    //     .then(res => {
    //         console.log("Login status info", res);
    //     });
    // }
    

    displaySuccessMsg(successMessage) {
        const msgEvent = new ShowToastEvent({
            title: "Success",
            message: successMessage,
            variant: "success",
            mode: "dismissable",
        });
        this.dispatchEvent(msgEvent);
    }

    displayError(errorMessage) {
        const msgEvent = new ShowToastEvent({
            title: "Error",
            message: errorMessage,
            variant: "error",
            mode: "dismissable",
        });
        this.dispatchEvent(msgEvent);
    }

    handleCheckLoginStatus() {
        checkLoginStatus()
            .then(result => {
                if (result !== null && result !== '') { 
                    this.contact = result;
                    this.isLoggedIn = false; 
                    this.isAfterLoggedIn = true;
                    this.showCaseCardContainer = true;
                } else {
                    this.isLoggedIn = true; 
                    this.isAfterLoggedIn = false;
                    this.showCaseCardContainer = false;
                }
                console.log('Result 92:', result);
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    }
    

    handleLogOut(){
        updateDealerSession().then(result=>{
            if(result == false){
                this.isLoggedIn = true;
                this.isAfterLoggedIn = false;
                this.showCaseCardContainer = false;
                this.showViewAccountContact = false;
                this.contact = null;
                this.cust_username = '';
                this.cust_password = '';
                this.errorMessage = '';
            }
        })
    }
}
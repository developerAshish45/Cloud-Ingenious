import { LightningElement, track,api,wire } from 'lwc';
import RGS_logo from "@salesforce/resourceUrl/RGS_logo";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendOTP from '@salesforce/apex/ApprovalLogInPageController.sendOTP';
import validateOTP from '@salesforce/apex/ApprovalLogInPageController.validateOTP';
import updateCreditApprovalEmailForApprover from '@salesforce/apex/CreditFormController.updateCreditApprovalEmailForApprover'; 
import getCreditRecords from '@salesforce/apex/CreditFormController.getCreditRecords';
import getCreditStatus from '@salesforce/apex/CreditFormController.getCreditStatus';
import changeCreditStatus from '@salesforce/apex/CreditFormController.changeCreditStatus';
import ThreeLinerMenu from '@salesforce/resourceUrl/ThreeLinerMenu';
import RSG_Logo_Page from '@salesforce/resourceUrl/RSG_Logo_Page'; 
import Norlake_Logo from '@salesforce/resourceUrl/Norlake_Logo'; 
import Master_Built_Logo from '@salesforce/resourceUrl/Master_Built_Logo'; 
import createCreditRecord from '@salesforce/apex/CreditFormController.createCreditRecord';
import getCreditInfo from '@salesforce/apex/CreditFormController.getCreditInfo';
import Terms_And_Condition_Part_2 from '@salesforce/label/c.Terms_And_Condition_Part_2';
import Terms_And_Condition_Part_1 from '@salesforce/label/c.Terms_And_Condition_Part_1';
import Valid_Approver from '@salesforce/label/c.Valid_Approver';
import NorlakeScientificLogo from '@salesforce/resourceUrl/NorlakeScientificLogo'; 

export default class CreditForm extends LightningElement {
    norlakeScientficLogo = NorlakeScientificLogo;
    @track showSpinner = false;
    @track fetchCredidtRecordFromId = "";
    @track newCreditId;
    @api successMessage;
    @api contactLogInEmail;
    ThreeLinerMenu = ThreeLinerMenu;
    rsgLogoPage = RSG_Logo_Page;
    rsgLogo = RSG_Logo_Page;
    norlakeLogo = Norlake_Logo;
    masterBuiltLogo = Master_Built_Logo;
    @track showLoginPage = true;
    @track companyInformation = false;
    @track showCreditDetails = false;
    @track checkStatus = false;
    @track contactEmail;
    @track otp;
    @track creditSelectedRowId;
    @track approverEmail;
    @track loginEmail;

    handleEmailChange(event) {
        this.loginEmail = event.target.value;
        this.contactEmail = this.loginEmail;
    }

    handleOTPChange(event) {
        this.otp = event.target.value;
    }

    systemOtp;
    handleSendOTP() {
        if (!this.isValidEmail(this.loginEmail)) {
            this.showToast('Error', 'Please provide a valid email address', 'error');
            return;
        }
        //console.log('logInEmail',this.loginEmail)
        this.showSpinner = true;
        sendOTP({ email: this.loginEmail })
            .then(result => {
                //console.log('result', result)
                if (result === null) {
                    this.showToast('Error', Valid_Approver, 'error');
                    this.showSpinner = false;
                }
                else{
                this.systemOtp = result;
                this.showSpinner = false;
                this.showToast('Success', 'Verification code sent successfully', 'success');
                }
            })
            .catch(error => {
                // Handle error
                this.showToast('Error', 'Failed to send verification code: ' + error.body.message, 'error');
                this.showSpinner = false;
            });
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleLogin() {
        //console.log('logInEmail',this.loginEmail)
        //console.log('contactEmail From Login page',this.contactEmail)
        //console.log('otp',this.otp)
        this.showSpinner = true;
        if (!this.loginEmail || !this.otp) {
            this.showToast('Error', 'Please enter username and OTP', 'error');
            this.showSpinner = false;
            return;
        }
        if(this.systemOtp == this.otp){
            this.showLoginPage = false;
            this.checkStatus = true;
            validateOTP({ email: this.loginEmail })
            .then(result => {
                // Handle success
                if (result) {
                    this.showSpinner = false;
                    this.companyInformation = true;
                    updateCreditApprovalEmailForApprover({
                        creditId: this.creditSelectedRowId,
                        email:this.loginEmail
                    })
                    .then(result => {
                        //console.log('Updated Credit Result:', result);
                        this.showSpinner = false;
                    })
                    .catch(error => {
                        console.error('Error updating credit record:', error);
                        this.showSpinner = false;
                    });
                   
                } else {
                    this.showToast('Error', 'Please enter a valid OTP', 'error');
                    this.showSpinner = false;
                }
            })
            .catch(error => {
                // Handle error
                this.showSpinner = false;
               
            });
        }
        else{
            this.showToast('Error', 'Login failed: ' + error.body.message, 'error');
            this.showSpinner = false;
        }
        
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
    connectedCallback() {
        //console.log('loginEmail in cb',this.loginEmail)
        //console.log('approverEmail in cb',this.approverEmail)
        let currentUrl = window.location.href;
        //console.log('Current URL:', currentUrl);
        if (currentUrl.includes('Id=')) {
            let id = currentUrl.split('=')[1];
            //console.log('ID:', id);
            this.creditSelectedRowId = id;
            //console.log('creditSelectedRowId:', this.creditSelectedRowId);
        }
    }

}
import { LightningElement, track} from 'lwc';
import createInstallationRecord from '@salesforce/apex/InstallerDetailFormController.createInstallationRecord';
import rsgPage_page from '@salesforce/resourceUrl/rsgPage';
import textPage_page from '@salesforce/resourceUrl/textPage';
import welcomeMessage from '@salesforce/apex/IntallerWelcome.welcomeMessage';
import { NavigationMixin } from 'lightning/navigation';
export default class InstallerDetailForm extends NavigationMixin (LightningElement) {
    options = [
            {value: 'open', label: 'Open'},
            {value: 'closed', label: 'Closed'}
        ];
    installations = [];
    error;
    value = 'open';
    imageUrl1 = rsgPage_page;
    textUrl = textPage_page;
    sfdcBaseURL;
    siteBaseURL;
    vfPage = 'InstallerCardList';
    vfThankPage = 'InstallerThanksPage';
    projectName;
    installationId;
    InstallationNumber;
     InstallationDate;
     InstallSONum;
     InstallationStatus;
     InstallerName;
     InstallerId;
     defaultDate;
     projectId;
     @track projectId;

    connectedCallback() {
        // Get the full URL
        var fullurl = window.location.href;
    
        // Parse the URL to get the query parameters
        var urlParams = new URLSearchParams(new URL(fullurl).search);
    
        // Get the proId parameter from the URL
        var proId = urlParams.get('proId');
        this.projectId = proId;

        // Now you have proId stored in variables
        console.log('proId:', this.projectId);
        this.handleService();
        // Set today's date as the default value
        this.setDefaultDate();
    }

    handleService(event){
        welcomeMessage({recId : this.projectId})
            .then(result => {
                console.log('result 21312312 ---'+ JSON.stringify(result));
                this.InstallerName = result.Installer_Name__r.Name;
                this.projectName = result.Name;
                this.InstallerId = result.Installer_Name__c;
                this.projectId = result.Id;
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching customer name:'+ JSON.stringify(this.error));
                // Handle error
            });
      }

    setDefaultDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // Month is zero-indexed
        let day = today.getDate();

        // Ensure that the month and day have leading zeros if needed
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        // Format the date as "YYYY-MM-DD"
        this.defaultDate = `${year}-${month}-${day}`;
    }

    handleChange(event) {
        const fieldName = event.target.name;
        console.log(event.target.value);

        if (fieldName === 'InstallationDate') {
            console.log(event.target.value);
            this.defaultDate=event.target.value;

        } else if (fieldName === 'InstallSONum') {
            console.log(event.target.value);
            this.InstallSONum=event.target.value;

        } else if (fieldName === 'Status') {
            console.log(event.target.value);
            this.value=event.detail.value;

        }
    }
    
    show=false;
    clickhandler() {
        this.show =true;
        console.log('Date--->', this.defaultDate);
        console.log('SONum--->', this.InstallSONum);
        console.log('status--->', this.value);
        console.log('status--->', this.projectId);
        console.log('InstallerId', this.InstallerId);
        createInstallationRecord({InstallationDate: this.defaultDate,  InstallSONum: this.InstallSONum,  InstallationStatus: this.value, InstallerId: this.InstallerId, projectId: this.projectId})
            .then(result => {
                // Handle success
                //window.location.host + "/" + this.vfThankPage;
                console.log('Installation record created:', JSON.stringify(result));
                this.installationId = result.id;
                this.InstallationNumber = result.Name;
                //this.installationId = result.id;
                
            })
            .catch(error => {
                // Handle error
                console.error('Error creating Installation record:', error);
            });
    }
    
    /*get thankBaseUrl(){
        return (this.siteBaseURL = window.location.origin + "/" + this.vfThankPage);
    }*/

    get setBaseUrl() {
        return (this.sfdcBaseURL = window.location.origin + "/" + this.vfPage );
      }

}
import { LightningElement } from 'lwc';
import rsgLogo_page from '@salesforce/resourceUrl/rsgLogo_page';
import bgImage_page from '@salesforce/resourceUrl/bgImage_page';
import site_action_logo from '@salesforce/resourceUrl/NavIcon1';
import home_action_logo from '@salesforce/resourceUrl/NavIcon2';
import action_action_logo from '@salesforce/resourceUrl/NavIcon3';
import welcomeMessage from '@salesforce/apex/IntallerWelcome.welcomeMessage';
export default class InstallerCardList extends LightningElement {
    bgImageUrl=bgImage_page;
    rsgLogoUrl = rsgLogo_page;
    siteActionUrl  = site_action_logo;
    homeActionUrl  =  home_action_logo;
    actionActionUrl = action_action_logo;
    sfdcBaseURL;
    sfdcBaseURLC;
    vfPage = 'InstallerForm';
    vfPage1 = 'CleaningAndManintenancePage';
    vfPage2 = 'InstallerDataTable';
    accountId;
    recordId;
    pvcCustomer = false;

    connectedCallback() {
        var fullurl = window.location.href;
        var urlParams = new URLSearchParams(new URL(fullurl).search);
        var instaId = urlParams.get('instaId');
        this.accountId = instaId;

        var recordId = urlParams.get('recordId');
        this.recordId = recordId;
        this.handleService();
    }
    handleService(event){
        welcomeMessage({recId : this.accountId})
            .then(result => {
                if(result.Is_Maintainance__c == true){
                    this.pvcCustomer = true;
                }
                else{
                    console.log('data is null');
                }
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching customer name:'+ JSON.stringify(this.error));
            });
      }

    get setBaseUrl() {
        return (this.sfdcBaseURL = window.location.origin + "/RSGInstaller/s/installerForm" + '?instaId='+ this.accountId + '&recordId='+ this.recordId);
      }
    get setBaseUrl1() {
        return (this.sfdcBaseURLC = window.location.origin + "/" + this.vfPage1 + '?instaId='+ this.accountId + '&recordId='+ this.recordId);
      }
    get setBaseUrlHome() {
        return (this.sfdcBaseURLHome = window.location.origin + "/RSGInstaller/s/" + '?instaId='+ this.accountId);
      }
    get setBaseUrlDataTable() {
        return (this.sfdcBaseURLData = window.location.origin + "/RSGInstaller/s/installerList" + '?instaId='+ this.accountId);
      }

    get backgroundImage() {
        return `background-image: url(${this.bgImageUrl}); background-size: cover; padding: 20px; box-sizing: border-box; `;
      }

    handleNavigation(){
        console.log('Inside Navigation');
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes:{
                pageName: 'installerForm'
            },
            state: {
                instaId: this.accountId,
                recordId: this.recordId
            }
        });
    }
}
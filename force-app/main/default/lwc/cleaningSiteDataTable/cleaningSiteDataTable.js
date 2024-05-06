import { LightningElement, api, track } from 'lwc';
import bgImage_page from '@salesforce/resourceUrl/bgImage_page';
import rsgLogo_page from '@salesforce/resourceUrl/rsgLogo_page';
import home_action_logo from '@salesforce/resourceUrl/NavIcon2';
import getCleanData from '@salesforce/apex/InstallerSiteDataTableController.getCleanData';
export default class CleaningSiteDataTable extends LightningElement {
    bgImageUrl=bgImage_page;
    rsgLogoUrl = rsgLogo_page;
    homeActionUrl  =  home_action_logo;
    data=[];
    sfdcBaseURL;
    vfPage = 'InstallerCardList';
    error;
    @api accountId;
    @track currentSite = '';

    connectedCallback() {
        
        // Get the full URL
        var fullurl = window.location.href;
    
        // Parse the URL to get the query parameters
        var urlParams = new URLSearchParams(new URL(fullurl).search);
    
        // Get the proId parameter from the URL
        // var proId = urlParams.get('proId');
        // this.projectId = proId;

        var instaId = urlParams.get('instaId');
        this.accountId = instaId;

        // Now you have proId stored in variables
        //console.log('proId:', this.projectId);
        console.log('instaId', this.accountId);
         if (this.accountId) {
             this.handleService();
         }
    }

    //for sorting
    @track selectedValue = '0';
    @track selectOptions = [
    { label: '2', value: '2' },
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: 'All', value: '0' }
    ];

    handleDataChange(event) {
    this.selectedValue = event.detail.value;
    getCleanData({instaId : this.accountId, selectedValue: this.selectedValue})
            .then(result => {
                console.log('result 21312312 ---'+ JSON.stringify(result));
                //this.data = result;
                if (result !== null && result !== undefined) {
                    this.data = result;
                    console.log('data--->', JSON.stringify(result));
                }
                else{
                    console.log('data is null');
                }
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching Sites:'+ JSON.stringify(this.error));
                // Handle error
            });
    }

    handleService(event){
        getCleanData({instaId : this.accountId, selectedValue: this.selectedValue})
            .then(result => {
                //console.log('result 21312312 ---'+ JSON.stringify(result));
                //this.data = result;
                if (result !== null && result !== undefined) {
                    this.data = result;
                    
                    console.log('data--->', JSON.stringify(result));
                }
                else{
                    console.log('data is null');
                }
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching Sites:'+ JSON.stringify(this.error));
                // Handle error
            });
    }
    handleSiteChange(event){
        this.currentSite = event.target.name;
        console.log(this.currentSite);
    }

    get backgroundImage() {
        return `background-image: url(${this.bgImageUrl}); background-size: cover; padding: 20px; box-sizing: border-box; `;
    }

    get setBaseUrl() {
        return (this.sfdcBaseURL = window.location.origin + "/" + this.vfPage +'?instaId='+ this.accountId + '&recordId=' + this.currentSite);
      }
    
      get setBaseUrlHome(){
        return (this.sfdcBaseURL = window.location.origin + '?instaId='+ this.accountId);
      }
}
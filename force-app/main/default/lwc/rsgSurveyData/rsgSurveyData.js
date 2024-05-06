import { LightningElement } from 'lwc';
import RGS_logo from "@salesforce/resourceUrl/RGS_logo";
import getSurveyRecordApex from '@salesforce/apex/SurveyorPortalController.getSurveyRecord';
import updateSurveyRecordApex from '@salesforce/apex/SurveyorPortalController.updateSurveyRecord';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import bgImage_page from '@salesforce/resourceUrl/bgImage_page';
export default class RsgSurveyData extends LightningElement {
    bgImageUrl=bgImage_page;
    rsgLogo = RGS_logo;
    projectId;
    surveyId;
    surveyRecord = [];
    get backgroundImage() {
        return `background-image: url(${this.bgImageUrl}); background-size: cover; padding: 4px; `;
    }
    get options() {
        return [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
        ];
    }
    get reachOptions(){
        return [
            {label : 'Self-Contained', value : 'Self-Contained'},
            {label : 'Remote Condensing Unit', value : 'Remote Condensing Unit'}
        ]
    }
    get viOptions(){
        return [
            {label : 'Poor - Major repairs may be needed', value : 'Poor - Major repairs may be needed'},
            {label : 'Typical - minor repairs may be needed', value : 'Typical - minor repairs may be needed'},
            {label : 'Acceptable - no obvious repairs observed', value : 'Acceptable - no obvious repairs observed'}
        ]
    }

    get intextOptions(){
        return [
            {label : 'Internal', value : 'Internal'},
            {label : 'External', value : 'External'}
        ]
    }

    connectedCallback() {
        // Get the full URL
        var fullurl = window.location.href;
        // Parse the URL to get the query parameters
        var urlParams = new URLSearchParams(new URL(fullurl).search);

        // Get the oppId parameter from the URL
         this.projectId = urlParams.get('projectId');

        // Get the surveyId parameter from the URL
         this.surveyId = urlParams.get('surveyId');

        console.log('projectId:', this.projectId);
        console.log('surveyId:', this.surveyId);
    
        this.getSurveyRecord();
    }

    getSurveyRecord() {
        getSurveyRecordApex({   
            surveyId: this.surveyId
        })
        .then(result => {
            if(result != null){
                this.surveyRecord = result;
                console.log('surveyRecord = ' + JSON.stringify(this.surveyRecord));
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });            
    } 

    handleInputChange(event) {
        // Get the field name and value from the input event
        const fieldName = event.target.dataset.field;
        let fieldValue;
        if (event.target.type === 'checkbox') {
            fieldValue = event.target.checked;
        }
        else {
            if(event.target.value) {
                fieldValue = event.target.value;
            }
        }
        // Update the corresponding property in the worksheet object
         this.surveyRecord[fieldName] = fieldValue;
         console.log('surveyRecord = ' + JSON.stringify(this.surveyRecord));
    }
    
    updateSurveyRecord(event) {
        updateSurveyRecordApex({
            surveyRecord: this.surveyRecord,
        })
            .then(result => {
                if(result != null){
                    this.surveyRecord = result; 
                    console.log('Updated surveyRecord = ' + JSON.stringify(this.surveyRecord));
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success!",
                            message: "Survey record submitted successfully.",
                            variant: "success"
                        })
                    );
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.displayError(error.body.message);
         });
    }

     showTab1Content = true;
     showTab2Content = false;

    get tab1Class() {
        return this.showTab1Content ? 'active-tab' : 'inactive-tab';
    }

    get tab2Class() {
        return this.showTab2Content ? 'active-tab' : 'inactive-tab';
    }

    handleTab1Click() {
        this.showTab1Content = true;
        this.showTab2Content = false;
    }

    handleTab2Click() {
        this.showTab1Content = false;
        this.showTab2Content = true;
    }

    showMedTemp = false;
    showLowTemp = false;
    showBeerCooler = false;
    showGeneral = false;

    get buttonLabel() {
        return this.showMedTemp ? 'Hide' : 'Show';
    }

    get buttonLabel2(){
        return this.showLowTemp ? 'Hide' : 'Show';
    }

    get buttonLabel3(){
        return this.showBeerCooler ? 'Hide' : 'Show';
    }

    get buttonLabel4(){
        return this.showBeerCooler ? 'Hide' : 'Show';
    }

    get medTempIcon() {
        return this.showMedTemp ? 'utility:dash' : 'utility:add';
    }

    get lowTempIcon(){
        return this.showLowTemp ? 'utility:dash' : 'utility:add';
    }

    get beerIcon(){
        return this.showBeerCooler ? 'utility:dash' : 'utility:add';
    }

    get genralIcon(){
        return this.showGeneral ? 'utility:dash' : 'utility:add';
    }

    handleMedTempIcon() {
        this.showMedTemp = !this.showMedTemp;
    }

    handleLowTempIcon(){
        this.showLowTemp = !this.showLowTemp;
    }

    handleBeerCoolerIcon(){
        this.showBeerCooler = !this.showBeerCooler;
    }

    handleGeneralIcon(){
        this.showGeneral = !this.showGeneral;
    }

}
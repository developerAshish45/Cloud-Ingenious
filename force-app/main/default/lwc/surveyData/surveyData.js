import { LightningElement,track } from 'lwc';
import createSiteSurveyRecord from '@salesforce/apex/SurveyorPortalController.createSiteSurveyRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SurveyData extends LightningElement {
    @track tableData = [
        { id: '1', surveyItem: 'LOCATION OF CRANE FOR ROOF EQ. INSTALL', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '2', surveyItem: 'Is there an airport nearby that would require an FAA study? (can take 3-6 months)', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '3', surveyItem: 'LOCATION OF ROOF HATCH, ACCEPTANCE OF ACCESS', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '4', surveyItem: 'STORE ENERGY MANAGEMENT SYSTEM (EMS) (GRIDPOINT, FSG, OTHER) - Take photos of EMS system inside the cooler/freezer', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '5', surveyItem: 'MANUFACTURER', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '',type:'text' },
        { id: '6', surveyItem: 'DATE OF MFG.', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '',type:'Date' },
        { id: '7', surveyItem: 'CONDENSING UNIT #M1/L1 - MODEL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '8', surveyItem: 'CONDENSING UNIT #M1/L1 - SERIAL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '9', surveyItem: 'CONDENSING UNIT #M1/L1 - WAG ASSET TAG # (IF APPLICABLE)', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '10', surveyItem: 'CONDENSING UNIT #M2/L2 - MODEL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '11', surveyItem: 'CONDENSING UNIT #M2/L2 - SERIAL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '12', surveyItem: 'CONDENSING UNIT #M2/L2 - WAG ASSET TAG # (IF APPLICABLE)', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '13', surveyItem: 'CONDENSING UNIT #M3/L3 - MODEL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '14', surveyItem: 'CONDENSING UNIT #M3/L3 - SERIAL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '15', surveyItem: 'CONDENSING UNIT #M3/L3 - WAG ASSET TAG # (IF APPLICABLE)', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' }
    ];
    jsonData
    renderedCallback() {
        this.adjustColumnHeight();
    }
    
    adjustColumnHeight() {
        const firstColumn = this.template.querySelector('.slds-size_1-of-12');
        const secondColumn = this.template.querySelector('.slds-size_11-of-12');
        if (firstColumn && secondColumn) {
            firstColumn.style.height = secondColumn.clientHeight + 'px';
        }
    }
    

    handleInputChange(event) {
        const id = event.target.dataset.id;
        const field = event.target.dataset.field;
        const value = event.target.value;
        const rowIndex = this.tableData.findIndex(row => row.id === id);
        if (rowIndex !== -1) {
            this.tableData[rowIndex][field] = value;
            this.tableData = [...this.tableData];
        }
        console.log("this.tableData",this.tableData)

        this.jsonData = this.getTableDataAsJSON();
        console.log(this.jsonData);
        //this.handleClick()
    }


    handleClick(){
        console.log('LOCATION OF CRANE FOR ROOF EQ. INSTALL MEDIUM TEMP :-'+this.jsonData[0].mediumTemp)
        console.log('LOCATION OF CRANE FOR ROOF EQ. INSTALL LOW TEMP :-'+this.jsonData[0].lowTemp)
        const locOfCraneMediumTemp = this.jsonData[0].mediumTemp;
        const locOfCraneLowTemp = this.jsonData[0].lowTemp;
        const locOfCraneBeerCoolerMedTemp = this.jsonData[0].beerCool;
        const locOfCranePhotosTaken = this.jsonData[0].photosTaken;
        const locOfCraneNotes = this.jsonData[0].notes;
        const storeEnergyMediumTemp = this.jsonData[3].mediumTemp;
        const storeEnergyLowTemp = this.jsonData[3].lowTemp;
        const storeEnergyBeerCoolerMedTemp = this.jsonData[3].beerCool;
        const storeEnergyPhotosTaken = this.jsonData[3].photosTaken;
        const storeEnergyNotes = this.jsonData[3].notes;
        const dateOfMfgMedTemp = this.jsonData[5].mediumTemp;
        const dateOfMfgLowTemp = this.jsonData[5].lowTemp;
        const dateOfMfgBeerCoolerMedTemp = this.jsonData[5].beerCool;
        const dateOfMfgPhotosTaken = this.jsonData[5].photosTaken;
        const dateOfMfgNotes = this.jsonData[5].notes;
        const manufacureMedTemp = this.jsonData[4].notes;
        const manufacureLowTemp = this.jsonData[4].notes;
        const manufacurebeerCoolerTemp = this.jsonData[4].notes;
        const manufacurePhotosTaken = this.jsonData[4].notes;
        const manufacureNotes = this.jsonData[4].notes;
        
        createSiteSurveyRecord({
            locOfCraneMediumTemp,
            locOfCraneLowTemp,
            locOfCraneBeerCoolerMedTemp,
            locOfCranePhotosTaken,
            locOfCraneNotes,
            storeEnergyMediumTemp,
            storeEnergyLowTemp,
            storeEnergyBeerCoolerMedTemp,
            storeEnergyPhotosTaken,
            storeEnergyNotes,
            dateOfMfgMedTemp,
            dateOfMfgLowTemp,
            dateOfMfgBeerCoolerMedTemp,
            dateOfMfgPhotosTaken,
            dateOfMfgNotes,
            manufacureMedTemp,
            manufacureLowTemp,
            manufacurebeerCoolerTemp,
            manufacurePhotosTaken,
            manufacureNotes
        })
        .then(result => {
            // Handle success
            console.log('Records created successfully:', result);
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'Records created successfully',
                variant: 'success'
            });
            this.dispatchEvent(event);
    
            // Clear the form fields
            this.clearFormFields();
        })
        .catch(error => {
            // Handle error
            console.error('Error creating records:', error);
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Error creating records',
                variant: 'error'
            });
            this.dispatchEvent(event);
        });
    }
    
    clearFormFields() {
        this.tableData = this.tableData.map(row => ({
            ...row,
            mediumTemp: '',
            lowTemp: '',
            beerCool: '',
            photosTaken: '',
            notes: ''
        }));
    }
    
    getTableDataAsJSON() {
        return JSON.parse(JSON.stringify(this.tableData));
    }

}
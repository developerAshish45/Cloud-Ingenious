import { LightningElement, track,api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFileVersions from "@salesforce/apex/SurveyorPortalController.getVersionFiles";
export default class BeerTempEvaporators extends LightningElement {


    relatedRecordBool = true;
    currentPageReference;
    loaded = false;
    @track selectedSectionCount = '';
    @track sections = [];
    loaded = false;
    @track fileList;
    @track files = [];
    @track successMessage;
    @track errorMessage;
    @api surveyRecord ;
    fileName ;
    listFileName = [];

    column1Labels = [
       'Photos of Top of Walk in Box',
       'Photos of the Existing Gridpoint System Inside the Cooler/Freezer',
       'Photo of Modular Alarm on Door Showing Freezer Temp',
       'Photos of All Dial Thermometers Showing Temperatures',
       'Photo of Temperature Inside Cooler/Freezer (F) to be Measured Independently of Walk in Temp Sensors',
       'Photo of Data Tags on Both Cooler Evaps',
       'Photo of Data Tag on Freezer Evap Coils',
       'Photo of Evap Coils in Cooler & Freezer',
       'Photos of Drains in Cooler & Freezer',
       'Photos of Floor in Cooler & Freezer',
       'Photos of Main Doors in Cooler & Freezer with Door Closed'
    ];
    @track sufixName = [
        'TopWalkBox',
        'GridpointCooler',
        'ModularAlarmTemp',
        'dialThermometers',
        'IdependentlySensors',
        'DataTagCoolerEvaps',
        'DataTagFreezerEvaps',
        'EvapCoilsCooler&Freezer',
        'DrainsCooler&Freezer',
        'FloorCooler&Freezer',
        'Cooler&FrzeerDoorClosed'
    ];
    handleSectionCountChange(event) {
        this.selectedSectionCount = event.target.value;
        this.generateSections();
    }
    generateSections() {
        this.sections = [];
        for (let i = 1; i <= parseInt(this.selectedSectionCount); i++) {
            let section = { key: i, label: 'Evaporators ' + i, rows: [] };
            for (let j = 1; j <= 11; j++) {
                let row = { key: j, columns: [] };
                for (let k = 1; k <= 3; k++) {
                    if (k === 1) {
                        row.columns.push({ key: k, label: this.column1Labels[j - 1] , isInput: true , sufix : 'BeerTemp'+ this.sufixName[j - 1] + ':' + 'EV-' + i});
                    } else if (k === 2) {
                        row.columns.push({ key: k, label: 'File Upload ' + k, isFileUpload: true , sufix : 'BeerTemp'+ this.sufixName[j - 1] + ':' + 'EV-' + i +'RecordId:' + this.surveyRecord});
                    } else {
                        row.columns.push({ key: k, label: 'Display Photos ' + k, isDisplayPhotos: true, photos: [] });
                    }
                }
                section.rows.push(row);
            }
            this.sections.push(section);
        }
    }
   

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        uploadedFiles.forEach(file => {
            this.fileName = file.name.split('.').slice(0, -1).join('.');
            let sufix = event.target.dataset.sufix;
            if (sufix.includes('RecordId')) {
                sufix = sufix.split('RecordId')[0];
                this.fileName += '_' + sufix;
                console.log('File Name 71', this.fileName);
            } else {
                this.fileName += '_' + sufix;
                console.log('File Name 74', this.fileName);
            }
            this.listFileName.push(this.fileName); // Corrected the method name from `pust` to `push`
        });
        let noOfFiles = uploadedFiles.length;
        console.log('No. of files uploaded', noOfFiles);
        console.log('-------file details---' + JSON.stringify(uploadedFiles));
        this.loadFileVersions();
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'File(s) Download',
                message: noOfFiles + ' File(s) Uploaded Successfully!!!',
                variant: 'success'
            }),
        );
    }

    loadFileVersions() {
        getFileVersions({ recordId: this.surveyRecord, fileName :this.listFileName})
            .then(result => {
                console.log('Result from getFileVersions:', result);
                if (result && result.length > 0) {
                    this.fileList = result;
                    this.files = result.map(fileData => {
                        console.log('Title:', fileData.Title);
                        console.log('Extension:', fileData.FileExtension);
                        return {
                            Id: fileData.Id,
                            Title: fileData.Title,
                            Extension: fileData.FileExtension,
                            ContentDocumentId: fileData.ContentDocumentId,
                            ContentDocument: fileData.ContentDocument,
                            CreatedDate: fileData.CreatedDate,
                            thumbnailFileCard: "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" + fileData.Id + "&operationContext=CHATTER&contentId=" + fileData.ContentDocumentId,
                            downloadUrl: "/sfc/servlet.shepherd/document/download/" + fileData.ContentDocumentId
                        };
                    });
                    // Add fourth key to every column in each row
                    // MedTempTopRoofHatchOpen:CU-1
                    // SurveyLogo_MedTempTopRoofHatchOpen:CU-2
                    const newValue = this.files;
                    console.log('newValue',JSON.stringify(newValue));
                    this.sections.forEach(section => {
                        section.rows.forEach(row => {
                            row.columns.forEach(column => {
                                const newName = newValue[0].Title.split('_')[1];
                                console.log('Label newValue', newName);
                                console.log('Column sufix ', column.sufix);
                                if(column.sufix == newName){
                                    console.log('line 133');
                                    row.filesData = newValue;
                                }
                            });
                        });
                    });
                    console.log('final node=>', JSON.stringify(this.sections));
                    this.loaded = true;
                } else {
                    console.error('No file versions found.');
                    this.showToast('error', 'Error', 'No file versions found.');
                }
            })
            .catch(error => {
                console.error('Error fetching file versions:', error);
                this.showToast('error', 'Error', 'Error fetching file versions: ' + error.body.message);
            });
        }

}
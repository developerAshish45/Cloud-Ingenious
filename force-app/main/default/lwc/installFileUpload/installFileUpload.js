import { LightningElement,track,api } from 'lwc';
import getVersionFiles from '@salesforce/apex/InstallerDetailFormController.getVersionFiles';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class InstallFileUpload extends LightningElement {
    isImageLoading = false;
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
    @api installRecord ;
    fileName;
    listFileName = [];
    @track sufixName = [
         'Walk-in',
         'Refrigeration – Evaporator Section for the Cooler',
         'Refrigeration – Condensing Unit for the Cooler',
         'Refrigeration – Condensing Unit for the Freezer',
         'Refrigeration – Evaporator Section for the Cooler',
         'Refrigeration – Evaporator Section for the Freezer',
         'Final Inspection of the Walk-in and Refrigeration Systems'
     ];

    get acceptedFormats() {
        return ['.jpeg', '.png', '.jpg'];
    }
    connectedCallback() {
        this.generateSections();
        this.loadFileVersions(); // Call to load file versions on component initialization
    }
    generateSections() {
        this.sections = [];
        for (let i = 1; i <= parseInt(1); i++) {
            let section = { key: i, label: 'Repairs Made', rows: [] };
            for (let j = 1; j <= parseInt(1); j++) {
                let row = { key: j, columns: [] };
                for (let k = 1; k <= 3; k++) {
                    if (k === 1) {
                        row.columns.push({ key: k, label: 'File Upload ' + k, isFileUpload: true , sufix : ''+ this.sufixName[j - 1] + ':' + 'Que' + i +'RecordId:' + this.installRecord});
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
            this.listFileName.push(this.fileName);
        });
        let noOfFiles = uploadedFiles.length;
        console.log('No. of files uploaded', noOfFiles);
        console.log('-------file details---' + JSON.stringify(uploadedFiles));
        this.loadFileVersions();
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'File(s) Upload',
                message: noOfFiles + ' File(s) Uploaded Successfully!!!',
                variant: 'success'
            }),
        );
    }
    loadFileVersions() {
        this.isImageLoading = true;
        console.log('Installation Record Id 100 ', this.installRecord);
        getVersionFiles({ recordId: this.installRecord })
            .then((result) => {
                this.isImageLoading = false;
                console.log('result1234'+ JSON.stringify(result));
                if (result && result.length > 0) {
                    this.fileList = result;
                    console.log(this.fileList);
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
                            thumbnailFileCard: "/RSGInstaller/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB120BY90&versionId=" + fileData.Id + "&operationContext=CHATTER&contentId=" + fileData.ContentDocumentId,
                            downloadUrl: "/RSGInstaller/sfc/servlet.shepherd/document/download/" + fileData.ContentDocumentId
                        };
                    });
                    this.processFileVersions(this.files);
                    this.loaded = true;
                } 
                // else {
                //    this.showToast('error', 'Error', 'No file versions found.');
                // }
            })
            .catch((error) => {
                console.error('Error fetching file versions:', error);
            });
    }
    processFileVersions(fileVersions) {
        this.sections.forEach((section) => {
            section.rows.forEach((row) => {
                const rowFilesData = [];
                row.columns.forEach((column) => {
                    const matchingFiles = fileVersions.filter((file) => file.Title.includes('Walk-in:Que1'));
                    if (matchingFiles.length > 0) {
                        rowFilesData.push(...matchingFiles);
                    }
                });
                row.filesData = rowFilesData;
            });
        });
    }
    showToast(variant, title, message) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            })
        );
    }
}
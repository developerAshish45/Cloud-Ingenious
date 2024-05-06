import { LightningElement, track, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import gojs from '@salesforce/resourceUrl/GoJS';
import getAccountsHierarchy from '@salesforce/apex/AccountTreeDataController.getAccountsHierarchy';

export default class FamilyTreeLWC extends LightningElement {
    @track showDiagram = false;
    diagramDivId;
    jsonDataForTree = [];
    @api recordId ='0013I00000ygw6QQAQ';  // Temp hardcode if for POC in Sandbox if this LWC is not on Account record Page layout

    connectedCallback() {
        console.log('connectedCallback - recordId:', this.recordId);
        if (this.recordId) {
            this.retrieveAccountsHierarchy(this.recordId);
        }
    }

    retrieveAccountsHierarchy(accountId) {
        console.log('retrieveAccountsHierarchy - accountId:', accountId);
        getAccountsHierarchy({ recordId: accountId })
            .then(data => {
                this.jsonDataForTree = data;
                console.log('jsonDataForTree= ', JSON.stringify(this.jsonDataForTree));
                this.initializeDiagram();
            })
            .catch(error => {
                console.error('Error loading accounts hierarchy:', error);
            });
    }

    initializeDiagram() {
        console.log('initializeDiagram');
        if (!this.goJsInitialized) {
            this.goJsInitialized = true;
            this.diagramDivId = 'familyTreeDiagram_' + Date.now();

            Promise.all([
                loadScript(this, gojs),
                // Load other GoJS files as needed
            ])
            .then(() => {
                this.showDiagram = true;
            })
            .catch(error => {
                console.error('Error loading GoJS:', error);
            });
        }
    }

    renderedCallback() {
        console.log('renderedCallback - showDiagram:', this.showDiagram);
        if (this.showDiagram) {
            setTimeout(() => {
                const $ = go.GraphObject.make;
                const diagramDiv = this.template.querySelector(`[id^="${this.diagramDivId}"]`);
                if (diagramDiv) {
                    const myDiagram = $(go.Diagram, diagramDiv, {
                        layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 }),
                        initialContentAlignment: go.Spot.Center,
                        contentAlignment: go.Spot.Center
                    });

                    myDiagram.nodeTemplate =
                    $(go.Node, 'Vertical',
                        $(go.Panel, 'Auto',
                            $(go.Shape, 'RoundedRectangle', {
                                fill: 'lightgray',
                                stroke: null // No border
                            },
                            new go.Binding('fill', 'col', function(col) {
                                return col || 'lightgray'; // Use 'col' if present, otherwise default to red
                            })),
                            $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
                        ),
                        // Add an additional text block below the rectangle for the heading
                        $(go.TextBlock, { margin: 8, font: 'bold 12px sans-serif', stroke: 'black' },
                            new go.Binding('text', 'heading'))
                    );
                
                    myDiagram.model = new go.TreeModel(this.jsonDataForTree);
                }
            }, 0);
        }
    }
}
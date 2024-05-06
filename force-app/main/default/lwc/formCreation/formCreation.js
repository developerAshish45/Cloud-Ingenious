import { LightningElement } from 'lwc';
import upload__C from '@salesforce/resourceUrl/upload';
import left__C from '@salesforce/resourceUrl/left';
import right__C from '@salesforce/resourceUrl/right';
import img__C from '@salesforce/resourceUrl/img';
import list__C from '@salesforce/resourceUrl/list';
import png3__C from '@salesforce/resourceUrl/png3';
import png4__C from '@salesforce/resourceUrl/png4';
import png5__C from '@salesforce/resourceUrl/png5';
import png6__C from '@salesforce/resourceUrl/png6';
import png7__C from '@salesforce/resourceUrl/png7';
import bg__C from '@salesforce/resourceUrl/bg';
import frid__C from '@salesforce/resourceUrl/frid';


export default class FormCreation extends LightningElement {

    upload;
    list;
    left;
    right;
    img;

    bg = bg__C;
    png3=png3__C;
    png4=png4__C;
    png5=png5__C;
    png6=png6__C;
    png7=png7__C;
     frid=frid__C;
    get backgroundStyle() {
        return `background-image: url(${this.bg});color:black;height:100%`;
    }
    get container(){
        return `display: flex;flex-direction: column;justify-content: space-around;background-size: cover;height: 92vh;align-items: center;padding: 20px;`;
    }
    
    get imgBox()
    {
     return `background-size: contain;background-repeat: no-repeat;width: 50%;height: 150px;mix-blend-mode: multiply;`;
    }
    get boxes1()
    {
     return `background-image: url(${this.png3});background-size: cover`;                

    }
    get boxes2()
    {
        return `background-image: url(${this.png4});background-size: cover`;                

    }
    get boxes3()
    {
        return `background-image: url(${this.png5});background-size: cover`;                

    }
    get boxes4()
    {
        return `background-image: url(${this.png6});background-size: cover`;                

    }
    get boxes5()
    {
        return `background-image: url(${this.png7});background-size: cover`;                

    }
     renderedCallback()
     {
        this.upload=upload__C;
        this.list=list__C;
        this.left=left__C;
        this.right=right__C;
        this.img=img__C;
     }
}
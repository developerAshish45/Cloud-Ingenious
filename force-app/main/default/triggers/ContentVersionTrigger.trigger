trigger ContentVersionTrigger on ContentVersion (before insert, after insert) {
    
    if(trigger.isAfter && trigger.isInsert){
        List <ContentDocumentLink> listCDLs = new List <ContentDocumentLink>();    
        for(ContentVersion objCV : trigger.new ) {    
            if ( String.isNotBlank( objCV.Guest_Record_fileupload__c ) ) { 
                List<String> parts = objCV.Guest_Record_fileupload__c.split('RecordId:');
                String recId = parts[1] ;
                System.debug('---------------id-------'+recId);
                ContentDocumentLink objCDL = new ContentDocumentLink();
                objCDL.LinkedEntityId = recId ;
                objCDL.ContentDocumentId = objCV.ContentDocumentId;
                listCDLs.add(objCDL);            
            }    
        }
        
        if( listCDLs.size() > 0 && !Test.isRunningTest()) {        
            insert listCDLs;        
        }
    }
    
    if(trigger.isBefore && trigger.isInsert){
       
        for(ContentVersion objCV : trigger.new ) {    
            if ( String.isNotBlank(objCV.Guest_Record_fileupload__c ) ) {      
                String fileusfix = objCV.Guest_Record_fileupload__c.substring(0, objCV.Guest_Record_fileupload__c.indexof('RecordId:'));
                  System.debug('---------------fileusfix-------'+fileusfix);
                objCV.Title = objCV.Title + '_' + objCV.Guest_Record_fileupload__c.substring(0, objCV.Guest_Record_fileupload__c.indexof('RecordId:'));
            }    
        }
    }

}
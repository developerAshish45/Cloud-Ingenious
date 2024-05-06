public without sharing class CleaningAndMaintenanceController {
@AuraEnabled(cacheable = true)
public static Cleaning_and_Maintainance__c getRecords(Id recId){
    // string recId2 = apexpages.currentpage().getparameters().get('id')
            System.debug('Received recordId: ' + recId);
    List<Cleaning_and_Maintainance__c> refList =[Select Id,Cleaning_and_Maintainance__c.Name,Cleaning_Maintainance_Name__r.Name, Project_Name__r.Name, Project_Name__r.Site_Number__c
                            ,Project_Name__r.Customer_Name__r.Name 
                            FROM Cleaning_and_Maintainance__c WHERE Id = :recId LIMIT 1];
    if(refList.size()>0){
        system.debug('project Id --->'+refList[0].Id+ '&& '+refList[0].Name);
        system.debug('cust name --->'+ refList[0].Name);
        return refList[0]; 
    }
    else{
        system.debug('list size is zero');
    }
    return null; 
}

@AuraEnabled
public static String updateCleanAndMaintRecord(String recordId, String pastDueDate, String wgSign, String pastDueyn, 
                                                    String cleaningPerformed, String cleaningPicturesReceived, String cleaningPicturesUploaded,
                                                    String maintenancePerformed,String maintenancePicturesReceived,String maintenancePicturesUploaded) {
try {
    List<Cleaning_and_Maintainance__c> cleanList = new List<Cleaning_and_Maintainance__c>();
    Cleaning_and_Maintainance__c newCleaning = new Cleaning_and_Maintainance__c();
    newCleaning.Id = recordId;
    newCleaning.WG_Sign_Off_Received__c = wgSign;
    newCleaning.Past_Due_Y_N__c = pastDueyn;
    newCleaning.Past_Due_Date__c = Date.valueOf(pastDueDate);
    newCleaning.Cleaning_Performed__c = Date.valueOf(cleaningPerformed);
    newCleaning.Cleaning_Pictures_Received__c = Date.valueOf(cleaningPicturesReceived);
    newCleaning.Cleaning_Pictures_Uploaded__c = Date.valueOf(cleaningPicturesUploaded);
    newCleaning.Maintenance_Performed__c = Date.valueOf(maintenancePerformed);
    newCleaning.Maintenance_Pictures_Received__c = Date.valueOf(maintenancePicturesReceived);
    newCleaning.Maintenance_Pictures_Uploaded__c = Date.valueOf(maintenancePicturesUploaded);
    cleanList.add(newCleaning);

    if(!cleanList.isEmpty()){
        update cleanList;
    }
    return 'Success';
} catch (Exception e) {
    throw new AuraHandledException('Error creating Installation record: ' + e.getMessage());
}
}

/*@AuraEnabled
public static List<ContentVersion> getVersionFiles(String cleanRecordId){
    System.debug('Reached--1234'+ cleanRecordId);
    List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId 
    FROM ContentDocumentLink 
    WHERE LinkedEntityId = :cleanRecordId];
    System.debug('Reached--5678'+ cleanRecordId);
Set<Id> contentDocumentIds = new Set<Id>();
for (ContentDocumentLink link : contentDocumentLinks) {
contentDocumentIds.add(link.ContentDocumentId);
}
System.debug('Reached--5678'+ cleanRecordId);
List<ContentVersion> relatedFiles = [SELECT Id,Title,ContentDocumentId,FileType, ContentSize,FileExtension,VersionNumber,
CreatedDate,VersionData,FirstPublishLocationId FROM ContentVersion 
WHERE ContentDocumentId IN :contentDocumentIds  ];
System.debug('Content Doc Id'+relatedFiles[0].ContentDocumentId);
System.debug('RelatedFiles----'+relatedFiles);
return relatedFiles;
}*/
@AuraEnabled
  public static String uploadFile(String base64, String filename, String recordId) {
        ContentVersion cv = createContentVersion(base64, filename);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        if (cv == null || cdl == null) { return null; }
        return cdl.Id;
  }

  private static ContentVersion createContentVersion(String base64, String filename) {
    ContentVersion cv = new ContentVersion();
    cv.VersionData = EncodingUtil.base64Decode(base64);
    cv.Title = filename;
    cv.PathOnClient = filename;
    try {
      insert cv;
      return cv;
    } catch(DMLException e) {
      System.debug(e);
      return null;
    }
  }

  private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
    if (contentVersionId == null || recordId == null) { return null; }
ContentDocumentLink cdl = new ContentDocumentLink();
cdl.ContentDocumentId = [
SELECT ContentDocumentId 
FROM ContentVersion 
WHERE Id =: contentVersionId
].ContentDocumentId;
cdl.LinkedEntityId = recordId;
// ShareType is either 'V', 'C', or 'I'
// V = Viewer, C = Collaborator, I = Inferred
cdl.ShareType = 'V';
try {
insert cdl;
return cdl;
} catch(DMLException e) {
System.debug(e);
return null;
}
}

}
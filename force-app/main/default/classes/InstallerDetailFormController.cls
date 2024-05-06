public without sharing class InstallerDetailFormController {

	@AuraEnabled
    public static List<ContentVersion> getVersionFiles(String recordId) {
        List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
        Set<Id> contentDocumentIds = new Set<Id>();
        for (ContentDocumentLink link : contentDocumentLinks) {
            contentDocumentIds.add(link.ContentDocumentId);
        }
        List<ContentVersion> relatedFiles = [SELECT Id,Title,ContentDocumentId,FileType, ContentSize,FileExtension,VersionNumber,CreatedDate,VersionData,FirstPublishLocationId FROM ContentVersion WHERE ContentDocumentId IN :contentDocumentIds];
        System.debug(relatedFiles);
        return relatedFiles;
    }

    @AuraEnabled
    public static List<ContentVersion> retrieveFiles(String recordId){
        List<ContentDocumentLink> cdlList = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: recordId];
        List<Id> cdIds = new List<Id>();
        for(ContentDocumentLink obj: cdlList){
            cdIds.add(obj.ContentDocumentId);
        }
        List<ContentVersion> cvList = [SELECT Id, ContentDocumentId, ContentUrl, VersionNumber, Title, PathOnClient,
                                       FileType, FileExtension, ContentSize,CreatedDate FROM ContentVersion WHERE 
                                       ContentDocumentId IN:cdIds];
        return cvList;
    }

    @AuraEnabled
    public static Installation__c updateInstallationRecord(String recId, String InstallSONum, String InstallationStatus, String siteNum){
        try {
            Installation__c newInstallation = [SELECT Id, Installation_Status__c, Install_SO__c, Site_Number__c FROM Installation__c WHERE Id = :recId LIMIT 1];
            newInstallation.Id = recId;
            newInstallation.Installation_Status__c = InstallationStatus;
            newInstallation.Install_SO__c = InstallSONum;
            newInstallation.Site_Number__c = siteNum;
            update newInstallation;
            return newInstallation;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Installation__c updateInstallCheckbox(List<Installation__c> installRecord,string recId){
        try {
            Installation__c newInstallation = [SELECT Id, Walkin_Question_One__c  FROM Installation__c WHERE Id = :recId LIMIT 1];
            newInstallation.Id = recId;
            update newInstallation;
            return newInstallation;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Installation__c updateInProgressRecord(String recId, String InstallSONum, String InstallationStatus, String siteNum){
        try {
            System.debug(recId);
            Installation__c inProgressInstallation = [SELECT Id, Installation_Status__c, Install_SO__c, Site_Number__c FROM Installation__c WHERE Id = :recId LIMIT 1];
            inProgressInstallation.Id = recId;
            inProgressInstallation.Installation_Status__c = InstallationStatus;
            inProgressInstallation.Install_SO__c = InstallSONum;
            inProgressInstallation.Site_Number__c = siteNum;
            update inProgressInstallation;
            return inProgressInstallation;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String createNote(String noteTitle, String noteBody, Id parentId) {
        String message = '';
        List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :parentId LIMIT 5000];
        Set<Id> setofId = new Set<Id>();
        for(ContentDocumentLink objCD : documentLinks){
            setofId.add(objCD.ContentDocumentId);
        }
        // Check for existing notes with the same title for the given parent
        List<ContentNote> existingNotes = [SELECT Id, Title, Content  FROM ContentNote WHERE Id = :setofId AND Title = :noteTitle LIMIT 1];
        // If an existing note with the same title exists, update the body and exit
        if (existingNotes.size()>0) {
            ContentNote existingNote = existingNotes[0];
            existingNote.Content = Blob.valueOf(noteBody);
            try{
                update existingNote;
            } Catch(Exception e) {
                message = e.getMessage();
                System.debug('Exception while updating ' +e.getMessage());
            }
            message = 'Success';
            System.debug('Note  updated successfully.');
            return message;
        }
        ContentNote newNote = new ContentNote();
        newNote.Title = noteTitle;
        newNote.Content = Blob.valueOf(noteBody);
        try {
            insert newNote;
        } Catch(Exception e){
            System.debug('Exception while Inserting ' +e.getMessage());
        }
        // Create a ContentDocumentLink to associate the note with the parent record
        System.debug('New Note ' +newNote.Id);
        ContentDocumentLink docLink = new ContentDocumentLink();
        docLink.LinkedEntityId = parentId;
        docLink.ContentDocumentId = newNote.Id;
        //docLink.ContentDocumentId = [Select ContentDocumentId from ContentVersion where FileType = 'SNOTE' order by createddate desc limit 1].Id;
        docLink.ShareType = 'V'; // Inferred permission
        docLink.Visibility = 'AllUsers';
        try {
            insert docLink;
        } Catch(Exception e){
            System.debug('Exception while Doc Link ' +e.getMessage());
        }
        message = 'Success';
        System.debug('Note created successfully.');
        return message;
    }



    @AuraEnabled
    public static String getNote(String parentId, String noteTitle) {
        String contentBody = ''; // Initialize contentBody with an empty string
        try {
            // Query ContentDocumentLink to get the ContentDocumentId associated with the parentId
            List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :parentId LIMIT 5000];
            Set<Id> setOfContentDocumentIds = new Set<Id>();
            for (ContentDocumentLink objCD : documentLinks) {
                setOfContentDocumentIds.add(objCD.ContentDocumentId);
            }
            // Query existing notes with the same title for the given parent
            List<ContentNote> existingNotes = [SELECT Id, Title, Content FROM ContentNote WHERE Id IN :setOfContentDocumentIds AND Title = :noteTitle LIMIT 1];
            // If existingNotes is not empty, update contentBody with the content of the first matching note
            if (!existingNotes.isEmpty()) {
                contentBody = existingNotes[0].Content != null ? existingNotes[0].Content.toString() : '';
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error while fetching records: ' + e.getMessage());
        }
        return contentBody;
    }

    @AuraEnabled
    public static String uploadFile(String base64, String filename, String recordId) {
        ContentVersion cv = createContentVersion(base64, filename);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        if (cv == null || cdl == null) { return null; }
        return cdl.Id;
    }

    public static ContentVersion createContentVersion(String base64, String filename) {
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

    public static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
        try {
            if (contentVersionId == null || recordId == null) { 
				return null; 
			}
            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: contentVersionId].ContentDocumentId;
            cdl.LinkedEntityId = recordId;
            // ShareType is either 'V', 'C', or 'I'
            // V = Viewer, C = Collaborator, I = Inferred
            cdl.ShareType = 'V';
            cdl.Visibility = 'AllUsers';
            insert cdl;
            return cdl;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
    }

    @AuraEnabled
    public static List<RSG_Installation_Mapping__mdt> getWalkinRecords(String checklistSection){
        List<RSG_Installation_Mapping__mdt> metaList = [SELECT Serial_Num__c, Question__c,SF_ApiName__c,Sr_Num__c,Checklist_Name__c
                                                        FROM RSG_Installation_Mapping__mdt WHERE Checklist_Name__c =:checklistSection ORDER BY Sr_Num__c ASC];
        System.debug(metaList);
        return metaList;
    }

    @AuraEnabled
    public static List<RSG_Installation_Gen_Checklist__mdt> getGenRecords(String checklistSection){
        List<RSG_Installation_Gen_Checklist__mdt> metaList = [SELECT Question__c,SF_ApiName__c,Sr_Num__c,
                                                        Checklist_Name__c FROM RSG_Installation_Gen_Checklist__mdt WHERE Checklist_Name__c =:checklistSection ORDER BY Sr_Num__c ASC];
        return metaList;
    }

    @AuraEnabled
    public static string updateData(List<map<String, String>> checkboxSelectList, String recId, String status){
        string outputString = '';
        string idValue = '';
        Map<String, String> IdValMap = new Map<String, String>();
        List<String> ObjectFieldApiName = new List<String>();
        // Start Only for comparing Id of LWC to SFDC Database
        List<FieldDefinition> instlAPINames = [Select DeveloperName, QualifiedApiName from FieldDefinition where EntityDefinition.QualifiedApiName = 'Installation__c'];
        List<String> apiNamesList = new List<String>();
        for (FieldDefinition fs :instlAPINames ){
            apiNamesList.add(fs.QualifiedApiName);
        }
        system.debug('fieldDefinition List --->'+ apiNamesList);
        // End for comparing Id of LWC to SFDC Database
        List<Installation__c> instlRec = [SELECT Installation_Status__c,Final_Inspection1__c, Condensing_unit_cooler1__c, Condensing_unit_cooler2__c, Condensing_unit_cooler3__c, Condensing_unit_cooler4__c, Condensing_unit_cooler5__c, Condensing_unit_cooler6__c, Condensing_unit_cooler7__c, Condensing_unit_freezer1__c, Condensing_unit_freezer2__c, Condensing_unit_freezer3__c, Condensing_unit_freezer4__c,
                                          Condensing_unit_freezer5__c, Condensing_unit_freezer6__c, Condensing_unit_freezer7__c, Walkin_Question_Twenty__c, Walkin_Question_Twelve__c, Walkin_Question_Thirteen__c, Walkin_Question_Ten__c, Walkin_Question_Sixteen__c, Walkin_Question_Six__c,
                                          Walkin_Question_Seventeen__c, Walkin_Question_Seven__c, Walkin_Question_Nineteen__c, Walkin_Question_Nine__c, Walkin_Question_Fourteen__c, Walkin_Question_Four__c, Walkin_Question_Five__c, Walkin_Question_Fifteen__c, Walkin_Question_Eleven__c, Walkin_Question_Eighteen__c, Walkin_Question_Eight__c, Walkin_Question_One__c, Walkin_Question_Two__c,  
                                          Walkin_Question_Three__c, Ref_Evaporator_Freezer3__c, Ref_Evaporator_Freezer4__c, Ref_Evaporator_Freezer5__c, Ref_Evaporator_Freezer6__c, Ref_Evaporator_Freezer7__c, Ref_Evaporator_Freezer8__c, Ref_Evaporator_Freezer9__c, Ref_Evaporator_Freezer2__c, Ref_Evaporator_Freezer10__c, Ref_Evaporator_Freezer1__c, Ref_Evaporator_Cooler9__c, Ref_Evaporator_Cooler8__c, Ref_Evaporator_Cooler7__c,
                                          Ref_Evaporator_Cooler6__c, Ref_Evaporator_Cooler5__c, Ref_Evaporator_Cooler10__c, Ref_Evaporator_Cooler1__c, Ref_Evaporator_Cooler3__c, Ref_Evaporator_Cooler4__c, Ref_Evaporator_Cooler2__c FROM Installation__c Where Id=:recId];
        Set<String> lwcNameList = new Set<String>();
        Map<String, Set<String>> idSetOfStr = new Map<String, Set<String>>();
        Set<String> iDsList = new Set<String>();
        Map<String, List<String>> newMap = new Map<String, List<String>>();
        for(map<String, String> checkMap : checkboxSelectList) {
            if(!newMap.containsKey(checkMap.get('Id'))) {
                newMap.put(checkMap.get('Id'), new List<String>());
            }
            newMap.get(checkMap.get('Id')).add(checkMap.get('Name'));
        }
        instlRec[0].Installation_Status__c = status;
        for(String key : newMap.KeySet()) {
            for(string val : newMap.get(key)){
                 outputString = outputString+ val + ';';
            }
            IdValMap.put(key, outputString);
            outputString = '';
        }
        try{
            for(string fieldAPIName : apiNamesList ) {
                if(fieldAPIName == 'Walkin_Question_One__c'){
                    instlRec[0].Walkin_Question_One__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Two__c'){
                    instlRec[0].Walkin_Question_Two__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Three__c'){
                    instlRec[0].Walkin_Question_Three__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Four__c'){
                    instlRec[0].Walkin_Question_Four__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Five__c'){
                    instlRec[0].Walkin_Question_Five__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Six__c'){
                    instlRec[0].Walkin_Question_Six__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Seven__c'){
                    instlRec[0].Walkin_Question_Seven__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Eight__c'){
                    instlRec[0].Walkin_Question_Eight__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Nine__c'){
                    instlRec[0].Walkin_Question_Nine__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Ten__c'){
                    instlRec[0].Walkin_Question_Ten__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Eleven__c'){
                    instlRec[0].Walkin_Question_Eleven__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Twelve__c'){
                    instlRec[0].Walkin_Question_Twelve__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Thirteen__c'){
                    instlRec[0].Walkin_Question_Thirteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Fourteen__c'){
                    instlRec[0].Walkin_Question_Fourteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Fifteen__c'){
                    instlRec[0].Walkin_Question_Fifteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Sixteen__c'){
                    instlRec[0].Walkin_Question_Sixteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Seventeen__c'){
                    instlRec[0].Walkin_Question_Seventeen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Eighteen__c'){
                    instlRec[0].Walkin_Question_Eighteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Nineteen__c'){
                    instlRec[0].Walkin_Question_Nineteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Twenty__c'){
                    instlRec[0].Walkin_Question_Twenty__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler1__c'){
                    instlRec[0].Ref_Evaporator_Cooler1__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler2__c'){
                    instlRec[0].Ref_Evaporator_Cooler2__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler3__c'){
                    instlRec[0].Ref_Evaporator_Cooler3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler4__c'){
                    instlRec[0].Ref_Evaporator_Cooler4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler5__c'){
                    instlRec[0].Ref_Evaporator_Cooler5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler6__c'){
                    instlRec[0].Ref_Evaporator_Cooler6__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler7__c'){
                    instlRec[0].Ref_Evaporator_Cooler7__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler8__c'){
                    instlRec[0].Ref_Evaporator_Cooler8__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler9__c'){
                    instlRec[0].Ref_Evaporator_Cooler9__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler10__c'){
                    instlRec[0].Ref_Evaporator_Cooler10__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer1__c'){
                    instlRec[0].Ref_Evaporator_Freezer1__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer3__c'){
                    instlRec[0].Ref_Evaporator_Freezer3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer2__c'){
                    instlRec[0].Ref_Evaporator_Freezer2__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer4__c'){
                    instlRec[0].Ref_Evaporator_Freezer4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer5__c'){
                    instlRec[0].Ref_Evaporator_Freezer5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer6__c'){
                    instlRec[0].Ref_Evaporator_Freezer6__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer7__c'){
                    instlRec[0].Ref_Evaporator_Freezer7__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer8__c'){
                    instlRec[0].Ref_Evaporator_Freezer8__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer9__c'){
                    instlRec[0].Ref_Evaporator_Freezer9__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer10__c'){
                    instlRec[0].Ref_Evaporator_Freezer10__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer1__c'){
                    instlRec[0].Condensing_unit_freezer1__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer2__c'){
                    instlRec[0].Condensing_unit_freezer2__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer3__c'){
                    instlRec[0].Condensing_unit_freezer3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer4__c'){
                    instlRec[0].Condensing_unit_freezer4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer5__c'){
                    instlRec[0].Condensing_unit_freezer5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer6__c'){
                    instlRec[0].Condensing_unit_freezer6__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer7__c'){
                    instlRec[0].Condensing_unit_freezer7__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler1__c'){
                    instlRec[0].Condensing_unit_cooler1__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler2__c'){
                    instlRec[0].Condensing_unit_cooler2__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler3__c'){
                    instlRec[0].Condensing_unit_cooler3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler4__c'){
                    instlRec[0].Condensing_unit_cooler4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler5__c'){
                    instlRec[0].Condensing_unit_cooler5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler6__c'){
                    instlRec[0].Condensing_unit_cooler6__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler7__c'){
                    instlRec[0].Condensing_unit_cooler7__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection1__c'){
                    instlRec[0].Final_Inspection1__c = IdValMap.get(fieldAPIName);
                }
            }
            update instlRec;
        }
        catch(Exception ex){
        system.debug('exception on lin --->'+ex.getLineNumber()+' %% '+ ex.getMessage());
        }
        return 'Success';
    }

    @AuraEnabled
    public static string updateGenData(List<map<String, String>> checkboxSelectList, String recId, String status){
        System.debug('Selected checkboes'+ checkboxSelectList);
        String Walkin_Genquestion_one = 'Walkin_Genquestion_one__c';
        string outputString = '';
        string idValue = '';
        Map<String, String> IdValMap = new Map<String, String>();
        List<String> ObjectFieldApiName = new List<String>();
        // Start Only for comparing Id of LWC to SFDC Database
        List<FieldDefinition> instlAPINames = [Select DeveloperName, QualifiedApiName from FieldDefinition where EntityDefinition.QualifiedApiName = 'Installation__c'];
        List<String> apiNamesList = new List<String>();
        for (FieldDefinition fs :instlAPINames ){
            apiNamesList.add(fs.QualifiedApiName);
        }
        system.debug('fieldDefinition List --->'+ apiNamesList);
        // End for comparing Id of LWC to SFDC Database
        List<Installation__c> instlRec = [SELECT Installation_Status__c,Condensing_unit_cooler6__c,Condensing_unit_cooler5__c,Condensing_unit_cooler1__c,CondensingUnit_Gencooler3__c,Condensing_unit_cooler4__c,CondensingUnit_Gencooler4__c,Condensing_unit_freezer5__c,
											Condensing_unit_freezer4__c,Condensing_unit_freezer1__c,Condensing_unit_freezer3__c,CondensingUnit_GenFreezer3__c,CondensingUnit_GenFreezer2__c,Ref_Evaporator_Cooler4__c,Evaporator_Cooler5__c,
											Evaporator_Cooler4__c,Ref_Evaporator_Cooler9__c,Walkin_Genquestion_ten__c,Ref_Evaporator_Cooler1__c,Evaporator_Cooler6__c,Ref_Evaporator_Cooler10__c,Evaporator_Cooler3__c,Evaporator_Cooler2__c,
											Ref_Evaporator_Freezer4__c,Evaporator_Freezer5__c,Evaporator_Freezer4__c,Ref_Evaporator_Freezer9__c,Evaporator_Freezer1__c,Evaporator_Freezer6__c,Verify_super_heat_in_the_controller__c,
											Ref_Evaporator_Freezer10__c,Evaporator_Freezer3__c,Evaporator_Freezer2__c,Check_operating_pressure__c,Final_Inspection18__c,Final_Inspection11__c,Final_Inspection15__c,Final_InspectionGen5__c,
											Final_InspectionGen4__c,Is_piping_properly_supported_Vibration__c,Final_InspectionGen9__c,Final_Inspection19__c,Final_InspectionGen7__c,Final_Inspection17__c,Final_InspectionGen6__c,Final_Inspection16__c,Final_Inspection10__c,
											Final_Inspection13__c,Final_InspectionGen3__c,Final_Inspection12__c,Final_Inspection20__c,Final_Inspection25__c,Final_Inspection24__c,Final_Inspection21__c,Final_Inspection27__c,
											Final_Inspection26__c,Final_Inspection23__c,Final_Inspection22__c,Final_InspectionGen2__c,Walkin_Genquestion_eight__c,Walkin_Question_Seventeen__c,Walkin_Question_Five__c,Walkin_Question_Nine__c,
											Walkin_Question_Eleven__c,Walkin_Genquestion_four__c,Walkin_Question_Eight__c,Walkin_Genquestion_nine__c,Walkin_Question_Eighteen__c,Walkin_Genquestion_one__c,Walkin_Genquestion_seven__c,
											Walkin_Question_Sixteen__c,Walkin_Genquestion_six__c,Walkin_Question_Twelve__c,Walkin_Question_Two__c,Walkin_Question_Seven__c,Walkin_GenQuestion_three__c,Walkin_Question_Six__c,Walkin_Question_Nineteen__c,Walkin_Question_Twenty__c,
											Walkin_Genquestion_two__c,Condensing_unit_cooler7__c,Walkin_Question_Ten__c,Walkin_Question_Thirteen__c,Final_InspectionGen_One__c FROM Installation__c Where Id=:recId];
        Set<String> lwcNameList = new Set<String>();
        Map<String, Set<String>> idSetOfStr = new Map<String, Set<String>>();
        Set<String> iDsList = new Set<String>();
        Map<String, List<String>> newMap = new Map<String, List<String>>();
        for(map<String, String> checkMap : checkboxSelectList){
                if(!newMap.containsKey(checkMap.get('Id'))) {
                    newMap.put(checkMap.get('Id'), new List<String>());
                }
                newMap.get(checkMap.get('Id')).add(checkMap.get('Name'));
        }
		system.debug('newMap values --->'+ newMap);
        instlRec[0].Installation_Status__c = status;
        for(String key : newMap.KeySet()){
            for(string val : newMap.get(key)){
                 outputString = outputString+ val + ';';
            }
            IdValMap.put(key, outputString);
            outputString = '';
        }
        system.debug('IdVal Map 111--->'+ IdValMap);
        try{
            for(string fieldAPIName : apiNamesList ) {
                if(fieldAPIName == 'Condensing_unit_cooler6__c'){
                    instlRec[0].Condensing_unit_cooler6__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler5__c'){
                    instlRec[0].Condensing_unit_cooler5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler1__c'){
                    instlRec[0].Condensing_unit_cooler1__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler7__c'){
                    instlRec[0].Condensing_unit_cooler7__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_cooler4__c'){
                    instlRec[0].Condensing_unit_cooler4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'CondensingUnit_Gencooler4__c'){
                    instlRec[0].CondensingUnit_Gencooler4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer5__c'){
                    instlRec[0].Condensing_unit_freezer5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer4__c'){
                    instlRec[0].Condensing_unit_freezer4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer1__c'){
                    instlRec[0].Condensing_unit_freezer1__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Condensing_unit_freezer3__c'){
                    instlRec[0].Condensing_unit_freezer3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'CondensingUnit_GenFreezer3__c'){
                    instlRec[0].CondensingUnit_GenFreezer3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'CondensingUnit_GenFreezer2__c'){
                    instlRec[0].CondensingUnit_GenFreezer2__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler4__c'){
                    instlRec[0].Ref_Evaporator_Cooler4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Cooler5__c'){
                    instlRec[0].Evaporator_Cooler5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Cooler4__c'){
                    instlRec[0].Evaporator_Cooler4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler9__c'){
                    instlRec[0].Ref_Evaporator_Cooler9__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Genquestion_ten__c'){
                    instlRec[0].Walkin_Genquestion_ten__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler1__c'){
                    instlRec[0].Ref_Evaporator_Cooler1__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Cooler6__c'){
                    instlRec[0].Evaporator_Cooler6__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Cooler10__c'){
                    instlRec[0].Ref_Evaporator_Cooler10__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Cooler3__c'){
                    instlRec[0].Evaporator_Cooler3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Cooler2__c'){
                    instlRec[0].Evaporator_Cooler2__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer4__c'){
                    instlRec[0].Ref_Evaporator_Freezer4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Freezer5__c'){
                    instlRec[0].Evaporator_Freezer5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Freezer4__c'){
                    instlRec[0].Evaporator_Freezer4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Ref_Evaporator_Freezer9__c'){
                    instlRec[0].Ref_Evaporator_Freezer9__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Freezer1__c'){
                    instlRec[0].Evaporator_Freezer1__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Freezer6__c'){
                    instlRec[0].Evaporator_Freezer6__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Verify_super_heat_in_the_controller__c'){
                    instlRec[0].Verify_super_heat_in_the_controller__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Freezer3__c'){
                    instlRec[0].Evaporator_Freezer3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Evaporator_Freezer2__c'){
                    instlRec[0].Evaporator_Freezer2__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Check_operating_pressure__c'){
                    instlRec[0].Check_operating_pressure__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection18__c'){
                    instlRec[0].Final_Inspection18__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection11__c'){
                    instlRec[0].Final_Inspection11__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection15__c'){
                    instlRec[0].Final_Inspection15__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_InspectionGen5__c'){
                    instlRec[0].Final_InspectionGen5__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_InspectionGen4__c'){
                    instlRec[0].Final_InspectionGen4__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Is_piping_properly_supported_Vibration__c'){
                    instlRec[0].Is_piping_properly_supported_Vibration__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_InspectionGen9__c'){
                    instlRec[0].Final_InspectionGen9__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection19__c'){
                    instlRec[0].Final_Inspection19__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_InspectionGen_One__c'){
                    instlRec[0].Final_InspectionGen_One__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_InspectionGen7__c'){
                    instlRec[0].Final_InspectionGen7__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection17__c'){
                    instlRec[0].Final_Inspection17__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_InspectionGen6__c'){
                    instlRec[0].Final_InspectionGen6__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection16__c'){
                    instlRec[0].Final_Inspection16__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection10__c'){
                    instlRec[0].Final_Inspection10__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection13__c'){
                    instlRec[0].Final_Inspection13__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_InspectionGen3__c'){
                    instlRec[0].Final_InspectionGen3__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection12__c'){
                    instlRec[0].Final_Inspection12__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection20__c'){
                    instlRec[0].Final_Inspection20__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection25__c'){
                    instlRec[0].Final_Inspection25__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection24__c'){
                    instlRec[0].Final_Inspection24__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection21__c'){
                    instlRec[0].Final_Inspection21__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection27__c'){
                    instlRec[0].Final_Inspection27__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection26__c'){
                    instlRec[0].Final_Inspection26__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection23__c'){
                    instlRec[0].Final_Inspection23__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_Inspection22__c'){
                    instlRec[0].Final_Inspection22__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Final_InspectionGen2__c'){
                    instlRec[0].Final_InspectionGen2__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Genquestion_eight__c'){
                    instlRec[0].Walkin_Genquestion_eight__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Seventeen__c'){
                    instlRec[0].Walkin_Question_Seventeen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Five__c'){
                    instlRec[0].Walkin_Question_Five__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Eleven__c'){
                    instlRec[0].Walkin_Question_Eleven__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Ten__c'){
                    instlRec[0].Walkin_Question_Ten__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Eight__c'){
                    instlRec[0].Walkin_Question_Eight__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Genquestion_nine__c'){
                    instlRec[0].Walkin_Genquestion_nine__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Eighteen__c'){
                    instlRec[0].Walkin_Question_Eighteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Genquestion_one__c'){
                    instlRec[0].Walkin_Genquestion_one__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Sixteen__c'){
                    instlRec[0].Walkin_Question_Sixteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Thirteen__c'){
                    instlRec[0].Walkin_Question_Thirteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Twelve__c'){
                    instlRec[0].Walkin_Question_Twelve__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Two__c'){
                    instlRec[0].Walkin_Question_Two__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Seven__c'){
                    instlRec[0].Walkin_Question_Seven__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_GenQuestion_three__c'){
                    instlRec[0].Walkin_GenQuestion_three__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Six__c'){
                    instlRec[0].Walkin_Question_Six__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Nineteen__c'){
                    instlRec[0].Walkin_Question_Nineteen__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Question_Twenty__c'){
                    instlRec[0].Walkin_Question_Twenty__c = IdValMap.get(fieldAPIName);
                } else if(fieldAPIName == 'Walkin_Genquestion_two__c'){
                    instlRec[0].Walkin_Genquestion_two__c = IdValMap.get(fieldAPIName);
                }
            }
            update instlRec;
        }
        catch(Exception ex){
            system.debug('exception on lin --->'+ex.getLineNumber()+' %% '+ ex.getMessage());
        }
        system.debug('instlRec 1213213 --->'+instlRec[0]);
        return 'Success';
    }
}
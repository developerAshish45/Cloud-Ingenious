public without sharing class IntallerWelcome {

     @AuraEnabled(cacheable = true)
     public static Installation__c getInstallationRecord(Id recId){
         System.debug('Received recordId: ' + recId);
         List<Installation__c> refList =[SELECT id, Site_Number__c,Installer_Name__c, Installer_Name__r.Name, Project_Name__c,Project_Name__r.Name, Project_Name__r.Customer_Name__r.Name, Site_Address__City__s, Site_Address__CountryCode__s, 
                                         Site_Address__Street__s,Project_Name__r.Install_SO__c,Site_Address__PostalCode__s, Site_Address__StateCode__s,Installation_Status__c, Project_Name__r.Opportunity__r.Installation_Date__c, 
                                         Project_Name__r.Installation_Date__c FROM Installation__c WHERE Id = :recId LIMIT 1];
         if(refList.size()>0){
         	return refList[0];
         }
         else{
             system.debug('list size is zero');
         }
        return null;
     }

    @AuraEnabled(cacheable = true)
    public static Account welcomeMessage(Id recId){
        List<Account> refList =[SELECT Id, Name, Is_Maintainance__c FROM Account WHERE Id = :recId LIMIT 1];
        if(refList.size()>0) {
        	return refList[0];
        }
        else{
            system.debug('list size is zero');
        }
       return null;
    }
}
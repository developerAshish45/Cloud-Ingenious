public without sharing class InstallerSiteDataTableController {
    @AuraEnabled(cacheable = true)
    public static List<Installation__c> getData(id instaId, Integer selectedValue) {
       	if(selectedValue == 0) {
            List<Installation__c> installedSites = [Select Id, Installer_Name__r.Id, Installation_Status__c, Project_Name__c, Project_Name__r.Name, Project_Name__r.Site_Number__c,Project_Name__r.Customer_Name__r.Name,Project_Name__r.Installation_Type__c from Installation__c where 
            Installer_Name__c= :instaId AND (Installation_Status__c = 'Open' OR Installation_Status__c = 'In Progress')];
            if(installedSites.size()>0){
                system.debug('list is'+ installedSites);
                return installedSites;
            } else {
                system.debug('list size is zero');
            }
        } else {
            List<Installation__c> installedSites = [Select Id, Installer_Name__r.Id, Installation_Status__c, Project_Name__c, Project_Name__r.Name, Project_Name__r.Site_Number__c,Project_Name__r.Customer_Name__r.Name,Project_Name__r.Installation_Type__c from Installation__c where 
            Installer_Name__c= :instaId AND (Installation_Status__c = 'Open' OR Installation_Status__c = 'In Progress') limit : selectedValue];
            if(installedSites.size()>0){
                system.debug('list is'+ installedSites);
                return installedSites;
            } else {
                system.debug('list size is zero');
            }
    }
        return null;
    }
    
        @AuraEnabled(cacheable = true)
    public static List<Installation__c> getSubmittedData(id instaId, Integer selectedValue) {
        if(selectedValue == 0){
            List<Installation__c> installedSites = [Select Id, Installer_Name__r.Id, Installation_Status__c, Project_Name__c, Project_Name__r.Name, Project_Name__r.Site_Number__c,Project_Name__r.Customer_Name__r.Name,Project_Name__r.Installation_Type__c from Installation__c where 
            Installer_Name__c= :instaId AND (Installation_Status__c = 'Submitted' OR Installation_Status__c = 'Completed')];
            if(installedSites.size()>0){
                system.debug('list is'+ installedSites);
                return installedSites;
            } else {
                system.debug('list size is zero');
            }
        }else if(selectedValue!=0){
            List<Installation__c> installedSites = [Select Id, Installer_Name__r.Id, Installation_Status__c, Project_Name__c, Project_Name__r.Name, Project_Name__r.Site_Number__c,Project_Name__r.Customer_Name__r.Name,Project_Name__r.Installation_Type__c from Installation__c where 
            Installer_Name__c= :instaId AND (Installation_Status__c = 'Submitted' OR Installation_Status__c = 'Completed') limit : selectedValue];
            if(installedSites.size()>0){
                system.debug('list is'+ installedSites);
                return installedSites;
            } else {
                system.debug('list size is zero');
            }
        }
           return null;
    }
}
public class ProjectTriggerHandler {
    public static void createRelatedInstall(List<Project__c> proList){
        List<Installation__c> installList = new List<Installation__c>();
        set<id> projectId = new set<Id>();
        for(Project__c pro : proList) {
            projectId.add(pro.Id);
        }
        List<Installation__c> installationList = [SELECT Id, Project_Name__c FROM Installation__c where Project_Name__c In: projectId];
        for(Project__c pro : proList) {
            if (pro.Installer_Name__c != null && installationList.size() == 0) {
                Installation__c install = new Installation__c();
                install.Installer_Name__c = pro.Installer_Name__c;
                install.Project_Name__c = pro.Id;
                install.Site_Number__c = pro.Site_Number__c;
                install.Site_Address__Street__s = pro.Site_Address__Street__s;
                install.Site_Address__City__s = pro.Site_Address__City__s;
                install.Site_Address__CountryCode__s = pro.Site_Address__CountryCode__s;
                install.Site_Address__PostalCode__s = pro.Site_Address__PostalCode__s;
                install.Site_Address__StateCode__s = pro.Site_Address__StateCode__s;
                installList.add(install);
            }
        }
        if(!installList.isEmpty()){
            insert installList;
        }
    }
}
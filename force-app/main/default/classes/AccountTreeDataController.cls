public with sharing class AccountTreeDataController {

  @AuraEnabled()
  public static List<Map<String, Object>> getAccountsHierarchy(Id recordId) {
      List<Map<String, Object>> hierarchyList = new List<Map<String, Object>>();

      // Fetch the provided account record and its child accounts recursively
      fetchAccountAndChildren(recordId, hierarchyList, 0);

      return hierarchyList;
  }

  private static void fetchAccountAndChildren(Id accountId, List<Map<String, Object>> hierarchyList, Integer level) {
    // Query the account record and its child accounts
    List<Account> accounts = [SELECT Id, Name, ParentId, Parent.Name, RecordType.Name, Associated_Dealer__c, Associated_Dealer__r.Name, Associated_Consultant__c, Associated_Consultant__r.Name, Associated_Corporate_Chain__c,
     Associated_Corporate_Chain__r.Name, Buying_Group__c, Buying_Group__r.Name, Dealer__c, Dealer__r.Name,   
     End_User_Account__c, End_User_Account__r.Name, Rep_Group__c, Rep_Group__r.Name, RSM_REP__c, RSM_REP__r.Name, Sales_Rep_2__c, Sales_Rep_2__r.Name
     FROM Account WHERE Id = :accountId];

    Map<String, Object> node = new Map<String, Object>();

    if(accounts.size() >0 ){
        Account acc = accounts[0];
        node.put('key', acc.Name);
        node.put('heading', acc.RecordType.Name);
        hierarchyList.add(node);

        if(acc.ParentId != null){
            node = new Map<String, Object>();
            node.put('key',  acc.Parent.Name);
            node.put('parent',  acc.Name);
            node.put('col', '#FFD700'); 
            node.put('heading', 'Customer Group');
            hierarchyList.add(node);
        }

        if(acc.Associated_Dealer__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.Associated_Dealer__r.Name);
            node.put('parent',  acc.Name);
            node.put('col', '#F48FB1'); // pinkgrad
            node.put('heading', 'Ass. Dealer');
            hierarchyList.add(node);
        }

        if(acc.Associated_Consultant__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.Associated_Consultant__r.Name);
            node.put('parent',  acc.Name);
            node.put('heading', 'Consultant');
            node.put('col', 'orange'); 
            hierarchyList.add(node);
        }

        if(acc.Associated_Corporate_Chain__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.Associated_Corporate_Chain__r.Name);
            node.put('parent',  acc.Name);
            node.put('col', 'green'); 
            node.put('heading', 'Corporate Chain');
            hierarchyList.add(node);
        }

        if(acc.Buying_Group__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.Buying_Group__r.Name);
            node.put('parent',  acc.Name);
            node.put('col', 'red'); 
            node.put('heading', 'Buying Group');
            hierarchyList.add(node);
        }

        if(acc.Dealer__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.Dealer__r.Name);
            node.put('parent',  acc.Name);
            node.put('col', '#90CAF9'); //bluegrad
            node.put('heading', 'Dealer');
            hierarchyList.add(node);
        }

        if(acc.End_User_Account__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.End_User_Account__r.Name);
            node.put('parent',  acc.Name);
            node.put('col', '#98FB98'); 
            node.put('heading', 'End User');
            hierarchyList.add(node);
        }
        if(acc.Rep_Group__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.Rep_Group__r.Name);
            node.put('parent',  acc.Name);
            node.put('col', '#FF6347'); 
            node.put('heading', 'Rep Group');
            hierarchyList.add(node);
        }
        if(acc.RSM_REP__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.RSM_REP__r.Name);
            node.put('parent',  acc.Name);
            node.put('col', '#9400D3'); 
            node.put('heading', 'Sales Rep 1');
            hierarchyList.add(node);
        }
        
        if(acc.Sales_Rep_2__c != null){
            node = new Map<String, Object>();
            node.put('key',  acc.Sales_Rep_2__r.Name);
            node.put('parent',  acc.Name);
            node.put('col', '#00CED1'); 
            node.put('heading', 'Sales Rep 2');
            hierarchyList.add(node);
        }
        
        
    }
}

  /*
  private static void fetchAccountAndChildren(Id accountId, List<Map<String, Object>> hierarchyList, Integer level) {
      // Query the account record and its child accounts
      List<Account> accounts = [SELECT Id, Name, ParentId, Parent.Name, (SELECT Id, Name FROM ChildAccounts) FROM Account WHERE Id = :accountId];

      // Process the queried accounts
      for (Account acc : accounts) {
          // Add the current account as a node
          Map<String, Object> node = new Map<String, Object>();
          node.put('key', acc.Name);
          node.put('parent', acc.ParentId != null ? acc.Parent.Name : '');

          // Additional properties if needed
          // node.put('text', acc.Name);
          // node.put('parentName', acc.Parent != null ? acc.Parent.Name : null);

          hierarchyList.add(node);

          // Process child accounts recursively
          if (level < 5 && acc.ChildAccounts != null && !acc.ChildAccounts.isEmpty()) {
              for (Account child : acc.ChildAccounts) {
                  fetchAccountAndChildren(child.Id, hierarchyList, level + 1);
              }
          }
      }
  }
  */
}
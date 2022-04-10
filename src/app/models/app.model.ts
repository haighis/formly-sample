export class Application {
    name: string;
    navigationItems: Array<HierNavigationItem>;
    navigationItemsHierarchy: Array<HierNavigationItem>;
    forms: Array<ObjectEntry>;
    tableViews: Array<ObjectEntry>;
    allObjects: Array<ObjectEntry>;
    allObjectsHierarchy: Array<HierNavigationItem>;
  }

  export class Schema {
    schema: string;
    id: string;
    title: string;
    parent: string;
    type: string;
    uischema: string;
  }

 export enum ObjectEnum {
    APPLICATION = "APPLICATION",
    AREA = "AREA",
    SECTION = "SECTION",
    PAGE = "PAGE",
    FORM = "FORM",
    CONNECTIONSTRING = "CONNECTIONSTRING",
    //. Table? do we want to have all the actual tables in the system?
    DATAVIEW = "DATAVIEW" // table data
  }

  export class ObjectEntry
  {
    constructor(public id: string, public title: string, public parent: string, public objectType: ObjectEnum) { //public children: any[]= null
    }
  }

  export class Navigation
  {
     constructor(public id: string, public title: string, public parent: string, public children?: any[]) {}
  }

  export class HierNavigationItem extends ObjectEntry
  {
     constructor(public id: string, public objectType: ObjectEnum, public title: string, public parent: string, public children?: any[]) {
       super(id, title, parent, objectType);
     }
  }

  export class Schemaable extends ObjectEntry {
    // schema: string;
    // uischema: string;
    constructor(public schema: string, public id: string, public title: string, public parent: string, public objectType: ObjectEnum) {
      super(id, title, parent, objectType);
    }
  }

  export class Form extends Schemaable {
    constructor(public schema: string, public id: string, public title: string, public parent: string, public objectType: ObjectEnum) {
      super(schema, id, title, parent, objectType)
    }
    // here we need to figure out our story for having data driven forms.
    // we need a table and the table needs a dataview (query result)
    //schema: string;

    // Server side events
    //events: Array<ObjectEntry>;

    // form controls - array of controls - pull out the controls from schema to create an array of controls
    // dataviews  - array of data views - arrays of query results
    
  }

  /**
   * 
   * App
   * collection tables/data
   * collection of forms
   * collection of navigation
   * -- a collection areas, 
   * -- each area has a collection of sections
   * -- each section has a collection of pages
   */

  
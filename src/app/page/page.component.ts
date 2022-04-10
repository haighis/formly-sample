/**
 * Page - A page is the central point into a Mango Application.
 * A page will:
 * - Output all hierarchical navigation items (navigationItemsHierarchy: Array<HierNavigationItem>;) in a hierarchy control of navigation items. - later
 * -- make the href go to the page route passing the id of the page. have a variable called currentPageId that is set with each click - done
 * - Output all navigation items in a breadcrumb control - done
 * - Output form for the current page (for now just one form per page) using currentPageId this determines which form is associated to the current page. - done
 * - Output all forms for the current page. Pass the data to all forms. using currentPageId this determines which forms are associated to the current page. - future
 * 
 * Form 
 * - we need a way to get data into the form controls. 
 * - A form may have a list (a list is data driven with a list of items) so we need a way to get the dataviews data to a list/
 * - we need a way to associate the application data views with controls
 */
import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from '@angular/forms'
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core'
// import {
//     DynamicFormService,
//     DynamicFormControlEvent,
//     DynamicFormControlModel,
//     DynamicFormLayout,
//     DynamicInputModel
// } from "@ng-dynamic-forms/core";
import {MenuItem} from 'primeng/api';
//import {CardModule} from 'primeng/card';
// import { PAGE_MODEL } from "./page.model";
// import { PAGE_LAYOUT } from "./page.layout";
//import { DynamicNGBootstrapFormComponent } from "@ng-dynamic-forms/ui-ng-bootstrap";
import {ActivatedRoute, Router} from '@angular/router';
import { Application, Form, Navigation, HierNavigationItem, ObjectEntry, ObjectEnum, Schema } from "../models/app.model";
import { PlatformService } from "../services/platform.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
@Component({
    selector: "page",
    styleUrls: [],
    templateUrl: "./page.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PageComponent {
    //formModel: DynamicFormControlModel[] = PAGE_MODEL;
    title = 'Page Component'
    form: FormGroup;
    options: FormlyFormOptions = {};
    model: any;
    fields: FormlyFieldConfig[];

 //   formLayout: DynamicFormLayout = NG_BOOTSTRAP_SAMPLE_FORM_LAYOUT; - future
    //formGroup = this.formService.createFormGroup(this.formModel);   
    
    showEmptyState: boolean = false;
    currentPageId: string = null;
    app: Application;
    //form: Form;
    schemas: Observable<Schema[]>;
    items: MenuItem[] = [];    
    //items: HierNavigationItem[] = [];
    //@ViewChild(DynamicNGBootstrapFormComponent) formComponent!: DynamicNGBootstrapFormComponent;

    constructor(        
        //private formService: DynamicFormService,
        private platformService: PlatformService,
        private _activatedRoute: ActivatedRoute, private _router: Router) 
        {
            _router.routerState.root.queryParams.subscribe(data => 
            {
                //this.currentPageId = data['pageId'];
                console.log('queryParams', data['pageId'], this.currentPageId)
                this.setForm(data['pageId'])
            }
            );
            this._activatedRoute.params.subscribe(params => {
            //console.log('params', params, this.currentPageId);
            });
            // Set the page form to empty. This will be set later in ng on init
            // //this.formModel = null;      
            // let fields: FormlyFieldConfig[] = [
            //     {
            //       "key": "lastName",
            //       "type": "input",
            //       "templateOptions": {
            //         "label": "Last Name"
            //       }
            //     },
            // ];

            // this.form = new FormGroup({});
            // this.model = {
            // "firstName": "Joan",
            // "lastName": "of Arc"
            // };
            // this.fields = fields;
            // this.app = app;
        
        }

        setForm(pageId: string) {
            this.form = new FormGroup({});
            const navigationItems: Navigation[] = [];
            const navigationItemsRaw: Navigation[] = [];
            var app: Application;
            app = new Application()
            const _this = this;
            this.platformService.getSchemas().subscribe(items => {
                let apps = items.filter(o => o.type == 'APPLICATION') as Schema[];
                let forms = items.filter(o => o.type == 'FORM').map(a => new Form(a.schema, a.id, a.title, a.parent, ObjectEnum[a.type])) as Form[];
                
                let flatNavigationItems =  items.filter(o => 
                    o.type == 'AREA' || 
                    o.type == 'PAGE' || 
                    o.type == 'SECTION')
                    .map(a => new ObjectEntry(a.id, a.title, a.parent, ObjectEnum[a.type])) as ObjectEntry[];    
                // Sort navigation items by id
                app.navigationItems = flatNavigationItems.sort( (a, b)=> (a.id > b.id) ? 1 : -1 );
                
                app.name = apps.map(a => a.title)[0];
                app.forms = forms;
                
                let allObjectsHeir = items.map(a => new HierNavigationItem(a.id, ObjectEnum[a.type], a.title, a.parent)) as ObjectEntry[];
                app.allObjects = items.map(a => new ObjectEntry(a.id, a.title, a.parent, ObjectEnum[a.type])) as ObjectEntry[];

                let flat3: HierNavigationItem[] = this.transformToNavigation(allObjectsHeir);    
                
                let hierObjects = this.buildNavigationHierarchy(flat3) as HierNavigationItem[];
                
                app.allObjectsHierarchy  = hierObjects;

                // TODO bring primeng dependancy
                //Create breadcrumb navigation using PrimeNG Breadcrumb control
                let newItems: MenuItem[] = [];                
                for(let item of app.navigationItems ) {
                    newItems.push( 
                        { 
                            label: item.title,
                            routerLink: ['/page'],
                            queryParams: { 'pageId': item.id}
                        } )
                }
                this.items = newItems;
                // Form for page
                // Assign a single form for the current page
                
                let formPage = app.forms.filter(f => f.parent == pageId)[0] as Form;
                console.log(' form ', formPage, ' app ', app)               
                if(formPage == null)
                {                    
                    console.log('formPage is null')
                    // Display empty state control
                    this.showEmptyState = true;
                    this.fields = null;
                    return;
                } 
                
                console.log('formPage ', formPage)
                let fields: FormlyFieldConfig[] = [
                    {
                    "key": "lastName",
                    "type": "input",
                    "templateOptions": {
                        "label": "Last Name"
                    }
                    },
                ];
    
                this.form = new FormGroup({});      
                let obj: FormlyFieldConfig[] = [JSON.parse(formPage.schema)];
                console.log('obj ', obj)
                this.fields = obj;
            });
        }

        mapFields(fields: FormlyFieldConfig[]) {
            return fields.map(f => {
              // Bind an observable to `color` field.
             
              return f;
            });
          }

        onSubmit() {
            if (this.form.valid) {
        //   this.http.post('url', this.model, null).subscribe((response) => {
        //     console.log('response:', response)
        //   }, (error) => {
        //     console.error('error:', error)
        //   })
        }
      }    

    ngOnInit() {
        // this.app = app;
        // const navigationItems: Navigation[] = [];
        // const navigationItemsRaw: Navigation[] = [];
        // var app: Application;
        // app = new Application()
        // const _this = this;
        // this.platformService.getSchemas().subscribe(items => {
        //     let apps = items.filter(o => o.type == 'APPLICATION') as Schema[];
        //     let forms = items.filter(o => o.type == 'FORM').map(a => new Form(a.schema, a.id, a.title, a.parent, ObjectEnum[a.type])) as Form[];
             
        //     let flatNavigationItems =  items.filter(o => 
        //         o.type == 'AREA' || 
        //         o.type == 'PAGE' || 
        //         o.type == 'SECTION')
        //         .map(a => new ObjectEntry(a.id, a.title, a.parent, ObjectEnum[a.type])) as ObjectEntry[];    
        //     // Sort navigation items by id
        //     app.navigationItems = flatNavigationItems.sort( (a, b)=> (a.id > b.id) ? 1 : -1 );
             
        //     app.name = apps.map(a => a.title)[0];
        //     app.forms = forms;
            
        //     let allObjectsHeir = items.map(a => new HierNavigationItem(a.id, ObjectEnum[a.type], a.title, a.parent)) as ObjectEntry[];
        //     app.allObjects = items.map(a => new ObjectEntry(a.id, a.title, a.parent, ObjectEnum[a.type])) as ObjectEntry[];

        //     let flat3: HierNavigationItem[] = this.transformToNavigation(allObjectsHeir);    
            
        //     let hierObjects = this.buildNavigationHierarchy(flat3) as HierNavigationItem[];
            
        //     app.allObjectsHierarchy  = hierObjects;

        //     // TODO bring primeng dependancy
        //     //Create breadcrumb navigation using PrimeNG Breadcrumb control
        //     let newItems: MenuItem[] = [];                
        //     for(let item of app.navigationItems ) {
        //         newItems.push( 
        //             { 
        //                 label: item.title,
        //                 routerLink: ['/page'],
        //                 queryParams: { 'pageId': item.id}
        //             } )
        //     }
        //     this.items = newItems;
        //     //let newItems: string[] = [];                
        //     // for(let item of app.navigationItems ) {
        //     //     newItems.push( 
        //     //         item.
        //     //         // { 
        //     //         //     label: item.title,
        //     //         //     routerLink: ['/page'],
        //     //         //     queryParams: { 'pageId': item.id}
        //     //         // } 
                    
        //     //         )
        //     // }
        //      //this.items = app.navigationItems;
        //         // END TODO 

        //     // Form for page
        //     // Assign a single form for the current page
        //     if(this.currentPageId != undefined) {
        //         let formPage = app.forms.filter(f => f.parent == this.currentPageId)[0] as Form;
        //         console.log(' form ', formPage)               
        //         if(formPage == undefined)
        //         {                    
        //             // Display empty state control
        //             this.showEmptyState = true;
        //             return;
        //         } 
                
        //         console.log('formPage ', formPage)
        //         let fields: FormlyFieldConfig[] = [
        //             {
        //               "key": "lastName",
        //               "type": "input",
        //               "templateOptions": {
        //                 "label": "Last Name"
        //               }
        //             },
        //         ];
    
        //         // this.form = new FormGroup({});
        //         // this.model = {
        //         // "firstName": "Joan",
        //         // "lastName": "of Arc"
        //         // };
        //         // this.fields = fields;
        //         // Assign the pages form schema value to Form Model
        //         // TODO  this.formModel = this.formService.fromJSON(formPage.schema);                                      
        //     }
        //});

        // this.schemas = this.platformService.getSchemas()
        // .pipe(map((data) => data));

        // const results = this.schemas.subscribe(val =>       console.log( 'schema ', val));
        
        //console.log( this.schemas )
    }

    transformToNavigation(nav: any[]) {
        let flats: HierNavigationItem[] = [];

        nav.forEach(element => {
            if(!element.parent) {
                element.parent = '';
            }
            var item = new HierNavigationItem(element.id.toString(), element.objectType, element.title, element.parent)
            flats.push(item)
        }); 
        return flats;
    }

    buildNavigationHierarchy(navitems: HierNavigationItem[]) {
        const root3 = [];
        navitems.forEach(node => {
            // No parent means top level
            if (node.parent == '' ) 
                return root3.push(node);
            // Insert node as child of parent in flat array
            const parentIndex = navitems.findIndex(el => el.id === node.parent);
            if (!navitems[parentIndex].children) {
              return navitems[parentIndex].children = [node];
            }
            navitems[parentIndex].children.push(node);
          });

       return root3;
    }
    formModelDataStore: string = '';

    output_datastore() {
        console.log('data store contents ', this.formModelDataStore)
    }

    output_formmodel() {
        //console.log('form model contents ', this.formModel)
    }

    store() {
        
            // console.log(' in store ', this.formModel)
            // let json: string = JSON.stringify(this.formModel);
            // this.formModelDataStore = json;
            // console.log(' jsonData ', json);
            // this.formModel = null;
            // let json: string = JSON.stringify(this.formModel);
            // console.log('json ', json)
            // ...store JSON in localStorage or transfer to server
        
    }

    restore() {

        // ...load JSON from localStorage or server
        console.log(' in restoreß')
        //this.formModel = this.formService.fromJSON(this.formModelDataStore);
    }
}

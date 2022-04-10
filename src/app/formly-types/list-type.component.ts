import { Component } from '@angular/core';
import { FieldArrayType, FieldType } from '@ngx-formly/core';
@Component({
  selector: 'mango-list',
  templateUrl: './list.type.component.html',
})
export class ListTypeComponent extends FieldArrayType //FieldType 
{
    // we need a model that contains the data
    items: string[] = []; 
    // constructor( ) {
            
    // }

        ngOnInit() {

            // this.field.templateOptions.options.forEach((ele: any) => {
            //     console.log('el ', ele)
            //     this.items.push(ele.label)
            // });

            // arraySparse.forEach((element) => {
            //     console.log({ element });
            //     numCallbackRuns++;
            //   });

            //let that: ListTypeComponent = this;
            console.log(' in init 1 ', this.field)
            // if(this.options) {
            //     console.log(' in init2 ', this)
            // }
            
            
            //this.i
            //this.refreshOptions();
        }
        // TODO 
        // refreshOptions() {
        //     // let config: DataViewConfiguration = new DataViewConfiguration();
        //     // config.dataViewColumns = ['title'];
        //     // config.dataViewTable = 'schemas';
        //     console.log('in refresh ', this.model)
        //     this.rows = this.readService.getDataViews('schemas',['title'])
        //         .pipe(map((data) => data.dataViews[0].rows));
        //         const results2 = this.rows.subscribe(val => console.log( 'dataview ', val));
        // }  

   // schemas: Observable<Schema[]>;
    //dataViewResponse: Observable<DataViewResponse>;
    //rows: Observable<string[]>;
}
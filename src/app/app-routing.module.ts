import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { SampleJsonComponent } from './sample-json/sample-json.component';
import { SampleModelComponent } from './sample-model/sample-model.component';

const APP_ROUTES: Routes = [
 
  {
      path: "sample-json",
      component: SampleJsonComponent        
  },
  {
    path: "sample-model",
      component: SampleModelComponent        
  }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)], //, {relativeLinkResolution: "legacy"}
  exports: [RouterModule]
})

export class AppRoutingModule { }

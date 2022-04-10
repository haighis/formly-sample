import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Application, ObjectEntry, ObjectEnum, Schema, Form } from '../models/app.model'; // , ArticleListConfig
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
//@Injectable()
export class PlatformService {
  constructor (
    private apiService: ApiService
  ) {}


//   getAll(): Observable<[string]> {
//     return this.apiService.get('/tags')
//           .pipe(map(data => data.tags));
//   }

// }
    getSchemas(): Observable<Schema[]> {
      let items = this.apiService.get('/schemas').pipe
    (
      map((res: any)  => {
        res = res
        return res;
      } 
      ));

      items.subscribe(items => {
        return items as Schema[];
        console.log(' in get schemas ', items)
      });
      
      return items;
    }

  //   getApplication(): Application {
  //     var app: Application;
  //     app = new Application()
  //     this.getSchemas().subscribe(items => {
  //       let apps = items.filter(o => o.type == 'APPLICATION') as Schema[];
  //       //var color : Color = Color[green];
  //       let forms = items.filter(o => o.type == 'FORM').map(a => new Form(a.schema, a.title, a.parent, ObjectEnum[a.type])) as ObjectEntry[];
  //       app.navigationItems = items.filter(o => 
  //           o.type == 'AREA' || 
  //           o.type == 'PAGE' || 
  //           o.type == 'SECTION')
  //           .map(a => new ObjectEntry(a.title, a.parent, ObjectEnum[a.type])) as ObjectEntry[];
  //       app.name = apps.map(a => a.title)[0];
  //       app.forms = forms;
  //       app.allObjects = items.map(a => new ObjectEntry(a.title, a.parent, ObjectEnum[a.type])) as ObjectEntry[];
  //     });
  //     console.log(' app ', app)
  //     return app;
  // }

  // get(slug): Observable<Article> {
  //   return this.apiService.get('/articles/' + slug)
  //     .pipe(map(data => data.article));
  // }

  // destroy(slug) {
  //   return this.apiService.delete('/articles/' + slug);
  // }

  // save(article): Observable<Article> {
  //   // If we're updating an existing article
  //   if (article.slug) {
  //     return this.apiService.put('/articles/' + article.slug, {article: article})
  //       .pipe(map(data => data.article));

  //   // Otherwise, create a new article
  //   } else {
  //     return this.apiService.post('/articles/', {article: article})
  //       .pipe(map(data => data.article));
  //   }
  // }

  // favorite(slug): Observable<Article> {
  //   return this.apiService.post('/articles/' + slug + '/favorite');
  // }

  // unfavorite(slug): Observable<Article> {
  //   return this.apiService.delete('/articles/' + slug + '/favorite');
  // }
}

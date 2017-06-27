import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'data'
})
export class DataPipe implements PipeTransform {

  	transform(value: any, args: any[] = null): any {

        return Object.keys(value).map((key) => {
            let pair = {};
            let k = 'key';
            let v = 'value'

            pair[k] = key;
            pair[v] = value[key];
            //console.log('Processing..', value[key]);
            return pair;
        });
    }

}

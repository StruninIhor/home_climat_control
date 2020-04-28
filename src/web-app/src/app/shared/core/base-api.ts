import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class BaseApi {

    private baseUrl = environment.api.baseUrl;
    constructor(
        protected http: HttpClient,
    ) {}

    protected get<T>(url: string = '', httpParams: HttpParams = null): Observable<T> {
        return this.http.get<T>(this.getUrl(url), {params: httpParams})
            .pipe(
                map((response: any) => response)
            );
    }

    protected post<T>(url: string = '', data: any = {}): Observable<T> {
        return this.http.post<T>(this.getUrl(url), data)
            .pipe(
                map((response: any) => response)
            );
    }

    protected put<T>(url: string = '', data: any = {}): Observable<T> {
        return this.http.put<T>(this.getUrl(url), data)
            .pipe(
                map((response: any) => response)
            );
    }

    protected delete<T>(url: string = '', data: any = {}): Observable<T> {
        return this.http.delete<T>(this.getUrl(url), data)
            .pipe(
                map((response: any) => response)
            );
    }

    private getUrl(url: string = ''): string {
        return this.baseUrl + url;
    }
}

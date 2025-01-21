import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {
                Authorization: 'Basic YWRtaW46MTIxMg=='
                //Authorization: 'Basic YWRtaW46SW51SXR6YWwyMTQu'
            }
        });

        return next.handle(request);
    }
}
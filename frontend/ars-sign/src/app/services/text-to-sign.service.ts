import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../api-config';

@Injectable({
    providedIn: 'root'
})
export class TextToSignService {
    private http = inject(HttpClient);

    textToSign(text: string): Observable<{ video_url: string }> {
        return this.http.post<{ video_url: string }>(
            `${API_CONFIG.baseUrl}/text-to-sign`,
            { text }
        );
    }

    textToSign3D(text: string): Observable<{ animation_sequence: any[] }> {
        return this.http.post<{ animation_sequence: any[] }>(
            `${API_CONFIG.baseUrl}/text-to-sign-3d`,
            { text }
        );
    }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../api-config';

@Injectable({
    providedIn: 'root'
})
export class SignToTextService {
    private http = inject(HttpClient);

    signToText(videoFile: File): Observable<{ translated_text: string }> {
        const formData = new FormData();
        formData.append("file", videoFile);

        return this.http.post<{ translated_text: string }>(
            `${API_CONFIG.baseUrl}/sign-to-text`,
            formData
        );
    }

    connectWS(): WebSocket {
        return new WebSocket(`${API_CONFIG.wsUrl}/ws/sign-to-text`);
    }
}

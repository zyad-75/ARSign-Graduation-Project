import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-features-hub',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './features-hub.html',
  styleUrl: './features-hub.scss',
})
export class FeaturesHub {

}

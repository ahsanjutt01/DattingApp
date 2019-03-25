import { PathLocationStrategy } from '@angular/common';
import { Photo } from './Photo';

export interface User {
  id: number;
  username: string;
  age: number;
  knownAs: string;
  gender: string;
  created: Date;
  lastAactive: Date;
  photoUrl: string;
  city: string;
  country: string;
  intrest?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
}

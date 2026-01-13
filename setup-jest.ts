// 1. Zone.js MUST be first
import 'zone.js';
import 'zone.js/testing';

// 2. Then the preset
import 'jest-preset-angular/jest-preset';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

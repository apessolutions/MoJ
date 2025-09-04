import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleConfig } from '../config/google-config.type';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleMapsService {
  private apiKey: string;
  private baseUrl: string;
  constructor(
    configService: ConfigService<GoogleConfig>,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = configService.get('google.googleApiKey', { infer: true })!;
    this.baseUrl = configService.get('google.mapUrl', { infer: true })!;
  }

  private _getArea(addressComponents: any[]) {
    const address = addressComponents.find((address) => {
      if (address.types[0] === 'administrative_area_level_2') {
        return true;
      }
      return false;
    });

    return address ? address.long_name : null;
  }

  async getZone(lat: number, long: number): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}`, {
        params: {
          key: this.apiKey,
          language: 'en',
          latlng: `${lat}, ${long}`,
          result_type: `administrative_area_level_2|administrative_area_level_3|locality`,
        },
      }),
    );

    const addressComponents = data.results[0].address_components;
    const zone = await this._getArea(addressComponents);

    return zone ?? 'No zone';
  }
}

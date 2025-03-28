import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

interface WeatherData {
  base?: string;
  clouds?: {
    all: number;
  };
  cod?: string;
  coord?: {
    lon: number;
    lat: number;
  };
  dt?: number;
  id?: number;
  main?: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  name?: string;
  sys?: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone?: number;
  visibility?: number;
  weather?: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  wind?: {
    deg: number;
    speed: number;
  };
}

interface WeatherDataHD {
  forecast: {
    forecastday: [
      {
        astro: {
          sunrise: string;
          sunset: string;
          moonrise: string;
          moonset: string;
          moon_phase: string;
          moon_illumination: string;
        }
        date: string;
        date_epoch: number;
        day: {
          maxtemp_c: number;
          mintemp_c: number;
          avgtemp_c: number;
          maxwind_kph: number;
          totalprecip_mm: number;
          avghumidity: number;
          condition: {
            text: string;
            icon: string;
          };
        };
        hour: [
          {
            chance_of_rain: number;
            chance_of_snow: number;
            cloud: number;
            condition: {
              text: string;
              icon: string;
              code: number;
            };
            dewpoint_c: number;
            dewpoint_f: number;
            feelslike_c: number;
            feelslike_f: number;
            gust_kph: number;
            gust_mph: number;
            heatindex_c: number;
            heatindex_f: number;
            humidity: number;
            is_day: number;
            precip_in: number;
            precip_mm: number;
            pressure_in: number;
            pressure_mb: number;
            snow_cm: number;
            temp_c: number;
            temp_f: number;
            time: string;
            time_epoch: number;
            uv: number;
            vis_km: number;
            vis_miles: number;
            will_it_rain: number;
            will_it_snow: number;
            wind_degree: number;
            wind_dir: string;
            wind_kph: number;
            wind_mph: number;
            windchill_c: number;
            windchill_f: number;
          }
        ];
      },
    ];
  };
}

export interface WeatherDataResponse {
  openWeatherMap: WeatherData;
  weatherAPI: WeatherDataHD;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  //! USING OPENWEATHER API
  private apiKey = 'cee26e4345a5fe538cc9f9754cc5366b';
  private units = 'metric';
  //! ADDED CORS CONFIGURATION
  private baseUrl = 'https://api.openweathermap.org/data/2.5/';

  //! USING WEATHERAPI
  // private apiKeyHD = '886fc3c45d104f11bb011027242605';
  private apiKeyHD = 'b5af165342b9483bba0122658252803';
  private baseUrlHD = 'http://api.weatherapi.com/v1';

  public weatherData: WeatherData;
  public weatherDataHD: WeatherDataHD;

  constructor(public http: HttpClient) {
    this.weatherData = { name: '' };
    this.weatherDataHD = {
      forecast: {
        forecastday: [
          {
            date: '',
            date_epoch: 0,
            day: {
              maxtemp_c: 0,
              mintemp_c: 0,
              avgtemp_c: 0,
              maxwind_kph: 0,
              totalprecip_mm: 0,
              avghumidity: 0,
              condition: {
                text: '',
                icon: '',
              },
            },
            hour: [
              {
                chance_of_rain: 0,
                chance_of_snow: 0,
                cloud: 0,
                condition: {
                  text: '',
                  icon: '',
                  code: 0,
                },
                dewpoint_c: 0,
                dewpoint_f: 0,
                feelslike_c: 0,
                feelslike_f: 0,
                gust_kph: 0,
                gust_mph: 0,
                heatindex_c: 0,
                heatindex_f: 0,
                humidity: 0,
                is_day: 0,
                precip_in: 0,
                precip_mm: 0,
                pressure_in: 0,
                pressure_mb: 0,
                snow_cm: 0,
                temp_c: 0,
                temp_f: 0,
                time: '',
                time_epoch: 0,
                uv: 0,
                vis_km: 0,
                vis_miles: 0,
                will_it_rain: 0,
                will_it_snow: 0,
                wind_degree: 0,
                wind_dir: '',
                wind_kph: 0,
                wind_mph: 0,
                windchill_c: 0,
                windchill_f: 0,
              },
            ],
            astro: {
              sunrise: '',
              sunset: '',
              moonrise: '',
              moonset: '',
              moon_phase: '',
              moon_illumination: ''
            }
          },
        ],
      },
    };
  }

  getCurrentWeather(queryString: string): Observable<WeatherDataResponse> {
    //! USING OPENWEATHER API
    const openWeatherMapRequest = this.http.get<WeatherData>(
      `${this.baseUrl}weather?q=${queryString}&appid=${this.apiKey}&units=${this.units}`
    );

    //! USING WEATHERAPI API
    const weatherApiRequest = this.http.get<WeatherDataHD>(
      `${this.baseUrlHD}/forecast.json?key=${this.apiKeyHD}&q=${queryString}&days=8`
    );

    return forkJoin({
      openWeatherMap: openWeatherMapRequest,
      weatherAPI: weatherApiRequest,
    });
  }
}
